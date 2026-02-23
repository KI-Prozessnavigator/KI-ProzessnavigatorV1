<?php
// KI-Prozessnavigator | Contact Form Handler

header('Content-Type: application/json; charset=utf-8');

// Konfiguration laden
require_once __DIR__ . '/config.php';

// Sicherheits-Headers
kp_set_security_headers();

// CORS für erlaubte Origins
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && kp_is_origin_allowed($origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Preflight / OPTIONS (hilft v.a. bei Dev-/Staging-Setups; auf Prod harmless)
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Session starten (für Cookie-Flags und optionale Session-Nutzung)
session_set_cookie_params([
    'secure' => kp_is_https(),
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

// Templates laden
require_once __DIR__ . '/templates/contact-owner.php';
require_once __DIR__ . '/templates/contact-confirmation.php';

/**
 * Rate Limiting: Prüft, ob IP zu viele Anfragen sendet
 */
function checkRateLimit() {
    return kp_rate_limit('contact_form', MAX_REQUESTS_PER_HOUR, SESSION_TIMEOUT);
}

/**
 * Honeypot Check: Prüft, ob Bot das unsichtbare Feld ausgefüllt hat
 */
function checkHoneypot($data) {
    return empty($data[HONEYPOT_FIELD]);
}

/**
 * Input Validierung und Sanitization
 */
function validateAndSanitize($data) {
    $errors = [];
    
    // Vorname
    if (empty($data['firstName'])) {
        $errors[] = 'Vorname ist erforderlich';
    } else {
        $data['firstName'] = htmlspecialchars(trim($data['firstName']), ENT_QUOTES, 'UTF-8');
    }
    
    // Nachname
    if (empty($data['lastName'])) {
        $errors[] = 'Nachname ist erforderlich';
    } else {
        $data['lastName'] = htmlspecialchars(trim($data['lastName']), ENT_QUOTES, 'UTF-8');
    }
    
    // E-Mail
    if (empty($data['email'])) {
        $errors[] = 'E-Mail ist erforderlich';
    } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Ungültige E-Mail-Adresse';
    } else {
        $data['email'] = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    }
    
    // Telefon (optional)
    if (!empty($data['phone'])) {
        $data['phone'] = htmlspecialchars(trim($data['phone']), ENT_QUOTES, 'UTF-8');
    }
    
    // Unternehmen (optional)
    if (!empty($data['company'])) {
        $data['company'] = htmlspecialchars(trim($data['company']), ENT_QUOTES, 'UTF-8');
    }
    
    // Nachricht (optional)
    if (!empty($data['message'])) {
        $data['message'] = htmlspecialchars(trim($data['message']), ENT_QUOTES, 'UTF-8');
    }
    
    // Unternehmensgröße
    if (!empty($data['companySize'])) {
        $data['companySize'] = htmlspecialchars(trim($data['companySize']), ENT_QUOTES, 'UTF-8');
    }
    
    // Interesse
    if (!empty($data['interest'])) {
        $data['interest'] = htmlspecialchars(trim($data['interest']), ENT_QUOTES, 'UTF-8');
    }
    
    return ['data' => $data, 'errors' => $errors];
}

/**
 * E-Mail senden via Resend API
 */
function sendEmail($data) {
    // 1) Betreiber-Mail (Pflicht)
    // 2) Bestätigung an Absender (Nice-to-have; Fehler soll Betreiber-Mail nicht verhindern)
    $ownerPayload = [
        'from' => RESEND_FROM,
        'to' => [RECIPIENT_EMAIL],
        'subject' => kp_contact_owner_subject($data),
        'html' => kp_contact_owner_html($data),
        'text' => kp_contact_owner_plain($data),
        'reply_to' => $data['email'],
    ];

    $error = null;
    $ownerSent = kp_resend_send($ownerPayload, $error);
    if (!$ownerSent) {
        error_log('Contact Form Error: Resend owner email failed. ' . ($error ?? ''));
        return false;
    }

    $confirmationPayload = [
        'from' => RESEND_FROM,
        'to' => [$data['email']],
        'subject' => kp_contact_confirmation_subject(),
        'html' => kp_contact_confirmation_html($data),
        'text' => kp_contact_confirmation_plain($data),
        'reply_to' => RECIPIENT_EMAIL,
    ];
    $confirmationError = null;
    $confirmationSent = kp_resend_send($confirmationPayload, $confirmationError);
    if (!$confirmationSent) {
        error_log('Contact Form Warning: Confirmation email failed. ' . ($confirmationError ?? ''));
    }

    return true;
}

try {
    // Diagnose-Endpoint (nur mit Token/IP erlaubt)
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET' && kp_is_test_endpoint_authorized()) {
        echo json_encode([
            'success' => true,
            'env' => [
                'app_env' => APP_ENV,
                'smtp_host' => SMTP_HOST,
                'smtp_port' => SMTP_PORT,
                'smtp_user_set' => SMTP_USERNAME !== '',
                'smtp_pass_set' => SMTP_PASSWORD !== '',
                'recipient_set' => RECIPIENT_EMAIL !== '',
                'csrf_secret_set' => CSRF_SECRET !== '' && CSRF_SECRET !== 'CHANGE_ME_SET_CSRF_SECRET_IN_ENV',
                'resend_key_set' => RESEND_API_KEY !== '',
                'resend_from_set' => RESEND_FROM !== '',
            ],
            'mailer' => [
                'mail_disabled' => kp_is_mail_disabled(),
            ],
            'request' => [
                'origin' => $_SERVER['HTTP_ORIGIN'] ?? '',
                'referer' => $_SERVER['HTTP_REFERER'] ?? '',
            ],
        ]);
        exit;
    }

    // Nur POST-Requests erlauben
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Nur POST-Requests erlaubt');
    }
    
    // CSRF-Check via Origin/Referer
    if (!kp_enforce_csrf_origin()) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Ungültiger Ursprung der Anfrage.'
        ]);
        exit;
    }

    // Rate Limiting prüfen
    if (!checkRateLimit()) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.'
        ]);
        exit;
    }
    
    // JSON-Daten empfangen (Fallback auf $_POST)
    $json = file_get_contents('php://input');
    $body = trim((string) $json);
    $data = json_decode($body, true);
    if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
        $data = json_decode(stripslashes($body), true);
    }
    if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
        $data = $_POST;
    }
    if (!is_array($data)) {
        throw new Exception('Ungültige Daten');
    }
    
    // Honeypot Check
    if (!checkHoneypot($data)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Spam erkannt'
        ]);
        exit;
    }
    
    // Validierung
    $validation = validateAndSanitize($data);
    
    if (!empty($validation['errors'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Validierungsfehler',
            'errors' => $validation['errors']
        ]);
        exit;
    }
    
    // E-Mail senden
    $sent = sendEmail($validation['data']);
    
    if ($sent) {
        echo json_encode([
            'success' => true,
            'message' => 'Vielen Dank! Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.'
        ]);
    } else {
        throw new Exception('E-Mail konnte nicht gesendet werden');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
    ]);
    
    // Fehler loggen (für Debugging)
    error_log('Contact Form Error: ' . $e->getMessage());
}
?>

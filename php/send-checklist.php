<?php
// KI-Prozessnavigator | Checkliste + Einladung zum kostenlosen Termin

header('Content-Type: application/json; charset=utf-8');

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

// Calendly-URL für kostenlosen Termin
define('CALENDLY_URL', 'https://calendly.com/d-buchele-ki-prozessnavigator/30min');

// Templates laden
require_once __DIR__ . '/templates/checklist-customer.php';
require_once __DIR__ . '/templates/checklist-owner.php';

// Rate Limiting für Checkliste (separater Zähler)
define('MAX_CHECKLIST_REQUESTS_PER_HOUR', 20);

function checkChecklistRateLimit() {
    return kp_rate_limit('checklist', MAX_CHECKLIST_REQUESTS_PER_HOUR, SESSION_TIMEOUT);
}

function checkHoneypot($data) {
    return empty($data['website'] ?? '');
}

function validateEmail($email) {
    return !empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * E-Mail an Kunden senden (Checkliste + Calendly-Link) via Resend
 */
function sendChecklistToCustomer($email) {
    $to = filter_var($email, FILTER_SANITIZE_EMAIL);
    $subject = kp_checklist_customer_subject();
    $body = kp_checklist_customer_html(CALENDLY_URL);
    $plain = kp_checklist_customer_plain(CALENDLY_URL);

    $payload = [
        'from' => RESEND_FROM,
        'to' => [$to],
        'subject' => $subject,
        'html' => $body,
        'text' => $plain,
        'reply_to' => RECIPIENT_EMAIL,
    ];
    $error = null;
    $sent = kp_resend_send($payload, $error);
    if (!$sent) {
        error_log('Checklist Error: Resend customer email failed. ' . ($error ?? ''));
    }
    return $sent;
}

/**
 * Benachrichtigung an Sie (neuer Lead) via Resend
 */
function notifyOwner($customerEmail) {
    $subject = kp_checklist_owner_subject($customerEmail);
    $body = kp_checklist_owner_html($customerEmail, CALENDLY_URL);
    $plain = kp_checklist_owner_plain($customerEmail, CALENDLY_URL);

    $payload = [
        'from' => RESEND_FROM,
        'to' => [RECIPIENT_EMAIL],
        'subject' => $subject,
        'html' => $body,
        'text' => $plain,
        'reply_to' => $customerEmail,
    ];
    $error = null;
    $sent = kp_resend_send($payload, $error);
    if (!$sent) {
        error_log('Checklist Error: Resend owner email failed. ' . ($error ?? ''));
    }
    return $sent;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Nur POST erlaubt');
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

    if (!checkChecklistRateLimit()) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Zu viele Anfragen. Bitte versuchen Sie es in einer Stunde erneut.'
        ]);
        exit;
    }

    $json = file_get_contents('php://input');
    $body = trim((string) $json);
    $data = json_decode($body, true);
    if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
        $data = json_decode(stripslashes($body), true);
    }
    if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
        $data = $_POST;
    }
    if (!is_array($data) || !isset($data['email'])) {
        throw new Exception('E-Mail fehlt');
    }

    if (!checkHoneypot($data)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Spam erkannt']);
        exit;
    }

    $email = trim($data['email']);
    if (!validateEmail($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Bitte geben Sie eine gültige E-Mail-Adresse ein.']);
        exit;
    }

    $sent = sendChecklistToCustomer($email);
    if ($sent) {
        notifyOwner($email);
    }

    if ($sent) {
        echo json_encode([
            'success' => true,
            'message' => 'Vielen Dank! Die Checkliste wurde an Ihre E-Mail gesendet. Darin finden Sie auch den Link zu Ihrem kostenlosen Beratungstermin.'
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
    error_log('Checklist Error: ' . $e->getMessage());
}
?>

<?php
// ==================== KONTAKTFORMULAR BACKEND ====================
// KI-Prozessnavigator | Contact Form Handler
// Mit Spam-Schutz, Rate Limiting und CSRF-Protection

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Sicherheits-Headers
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// CORS für Ihre Domain (ändern Sie die Domain später!)
$allowed_origins = [
    'https://ki-prozessnavigator.de',
    'https://www.ki-prozessnavigator.de',
    'http://localhost'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Preflight / OPTIONS (hilft v.a. bei Dev-/Staging-Setups; auf Prod harmless)
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Session starten für Rate Limiting
session_start();

// Konfiguration laden
require_once __DIR__ . '/config.php';

// Templates laden
require_once __DIR__ . '/templates/contact-owner.php';
require_once __DIR__ . '/templates/contact-confirmation.php';

// ==================== FUNKTIONEN ====================

/**
 * Rate Limiting: Prüft, ob IP zu viele Anfragen sendet
 */
function checkRateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $key = 'rate_limit_' . md5($ip);
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = ['count' => 0, 'time' => time()];
    }
    
    $data = $_SESSION[$key];
    
    // Reset nach 1 Stunde
    if (time() - $data['time'] > SESSION_TIMEOUT) {
        $_SESSION[$key] = ['count' => 1, 'time' => time()];
        return true;
    }
    
    // Zu viele Anfragen
    if ($data['count'] >= MAX_REQUESTS_PER_HOUR) {
        return false;
    }
    
    // Zähler erhöhen
    $_SESSION[$key]['count']++;
    return true;
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
 * E-Mail senden via SMTP
 */
function sendEmail($data) {
    // Autoloader laden (falls vorhanden)
    $autoloadPath = __DIR__ . '/../vendor/autoload.php';
    if (file_exists($autoloadPath)) {
        require_once $autoloadPath;
    }

    // 1) Betreiber-Mail (Pflicht)
    // 2) Bestätigung an Absender (Nice-to-have; Fehler soll Betreiber-Mail nicht verhindern)
    $ownerSent = false;

    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        if (!defined('SMTP_PASSWORD') || SMTP_PASSWORD === '') {
            error_log('Contact Form Error: SMTP_PASSWORD missing (set ENV SMTP_PASSWORD).');
            return false;
        }
        $ownerSent = sendOwnerEmailWithPHPMailer($data);
        if ($ownerSent) {
            $confirmationSent = sendConfirmationEmailWithPHPMailer($data);
            if (!$confirmationSent) {
                error_log('Contact Form Warning: Confirmation email could not be sent (PHPMailer).');
            }
        }
        return $ownerSent;
    }

    // Fallback: Native PHP mail()
    $ownerSent = sendOwnerEmailNative($data);
    if ($ownerSent) {
        $confirmationSent = sendConfirmationEmailNative($data);
        if (!$confirmationSent) {
            error_log('Contact Form Warning: Confirmation email could not be sent (native mail).');
        }
    }
    return $ownerSent;
}

/**
 * Betreiber-Mail mit PHPMailer senden (empfohlen)
 */
function sendOwnerEmailWithPHPMailer($data) {
    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);

        // SMTP Konfiguration
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;
        $mail->CharSet = 'UTF-8';
        
        // Absender und Empfänger
        $mail->setFrom(SMTP_USERNAME, 'KI-Prozessnavigator Website');
        $mail->addAddress(RECIPIENT_EMAIL);
        $mail->addReplyTo($data['email'], $data['firstName'] . ' ' . $data['lastName']);
        
        // E-Mail Inhalt
        $mail->isHTML(true);
        $mail->Subject = kp_contact_owner_subject($data);
        $mail->Body = kp_contact_owner_html($data);
        $mail->AltBody = kp_contact_owner_plain($data);
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log('PHPMailer Error (Owner): ' . $e->getMessage());
        return false;
    }
}

/**
 * Bestätigung an Absender mit PHPMailer senden
 */
function sendConfirmationEmailWithPHPMailer($data) {
    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);

        // SMTP Konfiguration
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom(SMTP_USERNAME, 'KI-Prozessnavigator');
        $mail->addAddress($data['email']);
        $mail->addReplyTo(RECIPIENT_EMAIL, 'KI-Prozessnavigator');

        $mail->isHTML(true);
        $mail->Subject = kp_contact_confirmation_subject();
        $mail->Body = kp_contact_confirmation_html($data);
        $mail->AltBody = kp_contact_confirmation_plain($data);

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log('PHPMailer Error (Confirmation): ' . $e->getMessage());
        return false;
    }
}

/**
 * Betreiber-Mail mit nativer PHP mail() Funktion senden (Fallback)
 */
function sendOwnerEmailNative($data) {
    $to = RECIPIENT_EMAIL;
    $subject = kp_contact_owner_subject($data);
    $message = kp_contact_owner_plain($data);
    
    $headers = [
        'From: ' . SMTP_USERNAME,
        'Reply-To: ' . $data['email'],
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8'
    ];
    
    return mail($to, $subject, $message, implode("\r\n", $headers));
}

/**
 * Bestätigung an Absender mit nativer PHP mail() Funktion senden (Fallback)
 */
function sendConfirmationEmailNative($data) {
    $to = $data['email'];
    $subject = kp_contact_confirmation_subject();
    $html = kp_contact_confirmation_html($data);
    $plain = kp_contact_confirmation_plain($data);

    $boundary = 'kp_' . md5((string)microtime(true));
    $headers = [
        'From: KI-Prozessnavigator <' . SMTP_USERNAME . '>',
        'Reply-To: ' . RECIPIENT_EMAIL,
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];

    $body =
        "--{$boundary}\r\n" .
        "Content-Type: text/plain; charset=UTF-8\r\n\r\n" .
        $plain . "\r\n\r\n" .
        "--{$boundary}\r\n" .
        "Content-Type: text/html; charset=UTF-8\r\n\r\n" .
        $html . "\r\n\r\n" .
        "--{$boundary}--\r\n";

    return mail($to, $subject, $body, implode("\r\n", $headers));
}

// ==================== HAUPTLOGIK ====================

try {
    // Nur POST-Requests erlauben
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Nur POST-Requests erlaubt');
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
    
    // JSON-Daten empfangen
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!$data) {
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

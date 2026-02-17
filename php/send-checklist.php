<?php
// ==================== CHECKLISTE / LEAD MAGNET BACKEND ====================
// KI-Prozessnavigator | Checkliste + Einladung zum kostenlosen Termin
// Mit Spam-Schutz und Rate Limiting

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

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

session_start();
require_once __DIR__ . '/config.php';

// Calendly-URL für kostenlosen Termin
define('CALENDLY_URL', 'https://calendly.com/d-buchele-ki-prozessnavigator/30min');

// Templates laden
require_once __DIR__ . '/templates/checklist-customer.php';
require_once __DIR__ . '/templates/checklist-owner.php';

// Rate Limiting für Checkliste (separater Zähler)
define('MAX_CHECKLIST_REQUESTS_PER_HOUR', 20);

function checkChecklistRateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $key = 'checklist_rate_' . md5($ip);
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = ['count' => 0, 'time' => time()];
    }
    
    $data = $_SESSION[$key];
    if (time() - $data['time'] > SESSION_TIMEOUT) {
        $_SESSION[$key] = ['count' => 1, 'time' => time()];
        return true;
    }
    
    if ($data['count'] >= MAX_CHECKLIST_REQUESTS_PER_HOUR) {
        return false;
    }
    
    $_SESSION[$key]['count']++;
    return true;
}

function checkHoneypot($data) {
    return empty($data['website'] ?? '');
}

function validateEmail($email) {
    return !empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * E-Mail an Kunden senden (Checkliste + Calendly-Link)
 */
function sendChecklistToCustomer($email) {
    // Autoloader laden (falls vorhanden)
    $autoloadPath = __DIR__ . '/../vendor/autoload.php';
    if (file_exists($autoloadPath)) {
        require_once $autoloadPath;
    }
    
    $to = filter_var($email, FILTER_SANITIZE_EMAIL);
    $subject = kp_checklist_customer_subject();
    $body = kp_checklist_customer_html(CALENDLY_URL);
    $plain = kp_checklist_customer_plain(CALENDLY_URL);
    
    // PHPMailer nutzen, falls verfügbar
    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        if (!defined('SMTP_PASSWORD') || SMTP_PASSWORD === '') {
            error_log('Checklist Error: SMTP_PASSWORD missing (set ENV SMTP_PASSWORD).');
            return false;
        }
        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            
            $mail->isSMTP();
            $mail->Host = SMTP_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = SMTP_USERNAME;
            $mail->Password = SMTP_PASSWORD;
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = SMTP_PORT;
            $mail->CharSet = 'UTF-8';
            
            $mail->setFrom(SMTP_USERNAME, 'KI-Prozessnavigator');
            $mail->addAddress($to);
            $mail->addReplyTo(RECIPIENT_EMAIL, 'KI-Prozessnavigator');
            
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $body;
            $mail->AltBody = $plain;
            
            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('PHPMailer Error (Checklist): ' . $e->getMessage());
            return false;
        }
    } else {
        // Fallback: Native mail()
        $headers = [
            'From: KI-Prozessnavigator <' . SMTP_USERNAME . '>',
            'Reply-To: ' . RECIPIENT_EMAIL,
            'X-Mailer: PHP/' . phpversion(),
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8'
        ];
        
        return mail($to, $subject, $body, implode("\r\n", $headers));
    }
}

/**
 * Benachrichtigung an Sie (neuer Lead)
 */
function notifyOwner($customerEmail) {
    $subject = kp_checklist_owner_subject($customerEmail);
    $body = kp_checklist_owner_html($customerEmail, CALENDLY_URL);
    $plain = kp_checklist_owner_plain($customerEmail, CALENDLY_URL);
    
    // PHPMailer nutzen, falls verfügbar
    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        if (!defined('SMTP_PASSWORD') || SMTP_PASSWORD === '') {
            error_log('Checklist Error: SMTP_PASSWORD missing (set ENV SMTP_PASSWORD).');
            return false;
        }
        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            
            $mail->isSMTP();
            $mail->Host = SMTP_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = SMTP_USERNAME;
            $mail->Password = SMTP_PASSWORD;
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = SMTP_PORT;
            $mail->CharSet = 'UTF-8';
            
            $mail->setFrom(SMTP_USERNAME, 'KI-Prozessnavigator');
            $mail->addAddress(RECIPIENT_EMAIL);
            
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $body;
            $mail->AltBody = $plain;
            
            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('PHPMailer Error (Notify): ' . $e->getMessage());
            return false;
        }
    } else {
        // Fallback: Native mail()
        $headers = [
            'From: KI-Prozessnavigator <' . SMTP_USERNAME . '>',
            'Content-Type: text/html; charset=UTF-8'
        ];
        
        return mail(RECIPIENT_EMAIL, $subject, $body, implode("\r\n", $headers));
    }
}

// ==================== HAUPTLOGIK ====================

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Nur POST erlaubt');
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
    $data = json_decode($json, true);

    if (!$data || !isset($data['email'])) {
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

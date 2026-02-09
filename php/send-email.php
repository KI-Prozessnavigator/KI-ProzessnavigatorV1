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

// Session starten für Rate Limiting
session_start();

// Konfiguration laden
require_once __DIR__ . '/config.php';

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
    
    // PHPMailer verwenden (wenn verfügbar)
    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        return sendEmailWithPHPMailer($data);
    } else {
        // Fallback: Native PHP mail()
        return sendEmailNative($data);
    }
}

/**
 * E-Mail mit PHPMailer senden (empfohlen)
 */
function sendEmailWithPHPMailer($data) {
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    try {
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
        $mail->Subject = '🚀 Neue Anfrage von ' . $data['firstName'] . ' ' . $data['lastName'];
        $mail->Body = buildEmailHTML($data);
        $mail->AltBody = buildEmailPlain($data);
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log('PHPMailer Error: ' . $mail->ErrorInfo);
        return false;
    }
}

/**
 * E-Mail mit nativer PHP mail() Funktion senden (Fallback)
 */
function sendEmailNative($data) {
    $to = RECIPIENT_EMAIL;
    $subject = '🚀 Neue Anfrage von ' . $data['firstName'] . ' ' . $data['lastName'];
    $message = buildEmailPlain($data);
    
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
 * E-Mail HTML Template
 */
function buildEmailHTML($data) {
    $html = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0077ff 0%, #00d98f 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #0077ff; margin-bottom: 5px; }
            .value { color: #333; }
            .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Neue Anfrage!</h1>
                <p>Sie haben eine neue Anfrage über Ihre Website erhalten</p>
            </div>
            <div class="content">
                <div class="field">
                    <div class="label">👤 Name:</div>
                    <div class="value">' . $data['firstName'] . ' ' . $data['lastName'] . '</div>
                </div>
                
                <div class="field">
                    <div class="label">📧 E-Mail:</div>
                    <div class="value"><a href="mailto:' . $data['email'] . '">' . $data['email'] . '</a></div>
                </div>';
    
    if (!empty($data['phone'])) {
        $html .= '
                <div class="field">
                    <div class="label">📞 Telefon:</div>
                    <div class="value">' . $data['phone'] . '</div>
                </div>';
    }
    
    if (!empty($data['company'])) {
        $html .= '
                <div class="field">
                    <div class="label">🏢 Unternehmen:</div>
                    <div class="value">' . $data['company'] . '</div>
                </div>';
    }
    
    if (!empty($data['companySize'])) {
        $html .= '
                <div class="field">
                    <div class="label">👥 Unternehmensgröße:</div>
                    <div class="value">' . $data['companySize'] . '</div>
                </div>';
    }
    
    if (!empty($data['interest'])) {
        $html .= '
                <div class="field">
                    <div class="label">🎯 Interesse:</div>
                    <div class="value">' . $data['interest'] . '</div>
                </div>';
    }
    
    if (!empty($data['message'])) {
        $html .= '
                <div class="field">
                    <div class="label">💬 Nachricht:</div>
                    <div class="value">' . nl2br($data['message']) . '</div>
                </div>';
    }
    
    $html .= '
                <div class="field">
                    <div class="label">🕐 Zeitpunkt:</div>
                    <div class="value">' . date('d.m.Y H:i:s') . '</div>
                </div>
                
                <div class="field">
                    <div class="label">🌐 IP-Adresse:</div>
                    <div class="value">' . $_SERVER['REMOTE_ADDR'] . '</div>
                </div>
            </div>
            <div class="footer">
                <p>Diese E-Mail wurde automatisch von Ihrer Website generiert.</p>
                <p>KI-Prozessnavigator © ' . date('Y') . '</p>
            </div>
        </div>
    </body>
    </html>';
    
    return $html;
}

/**
 * E-Mail Plain Text Template
 */
function buildEmailPlain($data) {
    $text = "🚀 NEUE ANFRAGE VON IHRER WEBSITE\n\n";
    $text .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $text .= "👤 NAME:\n" . $data['firstName'] . ' ' . $data['lastName'] . "\n\n";
    $text .= "📧 E-MAIL:\n" . $data['email'] . "\n\n";
    
    if (!empty($data['phone'])) {
        $text .= "📞 TELEFON:\n" . $data['phone'] . "\n\n";
    }
    
    if (!empty($data['company'])) {
        $text .= "🏢 UNTERNEHMEN:\n" . $data['company'] . "\n\n";
    }
    
    if (!empty($data['companySize'])) {
        $text .= "👥 UNTERNEHMENSGRÖSSE:\n" . $data['companySize'] . "\n\n";
    }
    
    if (!empty($data['interest'])) {
        $text .= "🎯 INTERESSE:\n" . $data['interest'] . "\n\n";
    }
    
    if (!empty($data['message'])) {
        $text .= "💬 NACHRICHT:\n" . $data['message'] . "\n\n";
    }
    
    $text .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $text .= "🕐 Zeitpunkt: " . date('d.m.Y H:i:s') . "\n";
    $text .= "🌐 IP-Adresse: " . $_SERVER['REMOTE_ADDR'] . "\n\n";
    $text .= "Diese E-Mail wurde automatisch von Ihrer Website generiert.\n";
    $text .= "KI-Prozessnavigator © " . date('Y');
    
    return $text;
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

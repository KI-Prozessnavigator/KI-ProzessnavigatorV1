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

session_start();
require_once __DIR__ . '/config.php';

// Calendly-URL für kostenlosen Termin
define('CALENDLY_URL', 'https://calendly.com/d-buchele-ki-prozessnavigator/30min');

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
    $subject = '📥 Ihre Checkliste: 10 Prozesse, die Sie JETZT automatisieren sollten';
    
    $body = buildChecklistEmailHTML($to);
    $plain = buildChecklistEmailPlain();
    
    // PHPMailer nutzen, falls verfügbar
    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
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
            $mail->addReplyTo('d.buchele@ki-prozessnavigator.de', 'KI-Prozessnavigator');
            
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $body;
            $mail->AltBody = $plain;
            
            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('PHPMailer Error (Checklist): ' . $mail->ErrorInfo);
            return false;
        }
    } else {
        // Fallback: Native mail()
        $headers = [
            'From: KI-Prozessnavigator <' . SMTP_USERNAME . '>',
            'Reply-To: d.buchele@ki-prozessnavigator.de',
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
    $subject = '📥 Neuer Lead: Checkliste angefordert von ' . $customerEmail;
    $body = "
    <p>Ein B2B-Kunde hat die Checkliste angefordert.</p>
    <p><strong>E-Mail des Kunden:</strong> <a href=\"mailto:{$customerEmail}\">{$customerEmail}</a></p>
    <p><strong>Zeitpunkt:</strong> " . date('d.m.Y H:i:s') . "</p>
    <p><strong>IP:</strong> " . ($_SERVER['REMOTE_ADDR'] ?? '') . "</p>
    <hr>
    <p>Der Kunde hat die Checkliste per E-Mail erhalten inkl. Einladung zum kostenlosen Beratungstermin.</p>
    <p><a href=\"" . CALENDLY_URL . "\">→ Calendly öffnen</a></p>
    ";
    
    // PHPMailer nutzen, falls verfügbar
    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
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
            
            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('PHPMailer Error (Notify): ' . $mail->ErrorInfo);
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

/**
 * HTML-E-Mail mit Checkliste + Calendly-Einladung
 */
function buildChecklistEmailHTML($customerEmail) {
    $calendlyLink = CALENDLY_URL;
    
    $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ihre Checkliste – KI-Prozessnavigator</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .wrapper { max-width: 600px; margin: 0 auto; padding: 20px; }
        .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0077ff 0%, #00d98f 100%); color: #fff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 1.5rem; }
        .header p { margin: 10px 0 0; opacity: 0.95; font-size: 0.95rem; }
        .content { padding: 30px; }
        .content h2 { color: #0077ff; font-size: 1.2rem; margin-top: 0; border-bottom: 2px solid #0077ff; padding-bottom: 8px; }
        .checklist { list-style: none; padding: 0; margin: 0; }
        .checklist li { padding: 12px 0; border-bottom: 1px solid #eee; display: flex; align-items: flex-start; gap: 12px; }
        .checklist li:last-child { border-bottom: none; }
        .checklist-num { background: #0077ff; color: #fff; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.85rem; flex-shrink: 0; }
        .checklist-title { font-weight: bold; color: #333; }
        .checklist-desc { font-size: 0.9rem; color: #555; margin-top: 4px; }
        .cta-box { background: #f0f9ff; border: 2px solid #0077ff; border-radius: 12px; padding: 24px; margin: 28px 0; text-align: center; }
        .cta-box h3 { margin: 0 0 12px; color: #0077ff; font-size: 1.15rem; }
        .cta-box p { margin: 0 0 16px; color: #444; }
        .btn { display: inline-block; background: linear-gradient(135deg, #0077ff 0%, #00d98f 100%); color: #fff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 0.85rem; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1>📥 Ihre Checkliste ist da!</h1>
                <p>10 Prozesse, die Sie JETZT automatisieren sollten</p>
            </div>
            <div class="content">
                <h2>✅ Die 10 Prozesse im Überblick</h2>
                <ol class="checklist">
                    <li>
                        <span class="checklist-num">1</span>
                        <div>
                            <span class="checklist-title">Lead-Qualifizierung</span>
                            <p class="checklist-desc">Erstgespräche führen, Anfragen einstufen – KI übernimmt die Vorauswahl. Typisch: 40 % mehr qualifizierte Termine.</p>
                        </div>
                    </li>
                    <li>
                        <span class="checklist-num">2</span>
                        <div>
                            <span class="checklist-title">Bewerbungs-Screening</span>
                            <p class="checklist-desc">Bewerbungen analysieren, ranken und Kurzfeedback – in Minuten statt Tagen. Ca. 8 h/Woche Ersparnis.</p>
                        </div>
                    </li>
                    <li>
                        <span class="checklist-num">3</span>
                        <div>
                            <span class="checklist-title">Rechnungsprüfung</span>
                            <p class="checklist-desc">OCR, Abgleich mit Bestellungen, Freigabe-Workflows. Fehlerquote nahe 0 %, weniger manuelle Prüfung.</p>
                        </div>
                    </li>
                    <li>
                        <span class="checklist-num">4</span>
                        <div>
                            <span class="checklist-title">FAQ-Beantwortung</span>
                            <p class="checklist-desc">Standardfragen sofort beantworten, Eskalation an Menschen nur bei Bedarf. Bis zu 60 % weniger Tickets.</p>
                        </div>
                    </li>
                    <li>
                        <span class="checklist-num">5</span>
                        <div>
                            <span class="checklist-title">Ticket-Routing</span>
                            <p class="checklist-desc">Anfragen nach Thema und Priorität zuordnen und an die richtige Stelle leiten. Schnellere Reaktionszeiten.</p>
                        </div>
                    </li>
                    <li>
                        <span class="checklist-num">6</span>
                        <div>
                            <span class="checklist-title">E-Mail-Klassifizierung</span>
                            <p class="checklist-desc">Eingehende E-Mails kategorisieren, Dringlichkeit erkennen und Vorlagen vorschlagen.</p>
                        </div>
                    </li>
                    <li>
                        <span class="checklist-num">7</span>
                        <div>
                            <span class="checklist-title">Dokumenten-Extraktion</span>
                            <p class="checklist-desc">Daten aus Rechnungen, Verträgen oder Formularen auslesen und in Systeme übernehmen.</p>
                        </div>
                    </li>
                    <li>
                        <span class="checklist-num">8</span>
                        <div>
                            <span class="checklist-title">Terminbuchung</span>
                            <p class="checklist-desc">Kalender prüfen, passende Slots vorschlagen und Termine buchen – ohne Hin und Her.</p>
                        </div>
                    </li>
                    <li>
                        <span class="checklist-num">9</span>
                        <div>
                            <span class="checklist-title">Datenabgleich</span>
                            <p class="checklist-desc">Stammdaten zwischen Systemen abgleichen, Duplikate erkennen und Bereinigung vorschlagen.</p>
                        </div>
                    </li>
                    <li>
                        <span class="checklist-num">10</span>
                        <div>
                            <span class="checklist-title">Report-Generierung</span>
                            <p class="checklist-desc">Zahlen aus Quellen sammeln, aufbereiten und wöchentliche oder monatliche Reports erzeugen.</p>
                        </div>
                    </li>
                </ol>

                <div class="cta-box">
                    <h3>🚀 Nächster Schritt: Kostenloses Beratungsgespräch</h3>
                    <p>Sie möchten wissen, welche dieser Prozesse in Ihrem Unternehmen am meisten bringen?<br>Buchen Sie jetzt einen <strong>kostenlosen 30-Minuten-Termin</strong> – unverbindlich und ohne Verkaufsdruck.</p>
                    <a href="' . $calendlyLink . '" class="btn">Jetzt kostenlosen Termin buchen →</a>
                </div>

                <p style="font-size: 0.9rem; color: #666;">Bei Fragen antworten Sie einfach auf diese E-Mail. Wir melden uns innerhalb von 24 Stunden.</p>
            </div>
            <div class="footer">
                <p>KI-Prozessnavigator · Intelligente Automatisierung für den Mittelstand</p>
                <p><a href="https://ki-prozessnavigator.de/datenschutz.html" style="color: #0077ff;">Datenschutzerklärung</a></p>
            </div>
        </div>
    </div>
</body>
</html>';
    
    return $html;
}

function buildChecklistEmailPlain() {
    $calendlyLink = CALENDLY_URL;
    return "Ihre Checkliste: 10 Prozesse, die Sie JETZT automatisieren sollten\n\n"
        . "1. Lead-Qualifizierung\n2. Bewerbungs-Screening\n3. Rechnungsprüfung\n4. FAQ-Beantwortung\n"
        . "5. Ticket-Routing\n6. E-Mail-Klassifizierung\n7. Dokumenten-Extraktion\n8. Terminbuchung\n"
        . "9. Datenabgleich\n10. Report-Generierung\n\n"
        . "Kostenloses Beratungsgespräch buchen: " . $calendlyLink;
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

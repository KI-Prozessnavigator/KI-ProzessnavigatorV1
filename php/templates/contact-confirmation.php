<?php
// ==================== TEMPLATE: Kontaktformular → Bestätigung an Absender ====================
// Geduzt, persönlich, mit 24h-Versprechen und Checklisten-Hinweis.

if (!function_exists('kp_contact_confirmation_subject')) {
    function kp_contact_confirmation_subject(): string
    {
        return '✅ Deine Anfrage ist bei uns – KI-Prozessnavigator';
    }
}

if (!function_exists('kp_contact_confirmation_plain')) {
    function kp_contact_confirmation_plain(array $data): string
    {
        $firstName = trim((string)($data['firstName'] ?? ''));
        $greeting = $firstName !== '' ? ('Hallo ' . $firstName) : 'Hallo';

        return
            $greeting . ",\n\n" .
            "vielen Dank für deine Nachricht! Wir haben deine Anfrage erhalten.\n\n" .
            "Was passiert jetzt?\n" .
            "- Wir melden uns innerhalb von 24 Stunden persönlich bei dir.\n" .
            "- Du bekommst eine ehrliche Einschätzung, wo Automatisierung bei dir den größten Hebel hat.\n" .
            "- Kein Verkaufsdruck – versprochen.\n\n" .
            "Bis bald!\n" .
            "Dominik Buchele\n" .
            "KI-Prozessnavigator\n\n" .
            "P.S. Kennst du schon unsere kostenlose Checkliste? \"10 Prozesse, die du sofort automatisieren kannst\" – " .
            "hol sie dir auf https://ki-prozessnavigator.de/#faq\n";
    }
}

if (!function_exists('kp_contact_confirmation_html')) {
    function kp_contact_confirmation_html(array $data): string
    {
        $firstName = trim((string)($data['firstName'] ?? ''));
        $greeting = $firstName !== '' ? ('Hallo ' . htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8')) : 'Hallo';

        return '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bestätigung – KI-Prozessnavigator</title>
    <style>
        body { font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .wrapper { max-width: 600px; margin: 0 auto; padding: 20px; }
        .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0077ff 0%, #00d98f 100%); color: #fff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 1.4rem; }
        .header p { margin: 8px 0 0; opacity: 0.9; font-size: 0.95rem; }
        .content { padding: 30px; }
        .content p { margin: 0 0 16px; }
        .steps { background: #f0f9ff; border-radius: 10px; padding: 20px 24px; margin: 20px 0; }
        .steps h3 { margin: 0 0 12px; color: #0077ff; font-size: 1rem; }
        .step { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
        .step:last-child { margin-bottom: 0; }
        .step-icon { width: 22px; height: 22px; background: #0077ff; border-radius: 50%; color: #fff; font-size: 0.75rem; font-weight: bold; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
        .step-text { font-size: 0.9rem; color: #444; }
        .cta-box { background: #f8fffe; border: 2px solid #00d98f; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center; }
        .cta-box p { margin: 0 0 12px; font-size: 0.9rem; color: #555; }
        .btn { display: inline-block; background: linear-gradient(135deg, #0077ff 0%, #00d98f 100%); color: #fff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 0.95rem; }
        .signature { margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; }
        .signature strong { color: #333; }
        .muted { color: #999; font-size: 0.85rem; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 0.85rem; }
        .footer a { color: #0077ff; text-decoration: none; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1>✅ Deine Anfrage ist bei uns!</h1>
                <p>Wir melden uns innerhalb von 24 Stunden</p>
            </div>
            <div class="content">
                <p><strong>' . $greeting . ',</strong></p>
                <p>vielen Dank für deine Nachricht! Wir freuen uns, dass du den ersten Schritt machst.</p>

                <div class="steps">
                    <h3>Was passiert jetzt?</h3>
                    <div class="step">
                        <span class="step-icon">1</span>
                        <span class="step-text">Wir schauen uns deine Anfrage an und melden uns <strong>innerhalb von 24 Stunden</strong> persönlich bei dir.</span>
                    </div>
                    <div class="step">
                        <span class="step-icon">2</span>
                        <span class="step-text">Du bekommst eine ehrliche Einschätzung, wo Automatisierung bei dir den <strong>größten Hebel</strong> hat.</span>
                    </div>
                    <div class="step">
                        <span class="step-icon">3</span>
                        <span class="step-text">Kein Verkaufsdruck – du entscheidest in Ruhe, ob und wie es weitergeht.</span>
                    </div>
                </div>

                <div class="cta-box">
                    <p><strong>Schon gesehen?</strong> Unsere kostenlose Checkliste mit den 10 Prozessen, die sich am schnellsten automatisieren lassen:</p>
                    <a href="https://ki-prozessnavigator.de/#faq" class="btn">Checkliste holen →</a>
                </div>

                <div class="signature">
                    <p>Bis bald!<br><strong>Dominik Buchele</strong><br>
                    <span class="muted">KI-Prozessnavigator · Intelligente Automatisierung für den Mittelstand</span></p>
                </div>
            </div>
            <div class="footer">
                <p>KI-Prozessnavigator · Breslauer Str. 11 · 86690 Mertingen</p>
                <p><a href="https://ki-prozessnavigator.de/datenschutz.html">Datenschutz</a> · <a href="https://ki-prozessnavigator.de/impressum.html">Impressum</a></p>
            </div>
        </div>
    </div>
</body>
</html>';
    }
}

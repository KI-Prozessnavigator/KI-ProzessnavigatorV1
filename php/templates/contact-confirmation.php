<?php
// ==================== TEMPLATE: Kontaktformular → Bestätigung an Absender ====================
// Kurz & professionell (ohne Zusammenfassung der Eingaben).

if (!function_exists('kp_contact_confirmation_subject')) {
    function kp_contact_confirmation_subject(): string
    {
        return '✅ Wir haben Ihre Anfrage erhalten – KI-Prozessnavigator';
    }
}

if (!function_exists('kp_contact_confirmation_plain')) {
    function kp_contact_confirmation_plain(array $data): string
    {
        $firstName = trim((string)($data['firstName'] ?? ''));
        $greetingName = $firstName !== '' ? $firstName : 'Guten Tag';

        return
            $greetingName . ",\n\n" .
            "vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.\n\n" .
            "Freundliche Grüße\n" .
            "KI‑Prozessnavigator\n";
    }
}

if (!function_exists('kp_contact_confirmation_html')) {
    function kp_contact_confirmation_html(array $data): string
    {
        $firstName = trim((string)($data['firstName'] ?? ''));
        $greetingName = $firstName !== '' ? htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8') : 'Guten Tag';

        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bestätigung – KI‑Prozessnavigator</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
                .wrapper { max-width: 600px; margin: 0 auto; padding: 20px; }
                .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                .header { background: linear-gradient(135deg, #0077ff 0%, #00d98f 100%); color: #fff; padding: 26px; text-align: center; }
                .header h1 { margin: 0; font-size: 1.25rem; }
                .content { padding: 26px; }
                .content p { margin: 0 0 14px; }
                .muted { color: #666; font-size: 0.92rem; }
                .footer { text-align: center; padding: 18px 26px 24px; color: #888; font-size: 0.85rem; }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="card">
                    <div class="header">
                        <h1>✅ Anfrage erhalten</h1>
                    </div>
                    <div class="content">
                        <p><strong>' . $greetingName . ',</strong></p>
                        <p>vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.</p>
                        <p class="muted">Wenn Sie diese E‑Mail nicht angefordert haben, können Sie sie ignorieren.</p>
                    </div>
                    <div class="footer">
                        KI‑Prozessnavigator · Intelligente Automatisierung für den Mittelstand
                    </div>
                </div>
            </div>
        </body>
        </html>';
    }
}


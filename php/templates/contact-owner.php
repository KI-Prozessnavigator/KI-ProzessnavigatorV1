<?php
// ==================== TEMPLATE: Kontaktformular → Betreiber-Mail ====================
// Enthält nur Template-Funktionen (keine Side-Effects beim Include).

if (!function_exists('kp_contact_owner_subject')) {
    function kp_contact_owner_subject(array $data): string
    {
        $first = trim((string)($data['firstName'] ?? ''));
        $last = trim((string)($data['lastName'] ?? ''));
        $name = trim($first . ' ' . $last);
        if ($name === '') $name = 'Unbekannt';
        return '🚀 Neue Anfrage von ' . $name;
    }
}

if (!function_exists('kp_contact_owner_plain')) {
    function kp_contact_owner_plain(array $data): string
    {
        $text = "🚀 NEUE ANFRAGE VON IHRER WEBSITE\n\n";
        $text .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $text .= "👤 NAME:\n" . (($data['firstName'] ?? '') . ' ' . ($data['lastName'] ?? '')) . "\n\n";
        $text .= "📧 E-MAIL:\n" . ($data['email'] ?? '') . "\n\n";

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
        $text .= "🌐 IP-Adresse: " . ($_SERVER['REMOTE_ADDR'] ?? '') . "\n\n";
        $text .= "Diese E-Mail wurde automatisch von Ihrer Website generiert.\n";
        $text .= "KI-Prozessnavigator © " . date('Y');

        return $text;
    }
}

if (!function_exists('kp_contact_owner_html')) {
    function kp_contact_owner_html(array $data): string
    {
        // Erwartet bereits validierte/sanitisierte Werte aus send-email.php
        $firstName = (string)($data['firstName'] ?? '');
        $lastName = (string)($data['lastName'] ?? '');
        $email = (string)($data['email'] ?? '');
        $phone = (string)($data['phone'] ?? '');
        $company = (string)($data['company'] ?? '');
        $companySize = (string)($data['companySize'] ?? '');
        $interest = (string)($data['interest'] ?? '');
        $message = (string)($data['message'] ?? '');

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
                    <p>Neue Anfrage über deine Website</p>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="label">👤 Name:</div>
                        <div class="value">' . $firstName . ' ' . $lastName . '</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">📧 E-Mail:</div>
                        <div class="value"><a href="mailto:' . $email . '">' . $email . '</a></div>
                    </div>';

        if ($phone !== '') {
            $html .= '
                    <div class="field">
                        <div class="label">📞 Telefon:</div>
                        <div class="value">' . $phone . '</div>
                    </div>';
        }

        if ($company !== '') {
            $html .= '
                    <div class="field">
                        <div class="label">🏢 Unternehmen:</div>
                        <div class="value">' . $company . '</div>
                    </div>';
        }

        if ($companySize !== '') {
            $html .= '
                    <div class="field">
                        <div class="label">👥 Unternehmensgröße:</div>
                        <div class="value">' . $companySize . '</div>
                    </div>';
        }

        if ($interest !== '') {
            $html .= '
                    <div class="field">
                        <div class="label">🎯 Interesse:</div>
                        <div class="value">' . $interest . '</div>
                    </div>';
        }

        if ($message !== '') {
            $html .= '
                    <div class="field">
                        <div class="label">💬 Nachricht:</div>
                        <div class="value">' . nl2br($message) . '</div>
                    </div>';
        }

        $html .= '
                    <div class="field">
                        <div class="label">🕐 Zeitpunkt:</div>
                        <div class="value">' . date('d.m.Y H:i:s') . '</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">🌐 IP-Adresse:</div>
                        <div class="value">' . ($_SERVER['REMOTE_ADDR'] ?? '') . '</div>
                    </div>
                </div>
                <div class="footer">
                    <p>Diese E-Mail wurde automatisch von deiner Website generiert.</p>
                    <p>KI-Prozessnavigator © ' . date('Y') . '</p>
                </div>
            </div>
        </body>
        </html>';

        return $html;
    }
}


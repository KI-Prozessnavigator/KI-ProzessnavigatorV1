<?php
// ==================== TEMPLATE: Checkliste → Betreiber-Benachrichtigung ====================

if (!function_exists('kp_checklist_owner_subject')) {
    function kp_checklist_owner_subject(string $customerEmail): string
    {
        return '📥 Neuer Lead: Checkliste angefordert von ' . $customerEmail;
    }
}

if (!function_exists('kp_checklist_owner_html')) {
    function kp_checklist_owner_html(string $customerEmail, string $calendlyUrl): string
    {
        $emailEsc = htmlspecialchars($customerEmail, ENT_QUOTES, 'UTF-8');
        $ip = htmlspecialchars((string)($_SERVER['REMOTE_ADDR'] ?? ''), ENT_QUOTES, 'UTF-8');

        return '
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#0077ff;">📥 Neuer Checklisten-Lead</h2>
            <p>Ein Interessent hat die Checkliste angefordert.</p>
            <table cellpadding="8" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                <tr><td style="border-bottom:1px solid #eee;font-weight:bold;width:140px;">📧 E-Mail:</td><td style="border-bottom:1px solid #eee;"><a href="mailto:' . $emailEsc . '">' . $emailEsc . '</a></td></tr>
                <tr><td style="border-bottom:1px solid #eee;font-weight:bold;">🕐 Zeitpunkt:</td><td style="border-bottom:1px solid #eee;">' . date('d.m.Y H:i:s') . '</td></tr>
                <tr><td style="border-bottom:1px solid #eee;font-weight:bold;">🌐 IP:</td><td style="border-bottom:1px solid #eee;">' . $ip . '</td></tr>
            </table>
            <p style="margin-top:16px;padding:12px;background:#f0f9ff;border-radius:8px;">
                ✅ Der Interessent hat die Checkliste per E-Mail erhalten – inkl. Einladung zum kostenlosen Erstgespräch.<br>
                <a href="' . htmlspecialchars($calendlyUrl, ENT_QUOTES, 'UTF-8') . '">→ Calendly öffnen</a>
            </p>
        </div>';
    }
}

if (!function_exists('kp_checklist_owner_plain')) {
    function kp_checklist_owner_plain(string $customerEmail, string $calendlyUrl): string
    {
        return
            "Neuer Lead: Checkliste angefordert\n\n" .
            "E-Mail: {$customerEmail}\n" .
            "Zeitpunkt: " . date('d.m.Y H:i:s') . "\n" .
            "IP: " . ($_SERVER['REMOTE_ADDR'] ?? '') . "\n\n" .
            "Calendly: {$calendlyUrl}\n";
    }
}

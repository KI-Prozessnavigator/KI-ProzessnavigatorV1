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

        return "
        <p>Ein B2B-Kunde hat die Checkliste angefordert.</p>
        <p><strong>E-Mail des Kunden:</strong> <a href=\"mailto:{$emailEsc}\">{$emailEsc}</a></p>
        <p><strong>Zeitpunkt:</strong> " . date('d.m.Y H:i:s') . "</p>
        <p><strong>IP:</strong> {$ip}</p>
        <hr>
        <p>Der Kunde hat die Checkliste per E-Mail erhalten inkl. Einladung zum kostenlosen Beratungstermin.</p>
        <p><a href=\"{$calendlyUrl}\">→ Calendly öffnen</a></p>
        ";
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


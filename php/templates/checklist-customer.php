<?php
// ==================== TEMPLATE: Checkliste → an Anfragenden ====================
// Geduzt, ergebnisorientiert, 10 Prozesse für B2B-Mittelstand.
// Enthält Checkliste + Einladung zum Termin (Calendly-Link wird übergeben).

if (!function_exists('kp_checklist_customer_subject')) {
    function kp_checklist_customer_subject(): string
    {
        return '📥 Deine Checkliste: 10 Prozesse, die du sofort automatisieren kannst';
    }
}

if (!function_exists('kp_checklist_customer_plain')) {
    function kp_checklist_customer_plain(string $calendlyUrl): string
    {
        return
            "Deine Checkliste: 10 Prozesse, die du sofort automatisieren kannst\n\n" .
            "1. Kundenanfragen automatisch beantworten – Standardfragen erledigen sich von selbst, dein Team kümmert sich nur noch um die echten Anliegen.\n" .
            "2. Leads automatisch bewerten & priorisieren – Keine heiße Anfrage bleibt mehr liegen. KI erkennt, wer kaufbereit ist.\n" .
            "3. Rechnungen & Belege verarbeiten – Rechnungen prüfen sich selbst, Abgleich mit Bestellungen läuft automatisch.\n" .
            "4. Angebote & Auftragsbestätigungen erstellen – Vom Kundenwunsch zum fertigen PDF in unter einer Minute.\n" .
            "5. E-Mails sortieren & vorstrukturieren – Eingehende Mails werden automatisch kategorisiert und an die richtige Person weitergeleitet.\n" .
            "6. Termine & Follow-ups koordinieren – Kein Hin-und-Her mehr. Kalender abgleichen, Slots vorschlagen, buchen – automatisch.\n" .
            "7. Neue Mitarbeiter einarbeiten – Onboarding-Checklisten, Zugänge und Schulungsunterlagen automatisch zusammenstellen.\n" .
            "8. Berichte & Reports generieren – Wöchentliche oder monatliche Auswertungen entstehen auf Knopfdruck statt in Handarbeit.\n" .
            "9. Kundendaten zwischen Systemen abgleichen – CRM, Buchhaltung und Co. sprechen endlich dieselbe Sprache.\n" .
            "10. Wiederkehrende Aufgaben im Backoffice – Mahnungen, Statusupdates, Erinnerungen – alles, was sich wiederholt, läuft automatisch.\n\n" .
            "Kostenloses Erstgespräch buchen: " . $calendlyUrl . "\n";
    }
}

if (!function_exists('kp_checklist_customer_html')) {
    function kp_checklist_customer_html(string $calendlyUrl): string
    {
        $cUrl = htmlspecialchars($calendlyUrl, ENT_QUOTES, 'UTF-8');

        $items = [
            ['title' => 'Kundenanfragen automatisch beantworten', 'desc' => 'Standardfragen erledigen sich von selbst – dein Team kümmert sich nur noch um die echten Anliegen. Typisch: bis zu 60 % weniger Tickets.'],
            ['title' => 'Leads bewerten & priorisieren', 'desc' => 'Keine heiße Anfrage bleibt mehr liegen. KI erkennt, wer kaufbereit ist – dein Vertrieb ruft die Richtigen zuerst an.'],
            ['title' => 'Rechnungen & Belege verarbeiten', 'desc' => 'Rechnungen prüfen sich selbst: Abgleich mit Bestellungen, Freigabe-Workflows, Fehlerquote nahe Null.'],
            ['title' => 'Angebote & Auftragsbestätigungen erstellen', 'desc' => 'Vom Kundenwunsch zum fertigen PDF in unter einer Minute – inklusive individueller Kalkulation.'],
            ['title' => 'E-Mails sortieren & vorstrukturieren', 'desc' => 'Eingehende Mails werden automatisch kategorisiert, priorisiert und an die richtige Person weitergeleitet.'],
            ['title' => 'Termine & Follow-ups koordinieren', 'desc' => 'Kein Hin-und-Her mehr. Kalender abgleichen, Slots vorschlagen, buchen und erinnern – alles automatisch.'],
            ['title' => 'Neue Mitarbeiter einarbeiten', 'desc' => 'Onboarding-Checklisten, Zugänge, Schulungsunterlagen – automatisch zusammengestellt, damit niemand den Überblick verliert.'],
            ['title' => 'Berichte & Reports generieren', 'desc' => 'Wöchentliche oder monatliche Auswertungen entstehen auf Knopfdruck – statt stundenlang in Excel.'],
            ['title' => 'Kundendaten zwischen Systemen abgleichen', 'desc' => 'CRM, Buchhaltung und Projekttools sprechen endlich dieselbe Sprache. Duplikate erkennen, Daten bereinigen – automatisch.'],
            ['title' => 'Wiederkehrende Backoffice-Aufgaben', 'desc' => 'Mahnungen versenden, Statusupdates verschicken, Erinnerungen auslösen – alles, was sich wiederholt, läuft von allein.'],
        ];

        $listHtml = '';
        foreach ($items as $i => $item) {
            $num = $i + 1;
            $title = htmlspecialchars($item['title'], ENT_QUOTES, 'UTF-8');
            $desc = htmlspecialchars($item['desc'], ENT_QUOTES, 'UTF-8');
            // Größerer Kreis (32px) für saubere Zentrierung auch bei "10"
            $listHtml .= '
                    <tr>
                        <td style="padding:14px 0;border-bottom:1px solid #eee;vertical-align:top;width:44px;">
                            <div style="background:#0077ff;color:#fff;width:32px;height:32px;border-radius:50%;font-weight:bold;font-size:' . ($num >= 10 ? '0.75' : '0.85') . 'rem;line-height:32px;text-align:center;margin:0 auto;">' . $num . '</div>
                        </td>
                        <td style="padding:14px 0 14px 12px;border-bottom:1px solid #eee;vertical-align:top;">
                            <strong style="color:#333;font-size:0.95rem;">' . $title . '</strong>
                            <p style="margin:4px 0 0;font-size:0.88rem;color:#555;line-height:1.5;">' . $desc . '</p>
                        </td>
                    </tr>';
        }

        return '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deine Checkliste – KI-Prozessnavigator</title>
</head>
<body style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f5f5f5;">
    <div style="max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#0077ff 0%,#00d98f 100%);color:#fff;padding:30px;text-align:center;">
                <h1 style="margin:0;font-size:1.4rem;">📥 Deine Checkliste ist da!</h1>
                <p style="margin:10px 0 0;opacity:0.95;font-size:0.95rem;">10 Prozesse, die du sofort automatisieren kannst</p>
            </div>
            
            <!-- Content -->
            <div style="padding:30px;">
                <p style="margin:0 0 8px;font-size:0.95rem;color:#555;">
                    Die folgenden 10 Prozesse lassen sich in den meisten Unternehmen schnell und spürbar automatisieren.
                    Für jeden Prozess siehst du, <strong>was sich konkret verbessert</strong>.
                </p>
                
                <h2 style="color:#0077ff;font-size:1.1rem;margin:24px 0 16px;border-bottom:2px solid #0077ff;padding-bottom:8px;">✅ Deine 10 Quick Wins</h2>
                
                <!-- Tabelle statt flexbox/inline-flex = maximale E-Mail-Client-Kompatibilität -->
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                    ' . $listHtml . '
                </table>

                <!-- CTA Box -->
                <div style="background:#f0f9ff;border:2px solid #0077ff;border-radius:12px;padding:24px;margin:28px 0;text-align:center;">
                    <h3 style="margin:0 0 8px;color:#0077ff;font-size:1.1rem;">🚀 Welche dieser Prozesse bringen bei dir am meisten?</h3>
                    <p style="margin:0 0 16px;color:#444;font-size:0.9rem;">
                        In 30 Minuten finden wir gemeinsam heraus, wo dein größter Hebel liegt –<br>
                        <strong>kostenlos und unverbindlich</strong>.
                    </p>
                    <a href="' . $cUrl . '" style="display:inline-block;background:linear-gradient(135deg,#0077ff 0%,#00d98f 100%);color:#fff !important;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:bold;font-size:0.95rem;">Kostenlosen Termin buchen →</a>
                </div>

                <p style="font-size:0.88rem;color:#666;">Bei Fragen antworte einfach auf diese E-Mail – wir melden uns innerhalb von 24 Stunden.</p>
            </div>
            
            <!-- Footer -->
            <div style="text-align:center;padding:20px;color:#888;font-size:0.85rem;border-top:1px solid #eee;">
                <p style="margin:0 0 4px;">KI-Prozessnavigator · Intelligente Automatisierung für den Mittelstand</p>
                <p style="margin:0;"><a href="https://ki-prozessnavigator.de/datenschutz.html" style="color:#0077ff;text-decoration:none;">Datenschutz</a> · <a href="https://ki-prozessnavigator.de/impressum.html" style="color:#0077ff;text-decoration:none;">Impressum</a></p>
            </div>
        </div>
    </div>
</body>
</html>';
    }
}

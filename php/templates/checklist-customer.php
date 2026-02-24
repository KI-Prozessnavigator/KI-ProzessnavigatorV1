<?php
// ==================== TEMPLATE: Checkliste → an Anfragenden ====================
// Enthält Checkliste + Einladung zum Termin (Calendly-Link wird übergeben).

if (!function_exists('kp_checklist_customer_subject')) {
    function kp_checklist_customer_subject(): string
    {
        return '📥 Ihre Checkliste: 10 Prozesse, die Sie JETZT automatisieren sollten';
    }
}

if (!function_exists('kp_checklist_customer_plain')) {
    function kp_checklist_customer_plain(string $calendlyUrl): string
    {
        return
            "Ihre Checkliste: 10 Prozesse, die Sie JETZT automatisieren sollten\n\n" .
            "1. Lead-Qualifizierung\n" .
            "2. Bewerbungs-Screening\n" .
            "3. Rechnungsprüfung\n" .
            "4. FAQ-Beantwortung\n" .
            "5. Ticket-Routing\n" .
            "6. E-Mail-Klassifizierung\n" .
            "7. Dokumenten-Extraktion\n" .
            "8. Terminbuchung\n" .
            "9. Datenabgleich\n" .
            "10. Report-Generierung\n\n" .
            "Kostenloses Beratungsgespräch buchen: " . $calendlyUrl . "\n";
    }
}

if (!function_exists('kp_checklist_customer_html')) {
    function kp_checklist_customer_html(string $calendlyUrl): string
    {
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
                    <a href="' . $calendlyUrl . '" class="btn">Jetzt kostenlosen Termin buchen →</a>
                </div>

                <p style="font-size: 0.9rem; color: #666;">Bei Fragen antworten Sie einfach auf diese E-Mail. Wir melden uns innerhalb von 24 Stunden.</p>
            </div>
            <div class="footer">
                <p>KI-Prozessnavigator · Intelligente Automatisierung für den Mittelstand</p>
                <p><a href="https://ki-prozessnavigator.de/datenschutz" style="color: #0077ff;">Datenschutzerklärung</a></p>
            </div>
        </div>
    </div>
</body>
</html>';

        return $html;
    }
}


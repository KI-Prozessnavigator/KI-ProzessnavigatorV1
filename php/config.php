<?php
// ==================== E-MAIL KONFIGURATION ====================

// Empfänger E-Mail (Ihre E-Mail)
define('RECIPIENT_EMAIL', 'd.buchele@ki-prozessnavigator.de');

// SMTP Konfiguration für Gmail
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'd.buchele@ki-prozessnavigator.de');

// WICHTIG: Sie müssen hier ein App-spezifisches Passwort von Google eintragen!
// Anleitung: https://support.google.com/accounts/answer/185833
define('SMTP_PASSWORD', 'HIER_IHR_GOOGLE_APP_PASSWORT_EINTRAGEN');

// ==================== SPAM-SCHUTZ EINSTELLUNGEN ====================

// Rate Limiting: Max. Anfragen pro IP/Stunde
define('MAX_REQUESTS_PER_HOUR', 3);

// Session Timeout (in Sekunden)
define('SESSION_TIMEOUT', 3600);

// Erlaubte Domains (leer lassen für alle)
define('ALLOWED_ORIGINS', [
    'https://ki-prozessnavigator.de',
    'https://www.ki-prozessnavigator.de',
    'http://localhost' // Für lokales Testen
]);

// ==================== SICHERHEIT ====================

// CSRF Token Secret (ändern Sie diesen Wert!)
define('CSRF_SECRET', 'AENDERN_SIE_DIESEN_GEHEIMEN_SCHLUESSEL_' . bin2hex(random_bytes(16)));

// Honeypot Field Name (nicht ändern!)
define('HONEYPOT_FIELD', 'website');

?>

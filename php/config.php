<?php
// ==================== E-MAIL KONFIGURATION ====================

// Empfänger E-Mail (Ihre E-Mail)
define('RECIPIENT_EMAIL', 'd.buchele@ki-prozessnavigator.de');

// SMTP Konfiguration für Gmail
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'd.buchele@ki-prozessnavigator.de');

// SMTP_PASSWORD: Den Platzhalter HIER_IHR_GOOGLE_APP_PASSWORT_EINTRAGEN durch Ihr
// Google App-Passwort ersetzen (oder IONOS-SMTP-Passwort, falls Sie IONOS-Mail nutzen).
// Anleitung Google: https://support.google.com/accounts/answer/185833
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

// CSRF_SECRET: Die Zeile mit random_bytes(16) durch einen festen Wert ersetzen, z. B.:
//   define('CSRF_SECRET', 'IhrFesterGeheimerStringMindestens32ZeichenLang123');
// (Eigenen langen Zufallsstring wählen – nur einmal setzen, danach nicht mehr ändern.)
define('CSRF_SECRET', 'AENDERN_SIE_DIESEN_GEHEIMEN_SCHLUESSEL_' . bin2hex(random_bytes(16)));

// Honeypot Field Name (nicht ändern!)
define('HONEYPOT_FIELD', 'website');

?>

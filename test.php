<?php
/**
 * PHP Status Test
 * Diese Datei prüft, ob PHP auf dem Server funktioniert
 */
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Status Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .success { color: #2e7d32; font-weight: bold; }
        .info { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 10px 0; }
        h1 { color: #0077ff; }
    </style>
</head>
<body>
    <h1>✅ PHP funktioniert!</h1>
    
    <div class="info">
        <p class="success">PHP Version: <?php echo phpversion(); ?></p>
        <p><strong>Server:</strong> <?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Unbekannt'; ?></p>
        <p><strong>PHP SAPI:</strong> <?php echo php_sapi_name(); ?></p>
        <p><strong>Betriebssystem:</strong> <?php echo PHP_OS; ?></p>
    </div>
    
    <h2>Wichtige PHP-Funktionen für E-Mail-Versand:</h2>
    <div class="info">
        <p>fsockopen: <?php echo function_exists('fsockopen') ? '<span class="success">✅ Verfügbar</span>' : '<span style="color:red">❌ Nicht verfügbar</span>'; ?></p>
        <p>socket_create: <?php echo function_exists('socket_create') ? '<span class="success">✅ Verfügbar</span>' : '<span style="color:red">❌ Nicht verfügbar</span>'; ?></p>
        <p>mail(): <?php echo function_exists('mail') ? '<span class="success">✅ Verfügbar</span>' : '<span style="color:red">❌ Nicht verfügbar</span>'; ?></p>
        <p>curl: <?php echo function_exists('curl_init') ? '<span class="success">✅ Verfügbar</span>' : '<span style="color:red">❌ Nicht verfügbar</span>'; ?></p>
    </div>
    
    <h2>PHP-Konfiguration:</h2>
    <div class="info">
        <p>allow_url_fopen: <?php echo ini_get('allow_url_fopen') ? '<span class="success">✅ An</span>' : '<span style="color:red">❌ Aus</span>'; ?></p>
        <p>max_execution_time: <?php echo ini_get('max_execution_time'); ?> Sekunden</p>
        <p>memory_limit: <?php echo ini_get('memory_limit'); ?></p>
    </div>
    
    <p style="margin-top: 30px; color: #666;">
        <strong>Nächster Schritt:</strong> Wenn alle wichtigen Funktionen verfügbar sind, 
        können Sie mit test-smtp.php die SMTP-Verbindung testen.
    </p>
</body>
</html>

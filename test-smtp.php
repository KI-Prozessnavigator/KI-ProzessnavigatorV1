<?php
/**
 * SMTP Connection Test
 * Prüft, ob der Server eine Verbindung zu Gmail SMTP herstellen kann
 */
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMTP Verbindungstest</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .success { color: #2e7d32; font-weight: bold; }
        .error { color: #c62828; font-weight: bold; }
        .info { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .warning { background: #fff3e0; padding: 15px; border-radius: 8px; margin: 10px 0; }
        h1 { color: #0077ff; }
        code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>🔌 SMTP Verbindungstest</h1>
    
    <?php
    // Test-Konfigurationen
    $tests = [
        ['host' => 'smtp.gmail.com', 'port' => 587, 'name' => 'Gmail SMTP (TLS)'],
        ['host' => 'smtp.gmail.com', 'port' => 465, 'name' => 'Gmail SMTP (SSL)'],
        ['host' => 'smtp.ionos.de', 'port' => 587, 'name' => 'IONOS SMTP (TLS)'],
    ];
    
    foreach ($tests as $test) {
        echo "<h2>Test: {$test['name']}</h2>";
        echo "<div class='info'>";
        echo "<p><strong>Host:</strong> {$test['host']}</p>";
        echo "<p><strong>Port:</strong> {$test['port']}</p>";
        
        echo "<p><strong>Verbindungstest:</strong> ";
        
        $startTime = microtime(true);
        $connection = @fsockopen($test['host'], $test['port'], $errno, $errstr, 10);
        $duration = round((microtime(true) - $startTime) * 1000);
        
        if ($connection) {
            echo "<span class='success'>✅ ERFOLGREICH</span></p>";
            echo "<p>Verbindung hergestellt in {$duration}ms</p>";
            fclose($connection);
            
            // Empfehlung
            if ($test['host'] === 'smtp.gmail.com' && $test['port'] === 587) {
                echo "<div class='warning'>";
                echo "<p><strong>✅ Empfehlung:</strong> Verwenden Sie diese Konfiguration in <code>php/config.php</code>:</p>";
                echo "<pre style='background:#fff; padding:10px; border-radius:4px;'>";
                echo "define('SMTP_HOST', 'smtp.gmail.com');\n";
                echo "define('SMTP_PORT', 587);</pre>";
                echo "</div>";
            }
        } else {
            echo "<span class='error'>❌ FEHLGESCHLAGEN</span></p>";
            echo "<p><strong>Fehler:</strong> {$errstr} (Code: {$errno})</p>";
            echo "<p><strong>Mögliche Ursachen:</strong></p>";
            echo "<ul>";
            echo "<li>Port {$test['port']} wird von der Firewall blockiert</li>";
            echo "<li>Ausgehende Verbindungen sind eingeschränkt</li>";
            echo "<li>Server hat keine Internetverbindung</li>";
            echo "</ul>";
        }
        
        echo "</div>";
    }
    ?>
    
    <h2>PHP Socket-Funktionen</h2>
    <div class="info">
        <p>fsockopen(): <?php echo function_exists('fsockopen') ? '<span class="success">✅ Verfügbar</span>' : '<span class="error">❌ Nicht verfügbar</span>'; ?></p>
        <p>socket_create(): <?php echo function_exists('socket_create') ? '<span class="success">✅ Verfügbar</span>' : '<span class="error">❌ Nicht verfügbar</span>'; ?></p>
        
        <?php if (!function_exists('fsockopen')): ?>
        <div class="warning">
            <p><strong>⚠️ Warnung:</strong> Die Funktion <code>fsockopen()</code> ist deaktiviert.</p>
            <p>Dies kann den E-Mail-Versand verhindern. Kontaktieren Sie Ihren Hosting-Support oder aktivieren Sie die Funktion in der php.ini.</p>
        </div>
        <?php endif; ?>
    </div>
    
    <h2>Zusammenfassung & Nächste Schritte</h2>
    <div class="info">
        <?php
        // Prüfe, ob mindestens eine Verbindung funktioniert
        $gmailWorks = @fsockopen('smtp.gmail.com', 587, $errno, $errstr, 5);
        if ($gmailWorks) {
            fclose($gmailWorks);
            echo "<p class='success'>✅ Ihr Server kann E-Mails über Gmail SMTP versenden!</p>";
            echo "<p><strong>Nächster Schritt:</strong> Konfigurieren Sie <code>php/config.php</code> mit Ihrem Google App-Passwort.</p>";
        } else {
            $ionosWorks = @fsockopen('smtp.ionos.de', 587, $errno, $errstr, 5);
            if ($ionosWorks) {
                fclose($ionosWorks);
                echo "<p class='success'>✅ Ihr Server kann E-Mails über IONOS SMTP versenden!</p>";
                echo "<p><strong>Empfehlung:</strong> Nutzen Sie IONOS SMTP statt Gmail.</p>";
            } else {
                echo "<p class='error'>❌ Keine SMTP-Verbindung möglich.</p>";
                echo "<p><strong>Lösung:</strong> Kontaktieren Sie IONOS Support und bitten Sie um Freischaltung von Port 587.</p>";
            }
        }
        ?>
    </div>
    
    <p style="margin-top: 30px; color: #666; font-size: 12px;">
        Nach erfolgreichem Test können Sie diese Datei vom Server löschen (Sicherheit).
    </p>
</body>
</html>

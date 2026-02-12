# ====================================================================
# SICHERER PHP UPLOAD - KI-Prozessnavigator
# ====================================================================
# Lädt die PHP-Konfiguration und Test-Dateien sicher per SCP hoch
# Verschlüsselte Übertragung über SSH (Port 22)
# ====================================================================

$ErrorActionPreference = "Stop"

# Server-Konfiguration
$SERVER_IP = "213.165.76.107"
$SERVER_USER = "root"
$REMOTE_PATH = "/var/www/html"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PHP E-Mail Upload (Sicher via SCP)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Prüfen, ob SCP verfügbar ist
try {
    $null = Get-Command scp -ErrorAction Stop
    Write-Host "[OK] SCP ist verfügbar" -ForegroundColor Green
} catch {
    Write-Host "[FEHLER] SCP nicht gefunden!" -ForegroundColor Red
    Write-Host "Installation: OpenSSH muss installiert sein" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Server: $SERVER_USER@$SERVER_IP" -ForegroundColor Yellow
Write-Host "Ziel: $REMOTE_PATH" -ForegroundColor Yellow
Write-Host ""

# Dateien, die hochgeladen werden
$filesToUpload = @(
    @{
        Local = "test.php"
        Remote = "$REMOTE_PATH/test.php"
        Description = "PHP Status Test"
    },
    @{
        Local = "test-smtp.php"
        Remote = "$REMOTE_PATH/test-smtp.php"
        Description = "SMTP Verbindungstest"
    },
    @{
        Local = "php/config.php"
        Remote = "$REMOTE_PATH/php/config.php"
        Description = "PHP Konfiguration (mit Passwort)"
    }
)

# Bestätigung einholen
Write-Host "Folgende Dateien werden hochgeladen:" -ForegroundColor Yellow
Write-Host ""
foreach ($file in $filesToUpload) {
    if (Test-Path $file.Local) {
        $fileSize = (Get-Item $file.Local).Length
        Write-Host "  [OK] $($file.Local) ($fileSize Bytes) -> $($file.Description)" -ForegroundColor Green
    } else {
        Write-Host "  [FEHLER] $($file.Local) nicht gefunden!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
$confirm = Read-Host "Fortfahren? (j/n)"
if ($confirm -ne "j" -and $confirm -ne "J") {
    Write-Host "Abgebrochen." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Upload startet..." -ForegroundColor Cyan
Write-Host ""

# Upload durchführen
$successCount = 0
foreach ($file in $filesToUpload) {
    Write-Host "Uploading: $($file.Local)..." -ForegroundColor Yellow
    
    try {
        # SCP Upload (verschlüsselt über SSH)
        $scpCommand = "scp `"$($file.Local)`" ${SERVER_USER}@${SERVER_IP}:$($file.Remote)"
        Invoke-Expression $scpCommand
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] Erfolgreich hochgeladen" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  [FEHLER] Upload fehlgeschlagen (Exit Code: $LASTEXITCODE)" -ForegroundColor Red
        }
    } catch {
        Write-Host "  [FEHLER] $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Berechtigungen setzen (wichtig für Apache)
Write-Host "Setze Datei-Berechtigungen..." -ForegroundColor Cyan
$chmodCommand = @"
ssh ${SERVER_USER}@${SERVER_IP} 'chown www-data:www-data /var/www/html/test*.php /var/www/html/php/config.php && chmod 644 /var/www/html/test*.php && chmod 640 /var/www/html/php/config.php'
"@

try {
    Invoke-Expression $chmodCommand
    Write-Host "[OK] Berechtigungen gesetzt" -ForegroundColor Green
} catch {
    Write-Host "[WARNUNG] Berechtigungen konnten nicht gesetzt werden" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Upload abgeschlossen!" -ForegroundColor Cyan
Write-Host "Erfolgreich: $successCount/$($filesToUpload.Count) Dateien" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Nächste Schritte
Write-Host "NÄCHSTE SCHRITTE:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. PHP Status testen:" -ForegroundColor White
Write-Host "   https://ki-prozessnavigator.de/test.php" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. SMTP Verbindung testen:" -ForegroundColor White
Write-Host "   https://ki-prozessnavigator.de/test-smtp.php" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Nach erfolgreichen Tests:" -ForegroundColor White
Write-Host "   - Test-Dateien vom Server löschen (Sicherheit!)" -ForegroundColor Yellow
Write-Host "   - Kontaktformular auf der Website testen" -ForegroundColor Yellow
Write-Host ""

# Optional: Browser öffnen
$openBrowser = Read-Host "Test-Seite im Browser öffnen? (j/n)"
if ($openBrowser -eq "j" -or $openBrowser -eq "J") {
    Start-Process "https://ki-prozessnavigator.de/test.php"
}

Write-Host ""
Write-Host "Fertig! " -ForegroundColor Green

# ====================================================================
# PHP UPLOAD - Direkt und einfach
# ====================================================================
# Lädt die PHP-Dateien per SCP auf den Server
# ====================================================================

$ErrorActionPreference = "Stop"

$SERVER_IP = "213.165.76.107"
$SERVER_USER = "root"
$REMOTE_PATH = "/var/www/html/php"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PHP E-Mail Upload" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server: $SERVER_USER@$SERVER_IP" -ForegroundColor Yellow
Write-Host "Ziel: $REMOTE_PATH/" -ForegroundColor Yellow
Write-Host ""

# Dateien hochladen
$files = @("config.php", "send-email.php", "send-checklist.php")

Write-Host "Lade Dateien hoch..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $files) {
    Write-Host "  Uploading: php/$file..." -ForegroundColor Yellow
    
    try {
        scp "php/$file" "${SERVER_USER}@${SERVER_IP}:${REMOTE_PATH}/$file"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] $file hochgeladen" -ForegroundColor Green
        } else {
            Write-Host "  [FEHLER] Upload fehlgeschlagen" -ForegroundColor Red
        }
    } catch {
        Write-Host "  [FEHLER] $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Setze Berechtigungen..." -ForegroundColor Cyan

ssh ${SERVER_USER}@${SERVER_IP} "chown www-data:www-data ${REMOTE_PATH}/*.php && chmod 640 ${REMOTE_PATH}/config.php && chmod 644 ${REMOTE_PATH}/send-*.php"

Write-Host "[OK] Fertig!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NÄCHSTER SCHRITT: Backend testen" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Öffnen Sie:" -ForegroundColor White
Write-Host "  https://ki-prozessnavigator.de/php/send-email.php" -ForegroundColor Cyan
Write-Host ""
Write-Host "Erwartung:" -ForegroundColor White
Write-Host '  {"success":false,"message":"Nur POST-Requests erlaubt"}' -ForegroundColor Yellow
Write-Host ""
Write-Host "Dann Kontaktformular auf Ihrer Website testen!" -ForegroundColor Green
Write-Host ""

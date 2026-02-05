# SSL-Fix: www.ki-prozessnavigator.de - Apache ServerAlias setzen und neu laden
# Einmal ausfuehren, wenn Certbot "vhost ambiguity" fuer www gemeldet hat.
# Nutzung: .\scripts\ssl-fix-www.ps1

$server = "213.165.76.107"
$user   = "root"

$fixCmd = 'grep -q ServerAlias /etc/apache2/sites-available/000-default-le-ssl.conf || (sed -i "/ServerName ki-prozessnavigator.de/a \    ServerAlias www.ki-prozessnavigator.de" /etc/apache2/sites-available/000-default-le-ssl.conf) && systemctl reload apache2 && echo Fertig.'

Write-Host "Verbinde mit $user@${server} - Passwort eingeben." -ForegroundColor Cyan
Write-Host ""

ssh "${user}@${server}" $fixCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "www-Fix angewendet. Testen: https://www.ki-prozessnavigator.de" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Fehler (Exit-Code $LASTEXITCODE)." -ForegroundColor Yellow
    exit $LASTEXITCODE
}

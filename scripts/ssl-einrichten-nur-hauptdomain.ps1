# SSL nur fuer ki-prozessnavigator.de (ohne www) - vermeidet "vhost ambiguity"
# Nutzung: .\scripts\ssl-einrichten-nur-hauptdomain.ps1
# Danach: https://ki-prozessnavigator.de testen. www ggf. mit .\scripts\ssl-fix-www.ps1

$server = "213.165.76.107"
$user   = "root"
$email  = "d.buchele@ki-prozessnavigator.de"

$cmd = 'certbot --apache -d ki-prozessnavigator.de --non-interactive --agree-tos -m ' + $email + '; systemctl restart apache2; echo Fertig'

Write-Host "Verbinde mit $user@${server} - ggf. Passwort eingeben (oder SSH-Key)." -ForegroundColor Cyan
Write-Host "Richtet SSL nur fuer ki-prozessnavigator.de ein (ohne www)." -ForegroundColor Cyan
Write-Host ""

ssh "${user}@${server}" $cmd

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SSL eingerichtet. Testen: https://ki-prozessnavigator.de" -ForegroundColor Green
    Write-Host "Fuer www danach: .\scripts\ssl-fix-www.ps1" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Fehler (Exit-Code $LASTEXITCODE)." -ForegroundColor Yellow
    exit $LASTEXITCODE
}

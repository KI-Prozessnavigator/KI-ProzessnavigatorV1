# SSL auf dem Server einrichten - ein Befehl, Passwort einmal eingeben
# Nutzung: .\scripts\ssl-einrichten-remote.ps1

$server = "213.165.76.107"
$user   = "root"
$email  = "d.buchele@ki-prozessnavigator.de"

$remoteCmd = "apt update && apt install -y certbot python3-certbot-apache && certbot --apache -d ki-prozessnavigator.de -d www.ki-prozessnavigator.de --non-interactive --agree-tos -m " + $email

Write-Host "Verbinde mit $user@${server} - Sie werden nach dem Passwort gefragt." -ForegroundColor Cyan
Write-Host "Danach werden Certbot und SSL automatisch eingerichtet." -ForegroundColor Cyan
Write-Host ""

ssh "${user}@${server}" $remoteCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SSL eingerichtet. Im Browser testen: https://ki-prozessnavigator.de" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Fehler (Exit-Code $LASTEXITCODE). Pruefen Sie: Passwort, Netzwerk, Firewall (Port 22, 80, 443)." -ForegroundColor Yellow
    exit $LASTEXITCODE
}

# www.ki-prozessnavigator.de zu SSL hinzufuegen (ServerAlias + Zertifikat erweitern)
# Nutzung: .\scripts\ssl-www-hinzufuegen.ps1
# Voraussetzung: https://ki-prozessnavigator.de funktioniert bereits.

$server = "213.165.76.107"
$user   = "root"
$email  = "d.buchele@ki-prozessnavigator.de"

Write-Host "Verbinde mit $user@${server} - ggf. Passwort eingeben (oder SSH-Key)." -ForegroundColor Cyan
Write-Host ""

# Schritt 1: ServerAlias www setzen (damit Certbot den VHost findet)
Write-Host "Schritt 1: ServerAlias www.ki-prozessnavigator.de setzen..." -ForegroundColor Cyan
$fixCmd = 'if ! grep -q "ServerAlias www.ki-prozessnavigator.de" /etc/apache2/sites-available/000-default-le-ssl.conf; then sed -i "/ServerName ki-prozessnavigator.de/a ServerAlias www.ki-prozessnavigator.de" /etc/apache2/sites-available/000-default-le-ssl.conf; fi; systemctl reload apache2; echo Schritt1 Fertig'
ssh "${user}@${server}" $fixCmd
if ($LASTEXITCODE -ne 0) {
    Write-Host "Schritt 1 fehlgeschlagen." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host ""

# Schritt 2: Zertifikat um www erweitern (--expand)
Write-Host "Schritt 2: Zertifikat um www.ki-prozessnavigator.de erweitern..." -ForegroundColor Cyan
$certCmd = 'certbot --apache -d ki-prozessnavigator.de -d www.ki-prozessnavigator.de --expand --non-interactive --agree-tos -m ' + $email + '; systemctl reload apache2; echo Schritt2 Fertig'
ssh "${user}@${server}" $certCmd
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Schritt 2 fehlgeschlagen. Zertifikat enthaelt www evtl. noch nicht." -ForegroundColor Yellow
    Write-Host "Manuell auf dem Server ausfuehren:" -ForegroundColor Cyan
    Write-Host "  ssh root@213.165.76.107" -ForegroundColor White
    Write-Host "  certbot --apache -d ki-prozessnavigator.de -d www.ki-prozessnavigator.de --expand" -ForegroundColor White
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "www hinzugefuegt. Testen: https://www.ki-prozessnavigator.de" -ForegroundColor Green

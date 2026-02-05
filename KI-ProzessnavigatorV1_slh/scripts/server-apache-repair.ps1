# Apache auf dem Server pruefen und reparieren (Start, SSL-Site aktivieren, Neustart)
# Nutzung: .\scripts\server-apache-repair.ps1
# Passwort: Wird nur abgefragt, wenn Sie keinen SSH-Key hinterlegt haben.

$server = "213.165.76.107"
$user   = "root"

# Ein Befehl pro Zeile, ohne Pipe (vermeidet Parsing-Fehler bei SSH)
$cmd = 'systemctl start apache2; systemctl enable apache2; if [ -f /etc/apache2/sites-available/000-default-le-ssl.conf ]; then a2ensite 000-default-le-ssl; else echo "Hinweis: SSL-Site 000-default-le-ssl.conf fehlt - ggf. .\scripts\ssl-einrichten-remote.ps1 erneut ausfuehren"; fi; apache2ctl configtest; systemctl restart apache2; echo "--- Offene Ports (80/443 fuer Web) ---"; ss -tlnp; echo Fertig'

Write-Host "Verbinde mit $user@${server} - ggf. Passwort eingeben (oder SSH-Key)." -ForegroundColor Cyan
Write-Host ""

ssh "${user}@${server}" $cmd

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Bitte testen: http://213.165.76.107 und https://ki-prozessnavigator.de" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "SSH beendet mit Code $LASTEXITCODE. Pruefen Sie Passwort und Firewall (Port 22)." -ForegroundColor Yellow
    exit $LASTEXITCODE
}

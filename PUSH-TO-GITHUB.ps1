# ============================================================
# Projekt zu GitHub pushen
# ============================================================
# 1. Auf https://github.com/new ein neues Repository anlegen
#    (Name z.B.: KI-ProzessnavigatorV1, OHNE README/.gitignore anlegen)
#
# 2. Unten DEINE GitHub-URL eintragen (z.B. https://github.com/DeinName/KI-ProzessnavigatorV1.git)
# 3. Dieses Skript in PowerShell ausfuehren (Rechtsklick -> Mit PowerShell ausfuehren)
#    oder in Cursor-Terminal: .\PUSH-TO-GITHUB.ps1
# ============================================================

$repoUrl = "https://github.com/KI-Prozessnavigator/KI-ProzessnavigatorV1.git"

Set-Location $PSScriptRoot

if ($repoUrl -match "DEIN_USERNAME|DEIN_REPO_NAME") {
    Write-Host "FEHLER: Bitte in der Datei PUSH-TO-GITHUB.ps1 die Variable repoUrl anpassen!" -ForegroundColor Red
    Write-Host "Traeg ein: https://github.com/DEIN_GITHUB_USERNAME/DEIN_REPO_NAME.git" -ForegroundColor Yellow
    exit 1
}

# Remote hinzufuegen (falls schon vorhanden: entfernen und neu setzen)
$existing = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    git remote remove origin
}
git remote add origin $repoUrl

Write-Host "Push zu $repoUrl ..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Erfolgreich auf GitHub gepusht." -ForegroundColor Green
} else {
    Write-Host "Push fehlgeschlagen. Pruefe:" -ForegroundColor Red
    Write-Host "  - Repo auf GitHub existiert und URL ist korrekt"
    Write-Host "  - Du bist eingeloggt (git credential / Browser)"
    Write-Host "  - Bei HTTPS: ggf. Personal Access Token statt Passwort verwenden"
}

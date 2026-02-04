# ============================================================
# KI-Prozessnavigator – Deploy auf IONOS Cloud Server
# ============================================================
# Nutzung: .\deploy-ionos.ps1
# Vorher: .env.deploy anlegen (siehe .env.deploy.example)
# Zugangsdaten NIEMALS im Chat teilen – nur lokal in .env.deploy
# Vollständige Anleitung (Domain, Data Center, Canvas): docs/IONOS-CLAUDE-SERVER-DEPLOY.md
# ============================================================

$ErrorActionPreference = 'Stop'
$scriptRoot = $PSScriptRoot

# ----- Konfiguration laden -----
$envFile = Join-Path $scriptRoot '.env.deploy'
if (Test-Path $envFile) {
    foreach ($line in Get-Content $envFile -Encoding UTF8) {
        $line = $line.Trim()
        if ($line -and -not $line.StartsWith('#')) {
            if ($line -match '^([^=]+)=(.*)$') {
                $key = $matches[1].Trim()
                $val = $matches[2].Trim().Trim('"').Trim("'")
                Set-Item -Path "Env:$key" -Value $val -ErrorAction SilentlyContinue
            }
        }
    }
}

$hostName = $env:IONOS_HOST
$userName = $env:IONOS_USER
$webRoot  = $env:IONOS_WEBROOT
$sshPort  = if ($env:IONOS_PORT) { $env:IONOS_PORT } else { '22' }
$sshKey   = $env:IONOS_SSH_KEY

if (-not $hostName -or -not $userName -or -not $webRoot) {
    Write-Host "Fehler: Konfiguration fehlt." -ForegroundColor Red
    Write-Host "Kopieren Sie .env.deploy.example nach .env.deploy und tragen Sie ein:" -ForegroundColor Yellow
    Write-Host "  IONOS_HOST, IONOS_USER, IONOS_WEBROOT" -ForegroundColor Yellow
    Write-Host "Optional: IONOS_PORT, IONOS_SSH_KEY" -ForegroundColor Yellow
    exit 1
}

# ----- Temporäres Deploy-Verzeichnis -----
$deployTemp = Join-Path $env:TEMP "ki-prozessnavigator-deploy-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $deployTemp -Force | Out-Null

try {
    Write-Host "Deploy vorbereiten..." -ForegroundColor Cyan

    # Root-Dateien
    @('index.html', 'agb.html', 'datenschutz.html', 'impressum.html', '.htaccess', 'robots.txt', 'sitemap.xml') | ForEach-Object {
        $src = Join-Path $scriptRoot $_
        if (Test-Path $src) { Copy-Item $src $deployTemp -Force }
    }

    # Ordner (ohne .DS_Store, .git, docs, Backups)
    @('css', 'js', 'assets', 'includes', 'php') | ForEach-Object {
        $srcDir = Join-Path $scriptRoot $_
        $dstDir = Join-Path $deployTemp $_
        if (Test-Path $srcDir) {
            New-Item -ItemType Directory -Path $dstDir -Force | Out-Null
            Get-ChildItem $srcDir -Recurse -File | Where-Object { $_.Name -ne '.DS_Store' -and $_.FullName -notmatch '\.git' } | ForEach-Object {
                $rel = $_.FullName.Substring($srcDir.Length + 1)
                $dst = Join-Path $dstDir $rel
                $dstParent = Split-Path $dst -Parent
                if (-not (Test-Path $dstParent)) { New-Item -ItemType Directory -Path $dstParent -Force | Out-Null }
                Copy-Item $_.FullName $dst -Force
            }
        }
    }

    Write-Host "Upload auf $userName@${hostName}:$webRoot ..." -ForegroundColor Cyan

    $uploadItems = (Get-ChildItem $deployTemp -File) + (Get-ChildItem $deployTemp -Directory)
    $scpArgs = @('-P', $sshPort, '-r')
    if ($sshKey -and (Test-Path $sshKey)) { $scpArgs += @('-i', $sshKey) }
    $scpArgs += @($uploadItems.FullName) + @("${userName}@${hostName}:$webRoot")

    & scp @scpArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Upload fehlgeschlagen (scp Exit-Code $LASTEXITCODE)." -ForegroundColor Red
        Write-Host "Prüfen Sie: Host, User, Webroot, SSH-Key/Passwort, Firewall (Port $sshPort)." -ForegroundColor Yellow
        exit $LASTEXITCODE
    }

    Write-Host "Deploy abgeschlossen. Website unter Ihrem Server/Domain prüfen." -ForegroundColor Green
} finally {
    if (Test-Path $deployTemp) { Remove-Item $deployTemp -Recurse -Force -ErrorAction SilentlyContinue }
}

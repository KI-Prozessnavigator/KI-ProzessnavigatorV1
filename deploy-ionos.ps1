# IONOS Deploy – alle Projektdateien per SCP auf den Server
# Voraussetzung: .env.deploy mit IONOS_HOST, IONOS_USER, IONOS_WEBROOT, IONOS_PORT (optional: IONOS_SSH_KEY)
# Nutzung: .\deploy-ionos.ps1   oder   pwsh -File .\deploy-ionos.ps1

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot

# .env.deploy laden
$envFile = Join-Path $ProjectRoot ".env.deploy"
if (-not (Test-Path $envFile)) {
    Write-Host "FEHLER: .env.deploy nicht gefunden. Bitte von .env.deploy.example kopieren und ausfüllen." -ForegroundColor Red
    exit 1
}

$envVars = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
        $envVars[$matches[1]] = $matches[2].Trim().Trim('"').Trim("'")
    }
}

$hostName = $envVars["IONOS_HOST"]
$userName = $envVars["IONOS_USER"]
$webRoot  = $envVars["IONOS_WEBROOT"]
$port     = if ($envVars["IONOS_PORT"]) { $envVars["IONOS_PORT"] } else { "22" }
$sshKey   = $envVars["IONOS_SSH_KEY"]

foreach ($k in @("IONOS_HOST","IONOS_USER","IONOS_WEBROOT")) {
    if (-not $envVars[$k]) {
        Write-Host "FEHLER: In .env.deploy fehlt: $k" -ForegroundColor Red
        exit 1
    }
}

$dest = "${userName}@${hostName}:${webRoot}"
$scpArgs = @("-P", $port, "-r")
if ($sshKey) { $scpArgs += @("-i", $sshKey) }

# Dateien/Ordner die NICHT deployed werden (nur was die Website/Kontaktformular braucht)
$excludeNames = @(
    ".git",
    ".env.deploy",
    "__MACOSX",
    ".DS_Store",
    "Thumbs.db",
    "node_modules",
    ".cursor",
    ".vscode",
    "docs",
    "sandbox",
    "*.backup",
    "*.backup-*",
    "deploy-ionos.ps1",
    "netlify.toml"
)
# php/config.php optional ausnehmen, damit Server-Konfiguration nicht überschrieben wird
$excludeConfigPhp = $true

function ShouldExclude($relativePath) {
    $normalized = $relativePath -replace '\\', '/'
    if ($excludeConfigPhp -and $normalized -eq "php/config.php") { return $true }
    $segments = $normalized -split '/'
    foreach ($seg in $segments) {
        foreach ($ex in $excludeNames) {
            if ($ex -like "**") {
                if ($seg -like $ex) { return $true }
            } elseif ($seg -eq $ex) {
                return $true
            }
        }
    }
    $name = Split-Path -Leaf $relativePath
    foreach ($ex in $excludeNames) {
        if ($ex -like "**" -and $name -like $ex) { return $true }
    }
    return $false
}

# Temporärverzeichnis für Upload (nur gewünschte Dateien)
$tempDir = Join-Path $env:TEMP "ki-prozessnavigator-deploy-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

try {
    Write-Host "Kopiere Projektdateien (ohne .git, .env.deploy, __MACOSX, .DS_Store, etc.)..." -ForegroundColor Cyan
    $count = 0
    Get-ChildItem -Path $ProjectRoot -Recurse -File | ForEach-Object {
        $rel = $_.FullName.Substring($ProjectRoot.Length).TrimStart('\','/')
        if ($rel -match '^\.git\\') { return }
        if (ShouldExclude $rel) { return }
        $destPath = Join-Path $tempDir $rel
        $destDir  = Split-Path -Parent $destPath
        if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
        Copy-Item -Path $_.FullName -Destination $destPath -Force
        $count++
    }
    Write-Host "  -> $count Dateien vorbereitet." -ForegroundColor Green

    Write-Host "Upload per SCP nach ${dest} ..." -ForegroundColor Cyan
    $items = Get-ChildItem -Path $tempDir -Force
    $scpFullArgs = $scpArgs + @($items | ForEach-Object { $_.FullName }) + @($dest)
    & scp @scpFullArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Host "FEHLER: SCP beendet mit Code $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    Write-Host "Deploy abgeschlossen." -ForegroundColor Green
} finally {
    if (Test-Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

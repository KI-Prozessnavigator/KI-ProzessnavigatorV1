# ============================================================================
# IONOS Deploy – KI-Prozessnavigator
# ============================================================================
# Deployt alle Projektdateien per SCP + startet Node-Server neu per SSH.
#
# Voraussetzung: .env.deploy mit IONOS_HOST, IONOS_USER, IONOS_WEBROOT, IONOS_PORT
#                Optional: IONOS_SSH_KEY für Key-basierte Authentifizierung
#
# Nutzung: .\deploy-ionos.ps1
#
# Was dieses Skript tut:
#   1. Projektdateien sammeln (ohne geschützte Dateien)
#   2. Per SCP auf den Server hochladen
#   3. Per SSH: npm install (falls package.json geändert)
#   4. Per SSH: pm2 restart (Node-Server neustart)
#   5. Per SSH: Health-Check (/api/health)
#   6. Per HTTPS: Externer Health-Check (über nginx)
#
# GESCHÜTZTE DATEIEN (werden NIE überschrieben/gelöscht):
#   - .env auf dem Server (enthält echte API-Keys)
#   - node_modules/ auf dem Server (werden per npm install verwaltet)
#   - nginx-Config (/etc/nginx/conf.d/ki-prozessnavigator.conf)
#   - SSL-Zertifikate (/etc/letsencrypt/...)
# ============================================================================

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot

# ==================== .env.deploy laden ====================

$envFile = Join-Path $ProjectRoot ".env.deploy"
if (-not (Test-Path $envFile)) {
    Write-Host ""
    Write-Host "FEHLER: .env.deploy nicht gefunden!" -ForegroundColor Red
    Write-Host "Kopiere .env.deploy.example nach .env.deploy und trage die Zugangsdaten ein." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

$envVars = @{}
Get-Content $envFile | ForEach-Object {
if ($_ -match "^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$") {
        $envVars[$matches[1]] = $matches[2].Trim().Trim('"').Trim([char]39)
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

# SSH/SCP Argumente
$scpBaseArgs = @("-P", $port, "-r")
$sshBaseArgs = @("-p", $port)
if ($sshKey) {
    $scpBaseArgs += @("-i", $sshKey)
    $sshBaseArgs += @("-i", $sshKey)
}
$sshTarget = "${userName}@${hostName}"
$scpDest   = "${sshTarget}:${webRoot}"

# ==================== GESCHÜTZTE DATEIEN ====================
# Diese Dateien/Ordner werden NIE zum Server hochgeladen.
# Sie existieren nur auf dem Server und dürfen nicht überschrieben werden.

$excludeNames = @(
    # Versionskontrolle & Editor
    ".git",
    ".cursor",
    ".vscode",
    
    # Secrets & Konfiguration (Server hat eigene!)
    ".env",
    ".env.deploy",
    ".env.deploy.example",
    ".env.example",
    
    # Node (wird auf dem Server separat verwaltet)
    "node_modules",
    "package-lock.json",
    
    # Betriebssystem-Müll
    "__MACOSX",
    ".DS_Store",
    "Thumbs.db",
    
    # Entwicklung & Dokumentation (nicht auf Server)
    "docs",
    "sandbox",
    "*.backup",
    "*.backup-*",
    "*.bak",
    
    # Deploy-Skript selbst
    "deploy-ionos.ps1",
    
    # Nicht mehr benötigt
    "netlify.toml",
    "_htaccess",
    "_headers",
    "INSTALLATION.md"
)

function ShouldExclude($relativePath) {
$normalized = $relativePath -replace "\\", "/"
$segments = $normalized -split "/"
    foreach ($seg in $segments) {
        foreach ($ex in $excludeNames) {
            if ($ex -contains "*") {
                if ($seg -like $ex) { return $true }
            } elseif ($seg -eq $ex) {
                return $true
            }
        }
    }
    $name = Split-Path -Leaf $relativePath
    foreach ($ex in $excludeNames) {
        if ($ex -contains "*" -and $name -like $ex) { return $true }
    }
    return $false
}

# ==================== HILFSFUNKTION: SSH-Befehl ausführen ====================

function Invoke-SSH($command) {
    $fullArgs = $sshBaseArgs + @($sshTarget, $command)
    & ssh @fullArgs
    return $LASTEXITCODE
}

# ==================== PRE-FLIGHT CHECKS ====================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  KI-Prozessnavigator – Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ziel: ${scpDest}" -ForegroundColor White
Write-Host ""

# Check 1: Gibt es eine server.js?
if (-not (Test-Path (Join-Path $ProjectRoot "server.js"))) {
    Write-Host "FEHLER: server.js nicht gefunden im Projektordner!" -ForegroundColor Red
    exit 1
}

# Check 2: Gibt es eine package.json?
if (-not (Test-Path (Join-Path $ProjectRoot "package.json"))) {
    Write-Host "FEHLER: package.json nicht gefunden im Projektordner!" -ForegroundColor Red
    exit 1
}

# Check 3: Existiert ein php/ Ordner? (Sollte nicht mehr existieren)
if (Test-Path (Join-Path $ProjectRoot "php")) {
    Write-Host "WARNUNG: php/ Ordner existiert noch lokal! PHP wird nicht mehr verwendet." -ForegroundColor Yellow
    Write-Host "Der php/ Ordner wird NICHT hochgeladen." -ForegroundColor Yellow
    # php/ zur Exclude-Liste hinzufügen
    $excludeNames += "php"
}

# Check 4: Referenzieren JS-Dateien noch /php/ Endpoints?
$phpRefs = Get-ChildItem -Path (Join-Path $ProjectRoot "js") -Filter "*.js" -File | 
    Select-String -Pattern "/php/" -SimpleMatch
if ($phpRefs) {
    Write-Host ""
    Write-Host "!!! KRITISCHER FEHLER !!!" -ForegroundColor Red
    Write-Host "JS-Dateien referenzieren noch /php/ Endpoints:" -ForegroundColor Red
    $phpRefs | ForEach-Object { Write-Host "  $($_.Filename):$($_.LineNumber) -> $($_.Line.Trim())" -ForegroundColor Red }
    Write-Host ""
    Write-Host "Das Kontaktformular wird auf dem Server NICHT funktionieren!" -ForegroundColor Red
    Write-Host "JS-Dateien muessen /api/send-email und /api/send-checklist verwenden." -ForegroundColor Red
    Write-Host ""
    $continue = Read-Host "Trotzdem deployen? (j/N)"
    if ($continue -ne "j") { exit 1 }
}

# Check 5: Referenziert server.js die Resend API?
$serverContent = Get-Content (Join-Path $ProjectRoot "server.js") -Raw
if ($serverContent -notmatch "resend" -and $serverContent -notmatch "Resend") {
    Write-Host "WARNUNG: server.js scheint die Resend API nicht zu verwenden!" -ForegroundColor Yellow
}

Write-Host "[PRE-FLIGHT] Alle Checks bestanden." -ForegroundColor Green
Write-Host ""

# ==================== SCHRITT 1: Dateien vorbereiten ====================

Write-Host "[1/5] Projektdateien vorbereiten..." -ForegroundColor Cyan

$tempDir = Join-Path $env:TEMP ("ki-prozessnavigator-deploy-" + (Get-Date -Format "yyyyMMddHHmmss"))
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$fileCount = 0
try {
    Get-ChildItem -Path $ProjectRoot -Recurse -File | ForEach-Object {
        $rel = $_.FullName.Substring($ProjectRoot.Length).TrimStart([char]92, "/")
        if ($rel -match "^\.git[\\/]") { return }
        if (ShouldExclude $rel) { return }
        $destPath = Join-Path $tempDir $rel
        $destDir  = Split-Path -Parent $destPath
        if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
        Copy-Item -Path $_.FullName -Destination $destPath -Force
        $fileCount++
    }
    Write-Host "  -> $fileCount Dateien vorbereitet." -ForegroundColor Green

    # ==================== SCHRITT 2: Upload per SCP ====================

    Write-Host "[2/5] Upload per SCP..." -ForegroundColor Cyan
    $items = Get-ChildItem -Path $tempDir -Force
    $scpFullArgs = $scpBaseArgs + @($items | ForEach-Object { $_.FullName }) + @($scpDest)
    & scp @scpFullArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Host "FEHLER: SCP fehlgeschlagen (Code $LASTEXITCODE)" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    Write-Host "  -> Upload erfolgreich." -ForegroundColor Green

    # ==================== SCHRITT 3: npm install auf Server ====================

    Write-Host "[3/5] npm install auf Server..." -ForegroundColor Cyan
    $npmExit = Invoke-SSH "cd ${webRoot} && npm install --production 2>&1 | tail -3"
    if ($npmExit -ne 0) {
        Write-Host "WARNUNG: npm install hat Fehler gemeldet (Exit: $npmExit)" -ForegroundColor Yellow
        Write-Host "Pruefe ob die Abhaengigkeiten auf dem Server korrekt sind." -ForegroundColor Yellow
    } else {
        Write-Host "  -> npm install erfolgreich." -ForegroundColor Green
    }

    # ==================== SCHRITT 4: pm2 restart ====================

    Write-Host "[4/5] Node-Server neustarten (pm2)..." -ForegroundColor Cyan
    $pm2Exit = Invoke-SSH "pm2 restart ki-prozessnavigator 2>&1 || (cd ${webRoot} && pm2 start server.js --name ki-prozessnavigator 2>&1)"
    if ($pm2Exit -ne 0) {
        Write-Host "WARNUNG: pm2 restart hat Fehler gemeldet (Exit: $pm2Exit)" -ForegroundColor Yellow
    } else {
        Write-Host "  -> Node-Server neugestartet." -ForegroundColor Green
    }

    # Kurz warten bis Server hochgefahren ist
    Start-Sleep -Seconds 3

    # ==================== SCHRITT 5: Health-Checks ====================

    Write-Host "[5/5] Health-Checks..." -ForegroundColor Cyan
    Write-Host ""

    # Check A: pm2 Status
    Write-Host "  [A] pm2 Status:" -ForegroundColor White
    Invoke-SSH "pm2 list 2>&1" | Out-Null
    $pm2Status = & ssh @($sshBaseArgs + @($sshTarget, "pm2 jlist 2>/dev/null")) 2>$null | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($pm2Status -and $pm2Status[0].pm2_env.status -eq "online") {
        Write-Host "      pm2: ONLINE" -ForegroundColor Green
    } else {
        Write-Host "      pm2: PROBLEM – Server scheint nicht zu laufen!" -ForegroundColor Red
        Write-Host "      Pruefe mit: ssh ${sshTarget} ""pm2 logs --lines 20""" -ForegroundColor Yellow
    }

    # Check B: Interner Health-Check (Node direkt)
    Write-Host "  [B] Interner Health-Check (Node -> localhost:3000):" -ForegroundColor White
    $internalHealth = & ssh @($sshBaseArgs + @($sshTarget, "curl -s -o /dev/null -w ""%{http_code}"" http://127.0.0.1:3000/api/health 2>/dev/null")) 2>$null
    if ($internalHealth -eq "200") {
        Write-Host "      Node-Server: OK (HTTP 200)" -ForegroundColor Green
    } else {
        Write-Host "      Node-Server: FEHLER (HTTP $internalHealth)" -ForegroundColor Red
        Write-Host "      Der Node-Server antwortet nicht! Pruefe Logs:" -ForegroundColor Yellow
        Write-Host "      ssh ${sshTarget} ""pm2 logs --lines 20""" -ForegroundColor Yellow
    }

    # Check C: Externer Health-Check (nginx -> Node)
    Write-Host "  [C] Externer Health-Check (nginx -> https://ki-prozessnavigator.de/api/health):" -ForegroundColor White
    $externalHealth = & ssh @($sshBaseArgs + @($sshTarget, "curl -s -o /dev/null -w ""%{http_code}"" -k https://127.0.0.1:443/api/health -H ""Host: ki-prozessnavigator.de"" 2>/dev/null")) 2>$null
    if ($externalHealth -eq "200") {
        Write-Host "      nginx -> Node: OK (HTTP 200)" -ForegroundColor Green
    } else {
        Write-Host "      nginx -> Node: FEHLER (HTTP $externalHealth)" -ForegroundColor Red
        Write-Host "      nginx leitet /api/ nicht an Node weiter!" -ForegroundColor Red
        Write-Host "      LOESUNG: proxy_pass in nginx-Config pruefen:" -ForegroundColor Yellow
        Write-Host "      ssh ${sshTarget} ""grep proxy_pass /etc/nginx/conf.d/ki-prozessnavigator.conf""" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "      Falls kein proxy_pass vorhanden, diesen Block in den HTTPS-Server-Block einfuegen:" -ForegroundColor Yellow
        Write-Host "      location /api/ {" -ForegroundColor Yellow
        Write-Host "          proxy_pass http://127.0.0.1:3000;" -ForegroundColor Yellow
        Write-Host "          proxy_http_version 1.1;" -ForegroundColor Yellow
        Write-Host '          proxy_set_header Host $host;' -ForegroundColor Yellow
        Write-Host '          proxy_set_header X-Real-IP $remote_addr;' -ForegroundColor Yellow
        Write-Host '          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' -ForegroundColor Yellow
        Write-Host '          proxy_set_header X-Forwarded-Proto $scheme;' -ForegroundColor Yellow
        Write-Host "      }" -ForegroundColor Yellow
    }

    # Check D: Resend API konfiguriert?
    Write-Host "  [D] Resend API Konfiguration:" -ForegroundColor White
    $resendCheck = & ssh @($sshBaseArgs + @($sshTarget, "curl -s http://127.0.0.1:3000/api/health 2>/dev/null")) 2>$null
    if ($resendCheck -match '"resend_configured":true') {
        Write-Host "      Resend API: KONFIGURIERT" -ForegroundColor Green
    } else {
        Write-Host "      Resend API: NICHT KONFIGURIERT!" -ForegroundColor Red
        Write-Host "      Die .env auf dem Server hat keinen gueltigen RESEND_API_KEY!" -ForegroundColor Yellow
        Write-Host "      LOESUNG: ssh ${sshTarget} ""nano ${webRoot}/.env""" -ForegroundColor Yellow
    }

    # ==================== ZUSAMMENFASSUNG ====================

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Deploy-Zusammenfassung" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Dateien hochgeladen:  $fileCount" -ForegroundColor White
    Write-Host "  npm install:          ausgefuehrt" -ForegroundColor White
    Write-Host "  pm2 restart:          ausgefuehrt" -ForegroundColor White

    $allGreen = ($internalHealth -eq "200") -and ($externalHealth -eq "200")
    if ($allGreen) {
        Write-Host ""
        Write-Host "  ALLE CHECKS BESTANDEN" -ForegroundColor Green
        Write-Host "  Kontaktformular sollte funktionieren!" -ForegroundColor Green
        Write-Host ""
        Write-Host "  Trotzdem manuell testen:" -ForegroundColor White
        Write-Host "  -> https://ki-prozessnavigator.de/kontakt" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "  !! ACHTUNG: Nicht alle Checks bestanden !!" -ForegroundColor Red
        Write-Host "  Kontaktformular funktioniert moeglicherweise NICHT." -ForegroundColor Red
        Write-Host "  Siehe Fehlermeldungen oben." -ForegroundColor Yellow
        Write-Host ""
    }

} finally {
    # Temporaerverzeichnis aufraeumen
    if (Test-Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

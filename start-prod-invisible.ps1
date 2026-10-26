$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$statusUrl = "http://127.0.0.1:5181/api/health"
$logDir = Join-Path $env:LOCALAPPDATA "SP-F001A"
$watchdogLog = Join-Path $logDir "watchdog.log"
$runner = Join-Path $root "run-prod-server.ps1"

New-Item -ItemType Directory -Path $logDir -Force | Out-Null

$mutex = New-Object Threading.Mutex($false, "Local\SP-F001A-Server-Watchdog")
if (-not $mutex.WaitOne(0)) { exit 0 }

try {
    "$(Get-Date -Format s) - Surveillance du serveur demarree." | Add-Content -LiteralPath $watchdogLog
    while ($true) {
        try {
            $response = Invoke-WebRequest -UseBasicParsing $statusUrl -TimeoutSec 3
            if ($response.StatusCode -eq 200) {
                Start-Sleep -Seconds 30
                continue
            }
        } catch {}

        "$(Get-Date -Format s) - Serveur indisponible, tentative de relance." | Add-Content -LiteralPath $watchdogLog
        & powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File $runner
        $exitCode = $LASTEXITCODE
        "$(Get-Date -Format s) - Processus serveur termine (code $exitCode), nouvelle tentative dans 30 s." | Add-Content -LiteralPath $watchdogLog
        Start-Sleep -Seconds 30
    }
} finally {
    $mutex.ReleaseMutex()
    $mutex.Dispose()
}


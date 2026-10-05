$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = "C:\Users\Julien Grosjean\AppData\Local\Programs\Python\Python311\python.exe"
$dataDir = "\\neu-fs01.neu.orolia\Dpts\OP_SPACE\RAFS_USO\SP-F001(Web)\data"
$statusUrl = "http://127.0.0.1:5181/api/health"
$logDir = Join-Path $env:LOCALAPPDATA "SP-F001A"
$logFile = Join-Path $logDir "scheduled-server.log"

New-Item -ItemType Directory -Path $logDir -Force | Out-Null

try {
    $response = Invoke-WebRequest -UseBasicParsing $statusUrl -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
        "$(Get-Date -Format s) - Serveur deja actif, aucune seconde instance lancee." | Add-Content -LiteralPath $logFile
        exit 0
    }
} catch {}

"$(Get-Date -Format s) - Demarrage planifie sous $([Security.Principal.WindowsIdentity]::GetCurrent().Name)." | Add-Content -LiteralPath $logFile

$networkReady = $false
for ($attempt = 1; $attempt -le 40; $attempt++) {
    if (Test-Path -LiteralPath $dataDir -PathType Container) {
        $networkReady = $true
        break
    }
    if ($attempt -eq 1 -or $attempt % 4 -eq 0) {
        "$(Get-Date -Format s) - Partage reseau indisponible, tentative $attempt/40." | Add-Content -LiteralPath $logFile
    }
    Start-Sleep -Seconds 15
}

if (-not $networkReady) {
    "$(Get-Date -Format s) - ECHEC : partage reseau toujours inaccessible." | Add-Content -LiteralPath $logFile
    exit 2
}

"$(Get-Date -Format s) - Partage accessible, lancement du serveur." | Add-Content -LiteralPath $logFile
Set-Location -LiteralPath $root

$process = Start-Process -FilePath $python -WorkingDirectory $root -PassThru -Wait -WindowStyle Hidden `
    -ArgumentList @("server.py", "--host", "0.0.0.0", "--port", "5181", "--data-dir", ('"' + $dataDir + '"')) `
    -RedirectStandardOutput (Join-Path $logDir "scheduled-server-output.log") `
    -RedirectStandardError (Join-Path $logDir "scheduled-server-http.log")
$code = $process.ExitCode
"$(Get-Date -Format s) - Serveur arrete avec le code $code." | Add-Content -LiteralPath $logFile
exit $code

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = "C:\Users\Julien Grosjean\AppData\Local\Programs\Python\Python311\python.exe"
$dataDir = "\\neu-fs01.neu.orolia\Dpts\OP_SPACE\RAFS_USO\SP-F001(Web)\data"
$statusUrl = "http://127.0.0.1:5181/api/health"
$logDir = Join-Path $env:LOCALAPPDATA "SP-F001A"

New-Item -ItemType Directory -Path $logDir -Force | Out-Null

try {
    $response = Invoke-WebRequest -UseBasicParsing $statusUrl -TimeoutSec 2
    if ($response.StatusCode -eq 200) { exit 0 }
} catch {}

if (-not (Test-Path -LiteralPath $dataDir -PathType Container)) {
    "$(Get-Date -Format s) - Dossier reseau inaccessible : $dataDir" |
        Add-Content -LiteralPath (Join-Path $logDir "launcher-error.log")
    exit 2
}

$arguments = @(
    "server.py", "--host", "0.0.0.0", "--port", "5181",
    "--data-dir", ('"' + $dataDir + '"')
)

Start-Process -FilePath $python -WorkingDirectory $root -WindowStyle Hidden `
    -ArgumentList $arguments `
    -RedirectStandardOutput (Join-Path $logDir "server.log") `
    -RedirectStandardError (Join-Path $logDir "server-error.log")


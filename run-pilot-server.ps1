$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = "C:\Users\Julien Grosjean\AppData\Local\Programs\Python\Python311\python.exe"
$dataDir = "C:\ProgramData\SP-F001A\pilot-data"
$statusUrl = "http://127.0.0.1:5182/api/health"
$logDir = Join-Path $env:LOCALAPPDATA "SP-F001A-Pilot"
$logFile = Join-Path $logDir "scheduled-server.log"
$environmentFile = "C:\ProgramData\SP-F001A\pilot.env"

if (-not (Test-Path -LiteralPath $environmentFile -PathType Leaf)) {
    throw "Configuration du pilote introuvable : $environmentFile"
}

foreach ($line in Get-Content -LiteralPath $environmentFile) {
    $setting = $line.Trim()
    if (-not $setting -or $setting.StartsWith("#") -or -not $setting.Contains("=")) {
        continue
    }
    $name, $value = $setting.Split("=", 2)
    [Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim(), "Process")
}

New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
New-Item -ItemType Directory -Path $logDir -Force | Out-Null

try {
    $response = Invoke-RestMethod -Uri $statusUrl -TimeoutSec 2
    if ($response.ok -and $response.instance -eq "test") {
        "$(Get-Date -Format s) - Pilote deja actif, aucune seconde instance lancee." | Add-Content -LiteralPath $logFile
        exit 0
    }
} catch {}

"$(Get-Date -Format s) - Demarrage du pilote sous $([Security.Principal.WindowsIdentity]::GetCurrent().Name)." | Add-Content -LiteralPath $logFile
Set-Location -LiteralPath $root

$process = Start-Process -FilePath $python -WorkingDirectory $root -PassThru -Wait -WindowStyle Hidden `
    -ArgumentList @("server.py", "--host", "0.0.0.0", "--port", "5182", "--data-dir", ('"' + $dataDir + '"')) `
    -RedirectStandardOutput (Join-Path $logDir "scheduled-server-output.log") `
    -RedirectStandardError (Join-Path $logDir "scheduled-server-http.log")
$code = $process.ExitCode
"$(Get-Date -Format s) - Serveur pilote arrete avec le code $code." | Add-Content -LiteralPath $logFile
exit $code

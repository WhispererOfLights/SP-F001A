[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [int]$Version,
    [string]$Destination = "\\neu-fs01.neu.orolia\Dpts\OP_SPACE\RAFS_USO\SP-F001(Web)"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

& "$PSScriptRoot\test-all.ps1"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$indexPath = Join-Path $root "index.html"
$index = Get-Content $indexPath -Raw
$index = [regex]::Replace($index, 'App\.runtime\.js\?v=\d+', "App.runtime.js?v=$Version")
$index = [regex]::Replace($index, 'clients\.js\?v=\d+', "clients.js?v=$Version")
[IO.File]::WriteAllText($indexPath, $index, [Text.UTF8Encoding]::new($false))

if (-not (Test-Path -LiteralPath $Destination)) {
    throw "Dossier de deploiement introuvable : $Destination"
}

$backupRoot = Join-Path $Destination "deployment-backups"
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = Join-Path $backupRoot "v$Version-$stamp"
New-Item -ItemType Directory -Path $backup -Force | Out-Null

$deployItems = @(
    "index.html", "migration.html", "server.py", "relational_store.py", "src", "assets", "vendor", "scripts", "tests",
    "README.md", "ARCHITECTURE.md", "run-prod-server.ps1", "start-prod.bat", "start-prod-invisible.ps1",
    "start-prod-invisible.vbs", "server-status.vbs", "install-scheduled-task.ps1", "inspect-scheduled-task.ps1",
    "test-scheduled-task.ps1"
)

foreach ($relative in $deployItems) {
    $target = Join-Path $Destination $relative
    if (Test-Path -LiteralPath $target) {
        Copy-Item -LiteralPath $target -Destination $backup -Recurse -Force
    }
}

foreach ($relative in $deployItems) {
    $source = Join-Path $root $relative
    if (Test-Path -LiteralPath $source) {
        Copy-Item -LiteralPath $source -Destination $Destination -Recurse -Force
    }
}

Write-Host "Version v$Version deployee dans $Destination" -ForegroundColor Green
Write-Host "Sauvegarde precedente : $backup"

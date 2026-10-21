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

$configName = "app-config.js"
$targetConfig = Join-Path $Destination $configName
if (Test-Path -LiteralPath $targetConfig) {
    Copy-Item -LiteralPath $targetConfig -Destination $backup -Force
}

$runtimeItems = @(
    "index.html", "server.py", "relational_store.py", "postgres_store.py", "postgres_relational.py", "replication_bridge.py",
    "requirements.txt", "src", "assets", "vendor", "run-prod-server.ps1", "start-prod.bat", "start-prod-invisible.ps1",
    "start-prod-invisible.vbs", "server-status.vbs"
)
$obsoleteDeployItems = @(
    "migration.html", "Dockerfile", "compose.yaml", ".dockerignore", ".env.example", "scripts", "tests",
    "README.md", "ARCHITECTURE.md", "POSTGRESQL-MIGRATION.md", "install-scheduled-task.ps1",
    "inspect-scheduled-task.ps1", "test-scheduled-task.ps1"
)
$backupItems = @($runtimeItems + $obsoleteDeployItems | Select-Object -Unique)

foreach ($relative in $backupItems) {
    $target = Join-Path $Destination $relative
    if (Test-Path -LiteralPath $target) {
        Copy-Item -LiteralPath $target -Destination $backup -Recurse -Force
    }
}

foreach ($relative in $runtimeItems) {
    $source = Join-Path $root $relative
    if (Test-Path -LiteralPath $source) {
        Copy-Item -LiteralPath $source -Destination $Destination -Recurse -Force
    }
}

# Les outils de développement restent dans Git mais ne font plus partie du paquet exécuté.
$destinationFull = [IO.Path]::GetFullPath($Destination).TrimEnd("\")
foreach ($relative in $obsoleteDeployItems) {
    $target = Join-Path $Destination $relative
    $targetFull = [IO.Path]::GetFullPath($target)
    if (-not $targetFull.StartsWith($destinationFull + "\", [StringComparison]::OrdinalIgnoreCase)) {
        throw "Chemin de nettoyage hors du dossier de déploiement : $targetFull"
    }
    if (Test-Path -LiteralPath $target) {
        Remove-Item -LiteralPath $target -Recurse -Force
    }
}

# La configuration d'adresse publique est propre au serveur et survit aux mises à jour.
if (-not (Test-Path -LiteralPath $targetConfig)) {
    Copy-Item -LiteralPath (Join-Path $root $configName) -Destination $targetConfig -Force
}

Write-Host "Version v$Version deployee dans $Destination" -ForegroundColor Green
Write-Host "Sauvegarde precedente : $backup"
Write-Host "Paquet production : $($runtimeItems.Count) elements, outils de developpement exclus."

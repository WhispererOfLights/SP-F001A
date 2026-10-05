[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$bundledNodeModules = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules"
if (-not $env:NODE_PATH -and (Test-Path -LiteralPath $bundledNodeModules)) {
    $env:NODE_PATH = $bundledNodeModules
}

node scripts/build-app.cjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

python -m unittest discover -s tests -p "test_*.py" -v
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$tests = Get-ChildItem tests -Filter "*.cjs" | Sort-Object Name
foreach ($test in $tests) {
    Write-Host ""
    Write-Host "==> $($test.Name)"
    node $test.FullName
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host ""
Write-Host "Tous les tests sont passes." -ForegroundColor Green

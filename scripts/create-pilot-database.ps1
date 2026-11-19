[CmdletBinding()]
param(
    [string]$PilotDatabase = "spf001a_pilot",
    [int]$PilotPort = 5182
)

$ErrorActionPreference = "Stop"

if ($PilotDatabase -notmatch '^[a-z][a-z0-9_]{2,62}$') {
    throw "Nom de base pilote invalide : $PilotDatabase"
}

function Read-EnvironmentFile([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "Fichier de configuration introuvable : $Path"
    }
    $values = @{}
    foreach ($line in Get-Content -LiteralPath $Path) {
        $setting = $line.Trim()
        if (-not $setting -or $setting.StartsWith("#") -or -not $setting.Contains("=")) {
            continue
        }
        $name, $value = $setting.Split("=", 2)
        $values[$name.Trim()] = $value.Trim()
    }
    return $values
}

function Set-PgEnvironment($Settings) {
    foreach ($name in "PGHOST", "PGPORT", "PGDATABASE", "PGUSER", "PGPASSWORD") {
        [Environment]::SetEnvironmentVariable($name, $Settings[$name], "Process")
    }
}

function Invoke-Pg([string]$Program, [string[]]$Arguments) {
    & $Program @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$([IO.Path]::GetFileName($Program)) a echoue avec le code $LASTEXITCODE"
    }
}

$configurationRoot = "C:\ProgramData\SP-F001A"
$admin = Read-EnvironmentFile (Join-Path $configurationRoot "postgres.env")
$application = Read-EnvironmentFile (Join-Path $configurationRoot "server.env")
$adminSecretPath = Join-Path $configurationRoot "postgres-admin.secret"
if (-not (Test-Path -LiteralPath $adminSecretPath -PathType Leaf)) {
    throw "Secret administrateur PostgreSQL introuvable : $adminSecretPath"
}
$admin["PGDATABASE"] = "postgres"
$admin["PGUSER"] = "postgres"
$admin["PGPASSWORD"] = (Get-Content -LiteralPath $adminSecretPath -Raw).Trim()
$sourceDatabase = $application.PGDATABASE
$applicationUser = $application.PGUSER

if (-not $sourceDatabase -or -not $applicationUser) {
    throw "La configuration de production ne contient pas PGDATABASE et PGUSER."
}
if ($PilotDatabase -eq $sourceDatabase) {
    throw "La base pilote doit etre differente de la production."
}

$postgresBin = "C:\Program Files\PostgreSQL\17\bin"
$psql = Join-Path $postgresBin "psql.exe"
$pgDump = Join-Path $postgresBin "pg_dump.exe"
$pgRestore = Join-Path $postgresBin "pg_restore.exe"
$createdb = Join-Path $postgresBin "createdb.exe"
$dropdb = Join-Path $postgresBin "dropdb.exe"
foreach ($program in $psql, $pgDump, $pgRestore, $createdb, $dropdb) {
    if (-not (Test-Path -LiteralPath $program -PathType Leaf)) {
        throw "Outil PostgreSQL introuvable : $program"
    }
}

Set-PgEnvironment $admin
$exists = & $psql -X -tA -d postgres -c "SELECT 1 FROM pg_database WHERE datname='$PilotDatabase'"
if ($null -eq $exists) {
    $exists = ""
} else {
    $exists = ($exists | Out-String).Trim()
}
if ($LASTEXITCODE -ne 0) {
    throw "Impossible de verifier l'existence de la base pilote."
}
if ($exists -eq "1") {
    throw "La base $PilotDatabase existe deja. Aucun remplacement automatique n'a ete effectue."
}

$staging = Join-Path $configurationRoot "backup-staging"
New-Item -ItemType Directory -Path $staging -Force | Out-Null
$dumpPath = Join-Path $staging ("pilot-seed-{0}.dump" -f (Get-Date -Format "yyyyMMdd-HHmmss"))
$databaseCreated = $false

try {
    Write-Host "Creation d'un instantane coherent de $sourceDatabase..." -ForegroundColor Cyan
    Set-PgEnvironment $application
    Invoke-Pg $pgDump @(
        "-h", $application.PGHOST,
        "-p", $application.PGPORT,
        "-U", $application.PGUSER,
        "-d", $sourceDatabase,
        "--format=custom",
        "--no-owner",
        "--no-privileges",
        "--file", $dumpPath
    )

    Write-Host "Creation de la base isolee $PilotDatabase..." -ForegroundColor Cyan
    Set-PgEnvironment $admin
    Invoke-Pg $createdb @(
        "-h", $admin.PGHOST,
        "-p", $admin.PGPORT,
        "-U", $admin.PGUSER,
        "--owner", $applicationUser,
        $PilotDatabase
    )
    $databaseCreated = $true

    Write-Host "Restauration des donnees dans $PilotDatabase..." -ForegroundColor Cyan
    Set-PgEnvironment $application
    Invoke-Pg $pgRestore @(
        "-h", $application.PGHOST,
        "-p", $application.PGPORT,
        "-U", $application.PGUSER,
        "-d", $PilotDatabase,
        "--exit-on-error",
        "--no-owner",
        "--no-privileges",
        $dumpPath
    )

    $sourceCount = (& $psql -X -tA -d $sourceDatabase -c "SELECT count(*) FROM documents").Trim()
    $sourceOfCount = (& $psql -X -tA -d $sourceDatabase -c "SELECT count(*) FROM documents WHERE kind='of'").Trim()
    $pilotCount = (& $psql -X -tA -d $PilotDatabase -c "SELECT count(*) FROM documents").Trim()
    $pilotOfCount = (& $psql -X -tA -d $PilotDatabase -c "SELECT count(*) FROM documents WHERE kind='of'").Trim()
    if ($sourceCount -ne $pilotCount -or $sourceOfCount -ne $pilotOfCount) {
        throw "Le controle apres copie a echoue : le nombre de documents differe."
    }

    $pilotEnvironment = @(
        "SP_F001A_DATABASE_BACKEND=postgresql"
        "SP_F001A_READ_ONLY_FILE=C:\ProgramData\SP-F001A\pilot-read-only.flag"
        "SP_F001A_PUBLIC_URL=http://NEU-JGR-SP:$PilotPort/"
        "SP_F001A_SESSION_COOKIE=sp_f001a_pilot_session"
        "SP_F001A_INSTANCE_MODE=test"
        "SP_F001A_INSTANCE_LABEL=BASE TEST"
        "PGHOST=$($application.PGHOST)"
        "PGPORT=$($application.PGPORT)"
        "PGDATABASE=$PilotDatabase"
        "PGUSER=$($application.PGUSER)"
        "PGPASSWORD=$($application.PGPASSWORD)"
    )
    $pilotEnvironment | Set-Content -LiteralPath (Join-Path $configurationRoot "pilot.env") -Encoding utf8

    Write-Host "Base pilote creee et verifiee." -ForegroundColor Green
    Write-Host "Documents : $pilotCount ; OF : $pilotOfCount"
    Write-Host "Adresse : http://NEU-JGR-SP:$PilotPort/"
} catch {
    if ($databaseCreated) {
        try {
            Set-PgEnvironment $admin
            & $dropdb -h $admin.PGHOST -p $admin.PGPORT -U $admin.PGUSER --if-exists $PilotDatabase | Out-Null
        } catch {}
    }
    throw
} finally {
    if (Test-Path -LiteralPath $dumpPath) {
        Remove-Item -LiteralPath $dumpPath -Force
    }
}

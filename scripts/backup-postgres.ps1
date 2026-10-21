param(
    [string]$ConfigRoot = "C:\ProgramData\SP-F001A",
    [int]$RetentionDays = 60
)

$ErrorActionPreference = "Stop"
$postgresBin = "C:\Program Files\PostgreSQL\17\bin"
$postgresEnvironmentFile = Join-Path $ConfigRoot "postgres.env"
$backupEnvironmentFile = Join-Path $ConfigRoot "backup.env"
$stagingDir = Join-Path $ConfigRoot "backup-staging"
$logFile = Join-Path $ConfigRoot "postgres-backup.log"

function Read-Settings([string]$path) {
    $settings = @{}
    foreach ($line in Get-Content -LiteralPath $path) {
        $value = $line.Trim()
        if (-not $value -or $value.StartsWith("#") -or -not $value.Contains("=")) {
            continue
        }
        $name, $content = $value.Split("=", 2)
        $settings[$name.Trim()] = $content.Trim()
    }
    return $settings
}

function Write-Log([string]$message) {
    "$(Get-Date -Format s) - $message" | Add-Content -LiteralPath $logFile
}

try {
    $postgres = Read-Settings $postgresEnvironmentFile
    $backup = Read-Settings $backupEnvironmentFile
    if (-not $backup.BACKUP_DIR) {
        throw "BACKUP_DIR absent de $backupEnvironmentFile"
    }
    foreach ($name in "PGHOST", "PGPORT", "PGDATABASE", "PGUSER", "PGPASSWORD") {
        if (-not $postgres[$name]) {
            throw "Paramètre PostgreSQL absent : $name"
        }
    }

    New-Item -ItemType Directory -Path $stagingDir -Force | Out-Null
    New-Item -ItemType Directory -Path $backup.BACKUP_DIR -Force | Out-Null
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $fileName = "sp-f001a-daily-postgresql-$stamp.dump"
    $localFile = Join-Path $stagingDir $fileName
    $remotePartial = Join-Path $backup.BACKUP_DIR "$fileName.partial"
    $remoteFile = Join-Path $backup.BACKUP_DIR $fileName
    $env:PGPASSWORD = $postgres.PGPASSWORD

    & (Join-Path $postgresBin "pg_dump.exe") -w `
        -h $postgres.PGHOST -p $postgres.PGPORT `
        -U $postgres.PGUSER -d $postgres.PGDATABASE `
        -Fc -f $localFile
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $localFile) -or (Get-Item $localFile).Length -eq 0) {
        throw "pg_dump n'a pas produit de sauvegarde valide."
    }

    Copy-Item -LiteralPath $localFile -Destination $remotePartial -Force
    Move-Item -LiteralPath $remotePartial -Destination $remoteFile -Force
    Remove-Item -LiteralPath $localFile -Force
    Get-ChildItem -LiteralPath $backup.BACKUP_DIR -Filter "sp-f001a-daily-postgresql-*.dump" -File |
        Where-Object LastWriteTime -lt (Get-Date).AddDays(-$RetentionDays) |
        Remove-Item -Force
    Write-Log "Sauvegarde créée : $remoteFile"
} catch {
    Write-Log "ÉCHEC : $($_.Exception.Message)"
    throw
} finally {
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}

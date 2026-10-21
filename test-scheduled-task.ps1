$ErrorActionPreference = "Stop"

$resultDirectory = Join-Path $env:LOCALAPPDATA "SP-F001A"
$resultFile = Join-Path $resultDirectory "scheduled-task-test.txt"
$statusUrl = "http://127.0.0.1:5181/api/health"
$fallback = "C:\Dev\pro\SP-F001A\start-prod-invisible.vbs"

New-Item -ItemType Directory -Path $resultDirectory -Force | Out-Null
Remove-Item -LiteralPath $resultFile -Force -ErrorAction SilentlyContinue

$task = Get-ScheduledTask -TaskName "SP-F001A Serveur" -ErrorAction SilentlyContinue
if (-not $task) {
    Start-Process -FilePath "$env:WINDIR\System32\wscript.exe" -ArgumentList ('"' + $fallback + '"') -WindowStyle Hidden
    Start-Sleep -Seconds 4
    $ok = $false
    try {
        $response = Invoke-WebRequest -UseBasicParsing $statusUrl -TimeoutSec 4
        $health = $response.Content | ConvertFrom-Json
        $ok = $response.StatusCode -eq 200 -and $health.ok -eq $true
    } catch {}
    "OK=$ok`nState=Démarrage utilisateur`nAction=Lanceur vérifié sans arrêter l'instance existante" |
        Set-Content -LiteralPath $resultFile
    exit $(if ($ok) { 0 } else { 2 })
}

Get-CimInstance Win32_Process | Where-Object {
    $_.Name -match '^python' -and $_.CommandLine -match 'server.py' -and $_.CommandLine -match '5181'
} | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }

Start-Sleep -Seconds 1
Start-ScheduledTask -TaskName "SP-F001A Serveur"
Start-Sleep -Seconds 8

$ok = $false
try {
    $response = Invoke-WebRequest -UseBasicParsing $statusUrl -TimeoutSec 4
    $health = $response.Content | ConvertFrom-Json
    $ok = $response.StatusCode -eq 200 -and $health.ok -eq $true
} catch {}

$info = Get-ScheduledTaskInfo -TaskName "SP-F001A Serveur"
@(
    "OK=$ok"
    "State=$($task.State)"
    "User=$($task.Principal.UserId)"
    "LastRunTime=$($info.LastRunTime.ToString('s'))"
    "LastTaskResult=$($info.LastTaskResult)"
) | Set-Content -LiteralPath $resultFile

if (-not $ok) {
    Stop-ScheduledTask -TaskName "SP-F001A Serveur" -ErrorAction SilentlyContinue
    Start-Process -FilePath "$env:WINDIR\System32\wscript.exe" -ArgumentList ('"' + $fallback + '"') -WindowStyle Hidden
}


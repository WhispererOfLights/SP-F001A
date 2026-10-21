$ErrorActionPreference = "Stop"

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principalCheck = New-Object Security.Principal.WindowsPrincipal($identity)
if (-not $principalCheck.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw "Exécuter ce script en administrateur."
}

$script = "C:\Dev\pro\SP-F001A\scripts\backup-postgres.ps1"
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$script`""
$user = "$($env:USERDOMAIN)\$($env:USERNAME)"
$triggers = @(
    (New-ScheduledTaskTrigger -Daily -At "18:00")
    (New-ScheduledTaskTrigger -AtLogOn -User $user)
)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 10) -ExecutionTimeLimit (New-TimeSpan -Hours 1) `
    -MultipleInstances IgnoreNew
$principal = New-ScheduledTaskPrincipal -UserId $user -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName "SP-F001A Sauvegarde PostgreSQL" `
    -Action $action -Trigger $triggers -Settings $settings -Principal $principal `
    -Description "Sauvegarde quotidienne PostgreSQL de SP-F001A vers le partage réseau" `
    -Force | Out-Null

Start-ScheduledTask -TaskName "SP-F001A Sauvegarde PostgreSQL"
Write-Host "Tâche de sauvegarde PostgreSQL installée et premier lancement demandé."

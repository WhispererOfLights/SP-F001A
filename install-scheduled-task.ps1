$ErrorActionPreference = "Stop"

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principalCheck = New-Object Security.Principal.WindowsPrincipal($identity)
if (-not $principalCheck.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Start-Process powershell.exe -Verb RunAs -ArgumentList @(
        "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", ('"' + $MyInvocation.MyCommand.Path + '"')
    )
    exit
}

$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "C:\Dev\pro\SP-F001A\run-prod-server.ps1"'
$trigger = New-ScheduledTaskTrigger -AtStartup
$trigger.Delay = "PT1M"
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RestartCount 10 `
    -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit ([TimeSpan]::Zero) `
    -MultipleInstances IgnoreNew
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName "SP-F001A Serveur" -Action $action -Trigger $trigger `
    -Settings $settings -Principal $principal `
    -Description "Serveur de production SP-F001A avec donnees sur le partage reseau" -Force | Out-Null

Add-Type -AssemblyName PresentationFramework
[System.Windows.MessageBox]::Show(
    "La tâche planifiée SP-F001A Serveur a été installée.",
    "SP-F001A", "OK", "Information"
) | Out-Null


$ErrorActionPreference = "Stop"

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$userId = $identity.Name
$startup = [Environment]::GetFolderPath("Startup")
$shortcutPath = Join-Path $startup "SP-F001A Serveur.lnk"
$launcher = Join-Path $PSScriptRoot "start-prod-invisible.vbs"

$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "C:\Dev\pro\SP-F001A\run-prod-server.ps1"'
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $userId
$trigger.Delay = "PT15S"
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RestartCount 10 `
    -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit ([TimeSpan]::Zero) `
    -MultipleInstances IgnoreNew
$principal = New-ScheduledTaskPrincipal -UserId $userId -LogonType Interactive -RunLevel Limited

try {
    Register-ScheduledTask -TaskName "SP-F001A Serveur" -Action $action -Trigger $trigger `
        -Settings $settings -Principal $principal `
        -Description "Serveur de production SP-F001A au démarrage de la session Windows" `
        -Force -ErrorAction Stop | Out-Null
    if (Test-Path -LiteralPath $shortcutPath) {
        Remove-Item -LiteralPath $shortcutPath -Force
    }
    Write-Host "La tâche planifiée SP-F001A Serveur a été installée pour $userId." -ForegroundColor Green
} catch {
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = "$env:WINDIR\System32\wscript.exe"
    $shortcut.Arguments = '"' + $launcher + '"'
    $shortcut.WorkingDirectory = $PSScriptRoot
    $shortcut.Save()
    Write-Host "Droits insuffisants pour une tâche planifiée : démarrage automatique utilisateur installé." -ForegroundColor Yellow
}


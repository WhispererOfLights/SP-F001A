[CmdletBinding()]
param(
    [string]$UserId = [Security.Principal.WindowsIdentity]::GetCurrent().Name,
    [switch]$Elevated
)

$ErrorActionPreference = "Stop"
$taskName = "SP-F001A Serveur"
$startup = [Environment]::GetFolderPath("Startup")
$shortcutPath = Join-Path $startup "$taskName.lnk"
$runner = Join-Path $PSScriptRoot "run-prod-server.ps1"

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($identity)
$isAdministrator = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdministrator) {
    $arguments = @(
        "-NoProfile"
        "-ExecutionPolicy", "Bypass"
        "-File", ('"' + $PSCommandPath + '"')
        "-UserId", ('"' + $UserId + '"')
        "-Elevated"
    ) -join " "
    Start-Process -FilePath "powershell.exe" -Verb RunAs -ArgumentList $arguments
    Write-Host "Une fenêtre administrateur a été ouverte pour terminer l'installation." -ForegroundColor Yellow
    exit 0
}

if (-not (Test-Path -LiteralPath $runner -PathType Leaf)) {
    throw "Script serveur introuvable : $runner"
}

Write-Host "Configuration du démarrage autonome de SP-F001A." -ForegroundColor Cyan
Write-Host "Saisissez le mot de passe Windows de $UserId dans la fenêtre sécurisée." -ForegroundColor Cyan
$credential = Get-Credential -UserName $UserId -Message "SP-F001A - compte autorisé à accéder au partage réseau"
if (-not $credential) {
    throw "Installation annulée : aucun compte fourni."
}

$taskUser = $credential.UserName
$password = $credential.GetNetworkCredential().Password
if ([string]::IsNullOrWhiteSpace($password)) {
    throw "Installation annulée : mot de passe vide."
}

$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument ('-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "' + $runner + '"') `
    -WorkingDirectory $PSScriptRoot
$trigger = New-ScheduledTaskTrigger -AtStartup
$trigger.Delay = "PT45S"
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RestartCount 20 `
    -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit ([TimeSpan]::Zero) `
    -MultipleInstances IgnoreNew

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger `
    -Settings $settings -User $taskUser -Password $password -RunLevel Limited `
    -Description "Serveur de production SP-F001A au démarrage de Windows, sans ouverture de session" `
    -Force | Out-Null

if (Test-Path -LiteralPath $shortcutPath) {
    Remove-Item -LiteralPath $shortcutPath -Force
}

$task = Get-ScheduledTask -TaskName $taskName
$info = Get-ScheduledTaskInfo -TaskName $taskName
Write-Host "Démarrage autonome installé avec succès." -ForegroundColor Green
Write-Host "Compte : $($task.Principal.UserId)"
Write-Host "Déclencheur : démarrage de Windows, avec délai de 45 secondes"
Write-Host "Le raccourci dépendant de l'ouverture de session a été supprimé."
Write-Host "État actuel : $($task.State) ; dernier résultat : $($info.LastTaskResult)"
Read-Host "Appuyez sur Entrée pour fermer"


$task = Get-ScheduledTask -TaskName "SP-F001A Serveur" -ErrorAction SilentlyContinue
if (-not $task) {
    $shortcut = Join-Path ([Environment]::GetFolderPath("Startup")) "SP-F001A Serveur.lnk"
    if (Test-Path -LiteralPath $shortcut) {
        Write-Output "Mode=Démarrage utilisateur"
        Write-Output "Raccourci=$shortcut"
        exit 0
    }
    Write-Output "Tâche SP-F001A Serveur et raccourci de démarrage absents."
    exit 2
}
$info = Get-ScheduledTaskInfo -TaskName "SP-F001A Serveur"
@(
    "User=$($task.Principal.UserId)"
    "LogonType=$($task.Principal.LogonType)"
    "State=$($task.State)"
    "LastTaskResult=$($info.LastTaskResult)"
    "Triggers=$((@($task.Triggers | ForEach-Object { $_.CimClass.CimClassName })) -join ',')"
    "Mode=Démarrage autonome sans ouverture de session"
) | Set-Content -LiteralPath "C:\ProgramData\SP-F001A\scheduled-task-inspect.txt"

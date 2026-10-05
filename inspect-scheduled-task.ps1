$task = Get-ScheduledTask -TaskName "SP-F001A Serveur" -ErrorAction Stop
$info = Get-ScheduledTaskInfo -TaskName "SP-F001A Serveur"
@(
    "User=$($task.Principal.UserId)"
    "LogonType=$($task.Principal.LogonType)"
    "State=$($task.State)"
    "LastTaskResult=$($info.LastTaskResult)"
) | Set-Content -LiteralPath "C:\ProgramData\SP-F001A\scheduled-task-inspect.txt"

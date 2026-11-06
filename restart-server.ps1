$ErrorActionPreference = "Stop"

$taskName = "SP-F001A Serveur"
$healthUrl = "http://127.0.0.1:5181/api/health"
$scriptPath = $MyInvocation.MyCommand.Path

function Show-Result([string]$message, [string]$title, [int]$icon) {
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.MessageBox]::Show(
        $message,
        $title,
        [System.Windows.Forms.MessageBoxButtons]::OK,
        $icon
    ) | Out-Null
}

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($identity)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Start-Process -FilePath "powershell.exe" -Verb RunAs -WindowStyle Hidden -ArgumentList @(
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", ('"' + $scriptPath + '"')
    )
    exit 0
}

try {
    $task = Get-ScheduledTask -TaskName $taskName -ErrorAction Stop

    Get-CimInstance Win32_Process | Where-Object {
        $_.Name -match '^python' -and
        $_.CommandLine -match 'server.py' -and
        $_.CommandLine -match '5181'
    } | ForEach-Object {
        Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    }

    Stop-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    Start-ScheduledTask -TaskName $taskName

    $healthy = $false
    for ($attempt = 1; $attempt -le 20; $attempt++) {
        Start-Sleep -Seconds 1
        try {
            $health = Invoke-RestMethod $healthUrl -TimeoutSec 3
            if ($health.ok -eq $true) {
                $healthy = $true
                break
            }
        } catch {}
    }

    if (-not $healthy) {
        throw "Le serveur ne répond pas après 20 secondes."
    }

    Show-Result "SP-F001A est relancé et répond correctement." "SP-F001A" 64
} catch {
    Show-Result ("Impossible de relancer SP-F001A.`n`n" + $_.Exception.Message) "SP-F001A - Erreur" 16
    exit 1
}

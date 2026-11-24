Option Explicit

Dim shell, fso, root, launcher, restartScript, statusUrl, appUrl, answer, confirmRestart, attempt
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

root = fso.GetParentFolderName(WScript.ScriptFullName)
launcher = fso.BuildPath(root, "start-prod-invisible.vbs")
restartScript = fso.BuildPath(root, "restart-server.ps1")
statusUrl = "http://127.0.0.1:5181/api/health"
appUrl = "http://NEU-JGR-SP:5181/"

If ServerIsRunning(statusUrl) Then
    answer = MsgBox("Le serveur SP-F001A fonctionne." & vbCrLf & vbCrLf & _
        "Oui : ouvrir l'application" & vbCrLf & _
        "Non : redemarrer le serveur" & vbCrLf & _
        "Annuler : fermer", vbYesNoCancel + vbInformation, "SP-F001A - Serveur actif")
    If answer = vbYes Then shell.Run appUrl, 1, False
    If answer = vbNo Then
        confirmRestart = MsgBox("Redemarrer uniquement le serveur web SP-F001A ?" & vbCrLf & vbCrLf & _
            "PostgreSQL et les donnees ne seront pas arretes.", _
            vbYesNo + vbQuestion + vbDefaultButton2, "SP-F001A - Confirmation")
        If confirmRestart = vbYes Then
            If fso.FileExists(restartScript) Then
                shell.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & restartScript & """", 0, False
            Else
                MsgBox "Le script de redemarrage est introuvable :" & vbCrLf & restartScript, _
                    vbOKOnly + vbCritical, "SP-F001A - Erreur"
            End If
        End If
    End If
    WScript.Quit 0
End If

answer = MsgBox("Le serveur SP-F001A est arrete." & vbCrLf & vbCrLf & _
    "Voulez-vous le demarrer maintenant ?", vbYesNo + vbExclamation, "SP-F001A - Serveur arrete")
If answer <> vbYes Then WScript.Quit 1

shell.Run "wscript.exe """ & launcher & """", 0, True
For attempt = 1 To 30
    WScript.Sleep 2000
    If ServerIsRunning(statusUrl) Then Exit For
Next

If ServerIsRunning(statusUrl) Then
    answer = MsgBox("Le serveur SP-F001A a demarre correctement." & vbCrLf & vbCrLf & _
        "Ouvrir l'application ?", vbYesNo + vbInformation, "SP-F001A - Serveur actif")
    If answer = vbYes Then shell.Run appUrl, 1, False
Else
    MsgBox "Le serveur n'a pas demarre." & vbCrLf & _
        "Verifiez le reseau ou le journal :" & vbCrLf & _
        shell.ExpandEnvironmentStrings("%LOCALAPPDATA%\SP-F001A\server-error.log"), _
        vbOKOnly + vbCritical, "SP-F001A - Erreur"
End If

Function ServerIsRunning(url)
    On Error Resume Next
    Dim http
    Set http = CreateObject("WinHttp.WinHttpRequest.5.1")
    http.SetTimeouts 1000, 1000, 1000, 2000
    http.Open "GET", url, False
    http.Send
    ServerIsRunning = (Err.Number = 0 And http.Status = 200)
    Err.Clear
    On Error GoTo 0
End Function


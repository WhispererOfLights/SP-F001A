Option Explicit

Dim shell, fso, root, launcher, statusUrl, appUrl, answer
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

root = fso.GetParentFolderName(WScript.ScriptFullName)
launcher = fso.BuildPath(root, "start-prod-invisible.vbs")
statusUrl = "http://127.0.0.1:5181/api/health"
appUrl = "http://NEU-JGR-SP:5181/"

If ServerIsRunning(statusUrl) Then
    answer = MsgBox("Le serveur SP-F001A fonctionne." & vbCrLf & vbCrLf & _
        "Ouvrir l'application ?", vbYesNo + vbInformation, "SP-F001A - Serveur actif")
    If answer = vbYes Then shell.Run appUrl, 1, False
    WScript.Quit 0
End If

answer = MsgBox("Le serveur SP-F001A est arrete." & vbCrLf & vbCrLf & _
    "Voulez-vous le demarrer maintenant ?", vbYesNo + vbExclamation, "SP-F001A - Serveur arrete")
If answer <> vbYes Then WScript.Quit 1

shell.Run "wscript.exe """ & launcher & """", 0, True
WScript.Sleep 3000

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


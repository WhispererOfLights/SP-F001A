@echo off
setlocal

rem The application is served from this local folder, but all production data
rem is stored in the shared network database.
if "%SP_F001A_DATA_DIR%"=="" set "SP_F001A_DATA_DIR=\\neu-fs01.neu.orolia\Dpts\OP_SPACE\RAFS_USO\SP-F001(Web)\data"

if exist "%SP_F001A_DATA_DIR%\" goto data_ready
echo ERREUR : le dossier de donnees de production est inaccessible :
echo "%SP_F001A_DATA_DIR%"
echo Verifiez la connexion reseau et les droits du compte Windows.
pause
exit /b 1

:data_ready

set "SP_F001A_HOST=0.0.0.0"
set "SP_F001A_PORT=5181"

set "SP_F001A_RUNNING_PID="
for /f "usebackq delims=" %%P in (`powershell.exe -NoProfile -Command "$c=Get-NetTCPConnection -LocalPort 5181 -State Listen -ErrorAction SilentlyContinue; if($c){$c[0].OwningProcess}"`) do set "SP_F001A_RUNNING_PID=%%P"
if not defined SP_F001A_RUNNING_PID goto start_server
echo Le serveur SP-F001A est deja lance sur le port 5181.
echo Adresse : http://%COMPUTERNAME%:5181/
echo Processus : %SP_F001A_RUNNING_PID%
pause
exit /b 0

:start_server
cd /d "%~dp0"
echo Serveur SP-F001A : http://%COMPUTERNAME%:%SP_F001A_PORT%/
echo Donnees : "%SP_F001A_DATA_DIR%"
"C:\Users\Julien Grosjean\AppData\Local\Programs\Python\Python311\python.exe" server.py --host %SP_F001A_HOST% --port %SP_F001A_PORT% --data-dir "%SP_F001A_DATA_DIR%"

echo.
echo Le serveur s'est arrete avec le code %ERRORLEVEL%.
pause

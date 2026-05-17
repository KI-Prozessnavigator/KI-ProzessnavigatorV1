@echo off
cd /d "%~dp0"
echo Starte lokalen Server...
echo.
echo Oeffne im Browser: http://localhost:3000/
echo.
start http://localhost:3000/
node server.js
pause

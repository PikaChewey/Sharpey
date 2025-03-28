@echo off
echo Restarting Sharpe Game application...
cd /d "%~dp0"

REM Kill any existing node processes
echo Killing any existing node processes...
taskkill /F /IM node.exe /T 2>nul

REM Clean the Next.js cache
echo Cleaning Next.js cache...
if exist .next (
  rmdir /s /q .next
)

REM Build the application
echo Building the application...
call npm run build

REM Start the application
echo Starting the application...
start cmd /k "npm start"

echo Application has been restarted.
echo Visit http://localhost:3000 in your browser
echo Use Ctrl+C to stop the server when done. 
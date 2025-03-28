@echo off
echo Starting Next.js development server...
cd /d "%~dp0"

REM Kill any existing node processes
echo Killing any existing node processes...
taskkill /F /IM node.exe /T 2>nul

REM Start development server
echo Starting development server...
start cmd /k "npm run dev"

echo Development server started in the background.
echo Visit http://localhost:3000 in your browser
echo Use Ctrl+C to stop the server when done. 
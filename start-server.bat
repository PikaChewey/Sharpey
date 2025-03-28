@echo off
echo Starting Next.js development server...
cd /d "%~dp0"

REM Kill any existing Node processes
echo Killing any existing node processes...
taskkill /F /IM node.exe /T 2>nul

REM Clean the Next.js cache
echo Cleaning build cache...
if exist .next rmdir /s /q .next

REM Kill processes using port 3000
echo Freeing up port 3000...
powershell -ExecutionPolicy Bypass -File killports.ps1

REM Start the Next.js development server with fixed port
echo Starting server on port 3000...
start /B cmd /c "npx next dev -p 3000"

echo Server started in the background.
echo Visit http://localhost:3000 in your browser
echo Use Ctrl+C to stop the server when done.
echo.
echo If you encounter any issues, try running:
echo npm run clean-start - for a full rebuild
echo npm run clean-full - for a complete reinstall 
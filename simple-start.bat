@echo off
echo Simple Next.js Startup Script

REM Kill any existing Node processes
taskkill /F /IM node.exe /T 2>nul

REM Remove any existing Next.js build
if exist ".next" (
    echo Removing .next directory...
    rmdir /s /q .next
)

REM Start the server without Turbo mode, forced to port 3000
echo Starting server on port 3000 without Turbo mode...
npx next dev --no-turbo -p 3000

echo Server has stopped. 
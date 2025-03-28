@echo off
echo ===== Next.js Clean Start Script =====
echo.
echo Killing all Node.js processes...
taskkill /F /IM node.exe /T 2>nul
echo.

echo Cleaning up Next.js cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo.

echo Installing dependencies (if needed)...
call npm install
echo.

echo Building the application...
call npm run build
echo.

echo Starting development server on port 3000...
call npm run dev
echo.

echo If server doesn't start, try running: npm run clean-full 
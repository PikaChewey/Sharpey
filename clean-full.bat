@echo off
echo ===== Next.js Full Cleanup Script =====
echo.
echo Killing all Node.js processes...
taskkill /F /IM node.exe /T 2>nul
echo.

echo Cleaning up Next.js cache and build artifacts...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo.

echo Removing node_modules (this will take a few moments)...
if exist node_modules rmdir /s /q node_modules
echo.

echo Clearing npm cache...
call npm cache clean --force
echo.

echo Reinstalling dependencies (this will take a while)...
call npm install
echo.

echo Building the application...
call npm run build
echo.

echo Starting development server on port 3000...
call npm run dev

echo.
echo If issues persist, try restarting your computer 
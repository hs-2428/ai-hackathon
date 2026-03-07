@echo off
echo ============================================
echo TRIBAL APP - LOCAL DEMO STARTER
echo ============================================
echo.
echo This will open TWO windows:
echo   1. Local API Server (port 3001)
echo   2. Mobile App (web browser)
echo.
echo Press any key to start...
pause >nul

echo.
echo Starting Local API Server...
start "Local API Server" cmd /k "cd local-server && node server.js"

echo Waiting 3 seconds for server to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting Mobile App...
start "Mobile App" cmd /k "cd mobile-app && npm start"

echo.
echo ============================================
echo DEMO STARTED!
echo ============================================
echo.
echo Two windows have opened:
echo   1. Local API Server - Keep this running
echo   2. Mobile App - Press 'w' to open in browser
echo.
echo When Expo starts, press 'w' in the Mobile App window
echo to open the app in your web browser.
echo.
echo To stop: Close both windows or press Ctrl+C in each
echo ============================================
echo.
pause

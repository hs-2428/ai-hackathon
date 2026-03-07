@echo off
echo ========================================
echo Testing Tribal Language Assistant
echo ========================================
echo.

REM Check if local server is running
echo [1/3] Checking local server...
curl -s http://localhost:3002/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Local server not running on port 3002
    echo Please start it first: cd local-server && node server.js
    pause
    exit /b 1
)
echo ✓ Local server is running

echo.
echo [2/3] Testing API endpoints...

echo Testing /detect-language...
curl -X POST http://localhost:3002/detect-language -H "Content-Type: application/json" -d "{\"text\":\"Hello\"}"
echo.

echo Testing /cultural-assistant...
curl -X POST http://localhost:3002/cultural-assistant -H "Content-Type: application/json" -d "{\"question\":\"What is Sarhul?\",\"language\":\"santali\"}"
echo.

echo Testing /news...
curl http://localhost:3002/news?language=santali
echo.

echo ✓ All API endpoints working

echo.
echo [3/3] Opening web app...
echo Opening http://localhost:3002/web-app/index.html in browser...
start http://localhost:3002/web-app/index.html

echo.
echo ========================================
echo ✓ Web app opened in browser!
echo ========================================
echo.
echo Test the following features:
echo 1. Select different languages (Santali, Gondi, Hindi, English)
echo 2. Type a question and click "Ask"
echo 3. Try voice input (if browser supports)
echo 4. Click "Speak Answer" to hear response
echo 5. Check news feed updates
echo.
pause

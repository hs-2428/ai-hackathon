@echo off
echo ============================================================
echo STARTING LOCAL TRIBAL LANGUAGE APP
echo ============================================================
echo.
echo This will run the app locally without AWS
echo No deployment needed - works offline!
echo.
echo Starting server...
echo.

cd local-server
node server.js

pause

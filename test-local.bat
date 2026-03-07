@echo off
REM Windows batch script for local testing

echo ==============================================
echo TRIBAL APP - LOCAL TESTING
echo ==============================================

REM Check Node.js
echo.
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18+
    exit /b 1
)
echo [OK] Node.js installed
node --version

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm not found
    exit /b 1
)
echo [OK] npm installed
npm --version

REM Install Lambda dependencies
echo.
echo Installing Lambda dependencies...
for /d %%D in (backend\lambda\*) do (
    if exist "%%D\package.json" (
        echo Installing dependencies for %%~nxD
        cd %%D
        call npm install --silent
        if %ERRORLEVEL% NEQ 0 (
            echo [ERROR] Failed to install dependencies for %%~nxD
            exit /b 1
        )
        cd ..\..\..
    )
)
echo [OK] Lambda dependencies installed

REM Validate JSON files
echo.
echo Validating JSON files...
set json_valid=1
for /r %%F in (*.json) do (
    echo %%F | findstr /v "node_modules" >nul
    if not errorlevel 1 (
        node -e "JSON.parse(require('fs').readFileSync('%%F', 'utf8'))" >nul 2>&1
        if errorlevel 1 (
            echo [ERROR] Invalid JSON: %%F
            set json_valid=0
        )
    )
)

if %json_valid%==1 (
    echo [OK] All JSON files are valid
) else (
    echo [ERROR] Some JSON files are invalid
    exit /b 1
)

REM Run local tests
echo.
echo Running local tests...
cd local-testing
node run-all-tests.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==============================================
    echo [SUCCESS] ALL TESTS PASSED!
    echo Ready to push to GitHub and deploy to AWS
    echo ==============================================
    echo.
    exit /b 0
) else (
    echo.
    echo ==============================================
    echo [FAILED] TESTS FAILED
    echo Please fix the issues before pushing
    echo ==============================================
    echo.
    exit /b 1
)

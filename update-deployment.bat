@echo off
echo ============================================================
echo UPDATING AWS DEPLOYMENT
echo ============================================================

echo.
echo Step 1: Installing Lambda dependencies...
cd backend\lambda\cultural-assistant
call npm install
cd ..\..\..

cd backend\lambda\news-aggregator
call npm install
cd ..\..\..

cd backend\lambda\language-detector
call npm install
cd ..\..\..

cd backend\lambda\text-to-speech
call npm install
cd ..\..\..

cd backend\lambda\voice-processor
call npm install
cd ..\..\..

echo.
echo Step 2: Deploying updated stack...
cd infrastructure
call npm install
call cdk deploy --require-approval never
cd ..

echo.
echo Step 3: Getting API endpoint...
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name TribalAppStack --query "Stacks[0].Outputs[?OutputKey==`APIEndpoint`].OutputValue" --output text') do set API_ENDPOINT=%%i

echo API Endpoint: %API_ENDPOINT%

echo.
echo Step 4: Testing deployment...
echo Testing cultural assistant endpoint...
curl -X POST "%API_ENDPOINT%cultural-assistant" -H "Content-Type: application/json" -d "{\"query\":\"What scholarships are available?\",\"language\":\"hindi\"}"

echo.
echo Testing news endpoint...
curl -X POST "%API_ENDPOINT%news" -H "Content-Type: application/json" -d "{\"language\":\"santali\",\"limit\":3}"

echo.
echo ============================================================
echo DEPLOYMENT UPDATE COMPLETE!
echo ============================================================
echo.
echo Next Steps:
echo 1. Open the web app: https://hs-2428.github.io/ai-hackathon/demo.html
echo 2. Or test locally: http://localhost:3002/web-app/index.html
echo 3. The app will automatically use AWS when deployed
echo.
echo API Endpoint: %API_ENDPOINT%
echo ============================================================

pause

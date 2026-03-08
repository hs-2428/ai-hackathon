#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 UPDATING AWS DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Install Lambda dependencies
echo ""
echo "📦 Step 1: Installing Lambda dependencies..."
cd backend/lambda/cultural-assistant && npm install && cd ../../..
cd backend/lambda/news-aggregator && npm install && cd ../../..
cd backend/lambda/language-detector && npm install && cd ../../..
cd backend/lambda/text-to-speech && npm install && cd ../../..
cd backend/lambda/voice-processor && npm install && cd ../../..

# Step 2: Deploy updated stack
echo ""
echo "🚀 Step 2: Deploying updated stack..."
cd infrastructure
npm install
cdk deploy --require-approval never
cd ..

# Step 3: Get API endpoint
echo ""
echo "📋 Step 3: Getting API endpoint..."
API_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name TribalAppStack \
  --query 'Stacks[0].Outputs[?OutputKey==`APIEndpoint`].OutputValue' \
  --output text)

echo "✅ API Endpoint: $API_ENDPOINT"

# Step 4: Update deployment config
echo ""
echo "📝 Step 4: Updating deployment config..."
cat > deployment-config.json << EOF
{
  "apiEndpoint": "$API_ENDPOINT",
  "audioBucket": "tribal-app-audio",
  "knowledgeBucket": "tribal-app-knowledge",
  "region": "us-east-1",
  "accountId": "604223541745",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

# Step 5: Test the deployment
echo ""
echo "🧪 Step 5: Testing deployment..."
echo "Testing cultural assistant endpoint..."
curl -X POST "${API_ENDPOINT}cultural-assistant" \
  -H "Content-Type: application/json" \
  -d '{"query":"What scholarships are available?","language":"hindi"}' \
  | jq '.'

echo ""
echo "Testing news endpoint..."
curl -X POST "${API_ENDPOINT}news" \
  -H "Content-Type: application/json" \
  -d '{"language":"santali","limit":3}' \
  | jq '.'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT UPDATE COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Next Steps:"
echo "1. Open the web app: https://hs-2428.github.io/ai-hackathon/demo.html"
echo "2. Or test locally: http://localhost:3002/web-app/index.html"
echo "3. The app will automatically use AWS when deployed"
echo ""
echo "🔗 API Endpoint: $API_ENDPOINT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

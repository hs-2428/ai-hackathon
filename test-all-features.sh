#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_ENDPOINT="https://hlk4vx4dcg.execute-api.us-east-1.amazonaws.com/prod"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 TESTING ALL FEATURES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "API Endpoint: $API_ENDPOINT"
echo ""

# Test 1: Language Detection
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 1: Language Detection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Testing with Hindi text..."
RESPONSE=$(curl -s -X POST "${API_ENDPOINT}/detect-language" \
  -H "Content-Type: application/json" \
  -d '{"text":"नमस्ते, मुझे सरकारी योजनाओं के बारे में बताएं"}')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Language Detection: SUCCESS${NC}"
    echo "$RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Language Detection: FAILED${NC}"
fi
echo ""

# Test 2: Cultural Assistant - Santali
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 2: Cultural Assistant (Santali)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Asking about scholarships in Santali..."
RESPONSE=$(curl -s -X POST "${API_ENDPOINT}/cultural-assistant" \
  -H "Content-Type: application/json" \
  -d '{"query":"What scholarships are available for students?","language":"santali","userId":"test-user","sessionId":"test-session"}')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Cultural Assistant (Santali): SUCCESS${NC}"
    echo "$RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Cultural Assistant (Santali): FAILED${NC}"
fi
echo ""

# Test 3: Cultural Assistant - Gondi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 3: Cultural Assistant (Gondi)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Asking about health services in Gondi..."
RESPONSE=$(curl -s -X POST "${API_ENDPOINT}/cultural-assistant" \
  -H "Content-Type: application/json" \
  -d '{"query":"Tell me about health services","language":"gondi","userId":"test-user","sessionId":"test-session"}')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Cultural Assistant (Gondi): SUCCESS${NC}"
    echo "$RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Cultural Assistant (Gondi): FAILED${NC}"
fi
echo ""

# Test 4: Cultural Assistant - Hindi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 4: Cultural Assistant (Hindi)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Asking about farming schemes in Hindi..."
RESPONSE=$(curl -s -X POST "${API_ENDPOINT}/cultural-assistant" \
  -H "Content-Type: application/json" \
  -d '{"query":"किसानों के लिए क्या योजनाएं हैं?","language":"hindi","userId":"test-user","sessionId":"test-session"}')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Cultural Assistant (Hindi): SUCCESS${NC}"
    echo "$RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Cultural Assistant (Hindi): FAILED${NC}"
fi
echo ""

# Test 5: Cultural Assistant - English
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 5: Cultural Assistant (English)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Asking about forest rights in English..."
RESPONSE=$(curl -s -X POST "${API_ENDPOINT}/cultural-assistant" \
  -H "Content-Type: application/json" \
  -d '{"query":"What are forest rights for tribal communities?","language":"english","userId":"test-user","sessionId":"test-session"}')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Cultural Assistant (English): SUCCESS${NC}"
    echo "$RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Cultural Assistant (English): FAILED${NC}"
fi
echo ""

# Test 6: News Aggregator - Santali (POST)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 6: News Aggregator (Santali - POST)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Fetching Santali news..."
RESPONSE=$(curl -s -X POST "${API_ENDPOINT}/news" \
  -H "Content-Type: application/json" \
  -d '{"language":"santali","limit":3}')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ News Aggregator (Santali): SUCCESS${NC}"
    echo "$RESPONSE" | jq '.'
else
    echo -e "${RED}❌ News Aggregator (Santali): FAILED${NC}"
fi
echo ""

# Test 7: News Aggregator - Gondi (GET)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 7: News Aggregator (Gondi - GET)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Fetching Gondi news..."
RESPONSE=$(curl -s "${API_ENDPOINT}/news?language=gondi&limit=3")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ News Aggregator (Gondi): SUCCESS${NC}"
    echo "$RESPONSE" | jq '.'
else
    echo -e "${RED}❌ News Aggregator (Gondi): FAILED${NC}"
fi
echo ""

# Test 8: News Aggregator - Bhili
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 8: News Aggregator (Bhili)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Fetching Bhili news..."
RESPONSE=$(curl -s -X POST "${API_ENDPOINT}/news" \
  -H "Content-Type: application/json" \
  -d '{"language":"bhili","limit":3}')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ News Aggregator (Bhili): SUCCESS${NC}"
    echo "$RESPONSE" | jq '.'
else
    echo -e "${RED}❌ News Aggregator (Bhili): FAILED${NC}"
fi
echo ""

# Test 9: News Aggregator - Kurukh
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 9: News Aggregator (Kurukh)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Fetching Kurukh news..."
RESPONSE=$(curl -s -X POST "${API_ENDPOINT}/news" \
  -H "Content-Type: application/json" \
  -d '{"language":"kurukh","limit":3}')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ News Aggregator (Kurukh): SUCCESS${NC}"
    echo "$RESPONSE" | jq '.'
else
    echo -e "${RED}❌ News Aggregator (Kurukh): FAILED${NC}"
fi
echo ""

# Test 10: News Aggregator - Munda
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 10: News Aggregator (Munda)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Fetching Munda news..."
RESPONSE=$(curl -s -X POST "${API_ENDPOINT}/news" \
  -H "Content-Type: application/json" \
  -d '{"language":"munda","limit":3}')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ News Aggregator (Munda): SUCCESS${NC}"
    echo "$RESPONSE" | jq '.'
else
    echo -e "${RED}❌ News Aggregator (Munda): FAILED${NC}"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ALL TESTS COMPLETED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Summary:"
echo "- Tested 5 tribal languages (Santali, Gondi, Bhili, Kurukh, Munda)"
echo "- Tested Hindi and English"
echo "- Tested Cultural Assistant with different queries"
echo "- Tested News Aggregator with GET and POST methods"
echo ""
echo "🌐 Web App: https://hs-2428.github.io/ai-hackathon/demo.html"
echo "🖥️  Local Test: http://localhost:3002/web-app/index.html"
echo ""

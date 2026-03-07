#!/bin/bash

# Test Deployment Script
# Tests all API endpoints to ensure functionality

set -e

# Load configuration
if [ ! -f deployment-config.json ]; then
    echo "❌ deployment-config.json not found. Run deploy-with-monitoring.sh first"
    exit 1
fi

API_URL=$(cat deployment-config.json | grep apiEndpoint | cut -d'"' -f4)

echo "🧪 Testing Tribal App Deployment..."
echo "API: $API_URL"
echo ""

# Test 1: Language Detection
echo "Test 1: Language Detection"
echo "Testing Hindi text..."
RESPONSE=$(curl -s -X POST "${API_URL}detect-language" \
    -H "Content-Type: application/json" \
    -d '{"text":"नमस्ते, मुझे सरकारी योजनाओं के बारे में बताएं"}')

if [[ $RESPONSE == *"language"* ]]; then
    echo "✅ Language detection working"
    echo "Response: $RESPONSE"
else
    echo "❌ Language detection failed"
    echo "Response: $RESPONSE"
fi
echo ""

# Test 2: Cultural Assistant (This will cost ~$0.004)
echo "Test 2: Cultural Assistant"
echo "⚠️  This test will cost approximately \$0.004"
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    RESPONSE=$(curl -s -X POST "${API_URL}cultural-assistant" \
        -H "Content-Type: application/json" \
        -d '{
            "query": "What government schemes are available for education?",
            "language": "hindi",
            "userId": "test-user-123",
            "sessionId": "test-session-456",
            "culturalContext": "Rural tribal community"
        }')
    
    if [[ $RESPONSE == *"response"* ]]; then
        echo "✅ Cultural assistant working"
        echo "Response preview: $(echo $RESPONSE | cut -c1-200)..."
    else
        echo "❌ Cultural assistant failed"
        echo "Response: $RESPONSE"
    fi
else
    echo "⏭️  Skipped cultural assistant test"
fi
echo ""

# Test 3: Text-to-Speech (This will cost ~$0.002)
echo "Test 3: Text-to-Speech"
echo "⚠️  This test will cost approximately \$0.002"
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    RESPONSE=$(curl -s -X POST "${API_URL}text-to-speech" \
        -H "Content-Type: application/json" \
        -d '{
            "text": "नमस्ते, यह एक परीक्षण है",
            "language": "hi-IN",
            "voiceId": "Aditi"
        }')
    
    if [[ $RESPONSE == *"audioUrl"* ]] || [[ $RESPONSE == *"audio"* ]]; then
        echo "✅ Text-to-speech working"
    else
        echo "❌ Text-to-speech failed"
        echo "Response: $RESPONSE"
    fi
else
    echo "⏭️  Skipped text-to-speech test"
fi
echo ""

# Test 4: News Aggregator
echo "Test 4: News Aggregator"
RESPONSE=$(curl -s -X POST "${API_URL}news" \
    -H "Content-Type: application/json" \
    -d '{"language": "santali", "category": "government"}')

if [[ $RESPONSE == *"news"* ]] || [[ $RESPONSE == *"items"* ]] || [[ $RESPONSE == "[]" ]]; then
    echo "✅ News aggregator working"
else
    echo "⚠️  News aggregator response: $RESPONSE"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Testing Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💰 Estimated cost of this test: ~\$0.01"
echo ""
echo "📱 Your app is ready to use!"
echo "   API Endpoint: $API_URL"
echo ""

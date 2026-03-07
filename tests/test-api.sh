#!/bin/bash

# Test script for Tribal App API endpoints
# Usage: ./test-api.sh <API_GATEWAY_URL>

API_URL=$1

if [ -z "$API_URL" ]; then
    echo "Usage: ./test-api.sh <API_GATEWAY_URL>"
    exit 1
fi

echo "Testing Tribal App API at: $API_URL"
echo "=========================================="

# Test 1: Language Detection
echo -e "\n1. Testing Language Detection..."
curl -X POST "$API_URL/detect-language" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "जोहार, मैं सरकारी योजना के बारे में जानना चाहता हूं",
    "sessionId": "test-session-1"
  }' | jq '.'

# Test 2: Cultural Assistant
echo -e "\n2. Testing Cultural Assistant..."
curl -X POST "$API_URL/cultural-assistant" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What government schemes are available for education?",
    "language": "santali",
    "userId": "test-user-1",
    "sessionId": "test-session-2",
    "culturalContext": "tribal-community"
  }' | jq '.'

# Test 3: Text to Speech
echo -e "\n3. Testing Text to Speech..."
curl -X POST "$API_URL/text-to-speech" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "नमस्ते, आपका स्वागत है",
    "language": "hindi",
    "sessionId": "test-session-3"
  }' | jq '.'

# Test 4: News Aggregator
echo -e "\n4. Testing News Aggregator..."
curl -X POST "$API_URL/news" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "santali",
    "category": "general",
    "limit": 5
  }' | jq '.'

echo -e "\n=========================================="
echo "API Testing Complete!"

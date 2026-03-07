# Quick Test Guide

## ✅ Web App is Running!

**URL**: http://localhost:3002/web-app/index.html

## Test Features:

1. **Language Selection** - Click Santali/Gondi/Hindi/English
2. **Text Input** - Type "What is scholarship?" and click Ask
3. **Voice Input** - Click 🎤 button (Chrome/Edge only)
4. **Text-to-Speech** - Click 🔊 after getting answer
5. **News Feed** - Auto-loads at bottom

## Deploy to AWS (45 min, $0-2 cost):

See `AWS_DEPLOYMENT_STEPS.md` for complete guide.

Quick commands:
```bash
# 1. Configure AWS
aws configure

# 2. Enable Bedrock models (AWS Console)
# Go to Bedrock → Model access → Enable Claude 3.5 Sonnet

# 3. Deploy (from project root)
cd backend/lambda/language-detector
npm install
zip -r function.zip .
aws lambda create-function --function-name tribal-language-detector --runtime nodejs18.x --role YOUR_ROLE_ARN --handler index.handler --zip-file fileb://function.zip

# Repeat for all 5 Lambda functions
```

## Cost Summary:
- Local testing: FREE
- AWS testing: $0-2 (free tier)
- Hackathon demo: $1-3 total

# Quick Setup Guide - 24 Hour Milestone

This guide will help you achieve the 24-hour milestone: **Deploy a working voice-to-culturally-adapted-response pipeline**

## Prerequisites Checklist

- [ ] AWS Account with admin access
- [ ] AWS CLI installed and configured
- [ ] Node.js 18+ installed
- [ ] Python 3.9+ installed
- [ ] Git installed

## Quick Start (2 Hours)

### Step 1: Clone and Setup (10 minutes)

```bash
# Clone repository
git clone https://github.com/hs-2428/ai-hackathon.git
cd ai-hackathon

# Install dependencies
cd infrastructure
npm install
cd ../mobile-app
npm install
cd ..
```

### Step 2: AWS Bedrock Access (15 minutes)

1. Go to AWS Console
2. Navigate to Amazon Bedrock
3. Click "Model access" in left sidebar
4. Request access to:
   - Claude 3.5 Sonnet
   - Amazon Titan Text G1 - Express
   - Amazon Titan Embeddings G1 - Text
5. Wait for approval (usually instant)

### Step 3: Deploy Infrastructure (30 minutes)

```bash
cd infrastructure

# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy stack
cdk deploy

# Note the API Gateway URL from output
```

### Step 4: Upload Cultural Data (10 minutes)

```bash
# Get your bucket name from CDK output
KNOWLEDGE_BUCKET="tribal-app-knowledge"

# Upload cultural knowledge
aws s3 sync ../data/cultural-knowledge/ s3://$KNOWLEDGE_BUCKET/cultural-kb/

# Upload sample news
aws s3 sync ../data/sample-news/ s3://tribal-app-news/news-feed/santali/
```

### Step 5: Test Backend (15 minutes)

```bash
# Get your API URL from CDK output
API_URL="https://xxxxx.execute-api.us-east-1.amazonaws.com/prod"

# Test language detection
curl -X POST "$API_URL/detect-language" \
  -H "Content-Type: application/json" \
  -d '{"text": "जोहार", "sessionId": "test-1"}'

# Test cultural assistant
curl -X POST "$API_URL/cultural-assistant" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What scholarships are available?",
    "language": "santali",
    "userId": "test-user",
    "sessionId": "test-session"
  }'
```

### Step 6: Configure Mobile App (10 minutes)

```bash
cd mobile-app

# Create environment file
echo "API_GATEWAY_URL=$API_URL" > .env

# Install Expo CLI if not already installed
npm install -g expo-cli

# Start development server
npm start
```

### Step 7: Test on Mobile (30 minutes)

1. Install "Expo Go" app on your phone (iOS/Android)
2. Scan QR code from terminal
3. App should load
4. Select "Santali" language
5. Tap microphone button
6. Speak: "What government schemes are available?"
7. Verify response in Santali context

## Verification Checklist

- [ ] Infrastructure deployed successfully
- [ ] API endpoints responding
- [ ] Cultural knowledge uploaded to S3
- [ ] Mobile app connects to API
- [ ] Voice input works
- [ ] Language detection works
- [ ] Cultural responses generated
- [ ] News feed displays

## Troubleshooting

### Issue: CDK Deploy Fails
```bash
# Check AWS credentials
aws sts get-caller-identity

# Ensure region is set
export AWS_DEFAULT_REGION=us-east-1
```

### Issue: Bedrock Access Denied
- Go to AWS Console > Bedrock > Model access
- Ensure all models show "Access granted"

### Issue: Mobile App Won't Connect
- Check .env file has correct API_GATEWAY_URL
- Ensure phone and computer on same network
- Check API Gateway CORS settings

### Issue: No Voice Recognition
- Grant microphone permissions to Expo Go
- Check device microphone works in other apps

## Next Steps After 24-Hour Milestone

1. Add more tribal languages (Gondi, Bhili, etc.)
2. Implement offline caching
3. Add more cultural knowledge
4. Deploy to production (Play Store/App Store)
5. Setup monitoring and analytics
6. Add user feedback system

## Cost Monitoring

Monitor your AWS costs:
```bash
# Check current month costs
aws ce get-cost-and-usage \
  --time-period Start=2024-03-01,End=2024-03-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

Expected costs for testing: $5-10/day

## Support Resources

- AWS Bedrock Documentation: https://docs.aws.amazon.com/bedrock/
- React Native Voice: https://github.com/react-native-voice/voice
- Expo Documentation: https://docs.expo.dev/

## Success Criteria

Your 24-hour milestone is complete when:
1. ✅ User can speak in tribal language
2. ✅ App detects language automatically
3. ✅ Claude provides culturally-adapted response
4. ✅ Response considers tribal context and government schemes
5. ✅ Audio response plays back
6. ✅ News feed shows relevant information

Congratulations! You've built a working tribal language accessibility platform! 🎉

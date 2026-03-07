# Deployment Guide - Tribal Language Accessibility Platform

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI configured
3. Node.js 18+ and npm
4. Python 3.9+
5. AWS CDK installed: `npm install -g aws-cdk`
6. Expo CLI for mobile app: `npm install -g expo-cli`

## Step-by-Step Deployment

### Phase 1: AWS Infrastructure Setup (30 minutes)

#### 1. Configure AWS Credentials
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-east-1 (or your preferred region)
```

#### 2. Enable Bedrock Model Access
```bash
# Go to AWS Console > Bedrock > Model access
# Request access to:
# - Claude 3.5 Sonnet
# - Amazon Titan Text
# - Amazon Titan Embeddings
```

#### 3. Deploy Infrastructure with CDK
```bash
cd infrastructure
npm install
cdk bootstrap  # First time only
cdk deploy
```

This will create:
- Lambda functions for all services
- DynamoDB tables for sessions, interactions, news
- S3 buckets for audio, knowledge base, news
- API Gateway with endpoints
- IAM roles and permissions

#### 4. Note the API Gateway URL
After deployment, note the `APIEndpoint` output. You'll need this for the mobile app.

### Phase 2: Upload Cultural Knowledge Base (15 minutes)

```bash
# Upload cultural knowledge to S3
aws s3 sync data/cultural-knowledge/ s3://tribal-app-knowledge/cultural-kb/

# Verify upload
aws s3 ls s3://tribal-app-knowledge/cultural-kb/ --recursive
```

### Phase 3: Configure Amazon Transcribe Custom Vocabulary (20 minutes)

Create custom vocabulary for tribal languages:

```bash
# Create vocabulary file
cat > tribal-vocab.txt << EOF
Santali
Gondi
Bhili
Kurukh
Khasi
Mizo
Bodo
Johar
Sohrai
Madai
EOF

# Upload to S3
aws s3 cp tribal-vocab.txt s3://tribal-app-audio/vocabulary/

# Create custom vocabulary
aws transcribe create-vocabulary \
  --vocabulary-name tribal-languages-vocab \
  --language-code hi-IN \
  --vocabulary-file-uri s3://tribal-app-audio/vocabulary/tribal-vocab.txt
```

### Phase 4: Mobile App Setup (20 minutes)

#### 1. Configure API Endpoint
```bash
cd mobile-app
npm install

# Create .env file
cat > .env << EOF
API_GATEWAY_URL=<YOUR_API_GATEWAY_URL_FROM_CDK_OUTPUT>
EOF
```

#### 2. Test on Expo
```bash
npm start
# Scan QR code with Expo Go app on your phone
```

#### 3. Build for Production
```bash
# For Android
expo build:android

# For iOS
expo build:ios
```

### Phase 5: Edge Deployment (Optional - for offline areas)

#### 1. Setup AWS IoT Greengrass
```bash
# Install Greengrass on edge device (Raspberry Pi, etc.)
curl -s https://d2s8p88vqu9w66.cloudfront.net/releases/greengrass-nucleus-latest.zip > greengrass-nucleus-latest.zip
unzip greengrass-nucleus-latest.zip -d GreengrassInstaller

# Run installer
sudo -E java -Droot="/greengrass/v2" -jar ./GreengrassInstaller/lib/Greengrass.jar \
  --aws-region us-east-1 \
  --thing-name TribalAppEdgeDevice \
  --component-default-user ggc_user:ggc_group \
  --provision true \
  --setup-system-service true
```

#### 2. Deploy Offline Component
```bash
# Package offline assistant
cd edge-deployment
zip -r offline-component.zip offline_assistant.py greengrass-config.json

# Upload to S3
aws s3 cp offline-component.zip s3://tribal-app-models/

# Deploy component
aws greengrassv2 create-component-version \
  --inline-recipe file://greengrass-config.json
```

### Phase 6: Testing (15 minutes)

#### 1. Test API Endpoints
```bash
# Test language detection
curl -X POST <API_GATEWAY_URL>/detect-language \
  -H "Content-Type: application/json" \
  -d '{"text": "जोहार, मैं सरकारी योजना के बारे में जानना चाहता हूं", "sessionId": "test-123"}'

# Test cultural assistant
curl -X POST <API_GATEWAY_URL>/cultural-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What government schemes are available?",
    "language": "santali",
    "userId": "test-user",
    "sessionId": "test-session"
  }'
```

#### 2. Test Mobile App
- Open app in Expo
- Select a tribal language
- Tap microphone and speak
- Verify response in selected language
- Check news feed loads

### Phase 7: Monitoring & Optimization

#### 1. Setup CloudWatch Dashboards
```bash
# Monitor Lambda invocations, errors, duration
# Monitor DynamoDB read/write capacity
# Monitor S3 bucket usage
```

#### 2. Enable X-Ray Tracing
```bash
# Add to Lambda functions for detailed tracing
aws lambda update-function-configuration \
  --function-name CulturalAssistant \
  --tracing-config Mode=Active
```

## Cost Estimation (Monthly)

For 1000 active users:
- Lambda: ~$20
- DynamoDB: ~$10
- S3: ~$5
- Bedrock (Claude): ~$100 (based on usage)
- API Gateway: ~$5
- Transcribe: ~$30
- Polly: ~$20
- **Total: ~$190/month**

## Troubleshooting

### Issue: Bedrock Access Denied
**Solution**: Ensure you've requested model access in AWS Console > Bedrock > Model access

### Issue: Lambda Timeout
**Solution**: Increase timeout in CDK stack (currently 30s)

### Issue: Mobile App Can't Connect
**Solution**: Check API Gateway URL in .env file, ensure CORS is enabled

### Issue: Voice Recognition Not Working
**Solution**: Check microphone permissions on device, verify Transcribe custom vocabulary is created

## Next Steps

1. Add more tribal languages
2. Implement user feedback system
3. Add offline model caching
4. Create admin dashboard for content management
5. Integrate with more government databases
6. Add community forums feature

## Support

For issues or questions:
- GitHub Issues: https://github.com/hs-2428/ai-hackathon/issues
- Email: support@tribal-app.org

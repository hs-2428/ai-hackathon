# Quick Reference Card

## 🚀 Essential Commands

### Deploy Infrastructure
```bash
cd infrastructure
npm install
cdk bootstrap  # First time only
cdk deploy
```

### Start Mobile App
```bash
cd mobile-app
npm install
echo "API_GATEWAY_URL=<your-url>" > .env
npm start
```

### Test API
```bash
chmod +x tests/test-api.sh
./tests/test-api.sh <API_GATEWAY_URL>
```

### Upload Data
```bash
aws s3 sync data/cultural-knowledge/ s3://tribal-app-knowledge/cultural-kb/
aws s3 sync data/sample-news/ s3://tribal-app-news/news-feed/santali/
```

## 📡 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/cultural-assistant` | POST | Get AI response |
| `/detect-language` | POST | Detect language |
| `/voice-processor` | POST | Process audio |
| `/text-to-speech` | POST | Generate audio |
| `/news` | POST | Get news feed |

## 🗣️ Supported Languages

| Language | Code | Speakers | Script |
|----------|------|----------|--------|
| Santali | sat | 7.4M | Devanagari, Ol Chiki |
| Gondi | gon | 3M | Devanagari, Telugu |
| Bhili | bhi | - | Devanagari |
| Kurukh | kru | - | Devanagari |
| Khasi | kha | - | Latin |
| Mizo | lus | - | Latin |
| Bodo | brx | - | Devanagari |
| Hindi | hi | - | Devanagari |
| English | en | - | Latin |

## 🔧 Environment Variables

### Infrastructure
```bash
export AWS_DEFAULT_REGION=us-east-1
export CDK_DEFAULT_ACCOUNT=<your-account-id>
```

### Mobile App (.env)
```bash
API_GATEWAY_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod
```

## 📦 AWS Resources Created

### Lambda Functions (5)
- `CulturalAssistant`
- `TextToSpeech`
- `VoiceProcessor`
- `LanguageDetector`
- `NewsAggregator`

### DynamoDB Tables (3)
- `tribal-app-sessions`
- `tribal-app-interactions`
- `tribal-app-news`

### S3 Buckets (3)
- `tribal-app-audio`
- `tribal-app-knowledge`
- `tribal-app-news`

### Other
- API Gateway REST API
- IAM Roles & Policies
- CloudWatch Log Groups

## 💰 Cost Breakdown

| Service | Monthly Cost |
|---------|--------------|
| Lambda | $20 |
| DynamoDB | $10 |
| S3 | $5 |
| Bedrock | $100 |
| API Gateway | $5 |
| Transcribe | $30 |
| Polly | $20 |
| **Total** | **~$190** |

## 🐛 Common Issues

### Issue: Bedrock Access Denied
```bash
# Solution: Enable model access
AWS Console → Bedrock → Model access → Request access
```

### Issue: CDK Deploy Fails
```bash
# Solution: Check credentials
aws sts get-caller-identity
cdk bootstrap
```

### Issue: Mobile App Won't Connect
```bash
# Solution: Check .env file
cat mobile-app/.env
# Ensure API_GATEWAY_URL is correct
```

### Issue: Lambda Timeout
```bash
# Solution: Increase timeout in CDK
timeout: cdk.Duration.seconds(60)
```

## 📊 Monitoring Commands

### Check Lambda Logs
```bash
aws logs tail /aws/lambda/CulturalAssistant --follow
```

### Check DynamoDB Items
```bash
aws dynamodb scan --table-name tribal-app-sessions --limit 5
```

### Check S3 Contents
```bash
aws s3 ls s3://tribal-app-knowledge/cultural-kb/ --recursive
```

### Check API Gateway Logs
```bash
aws logs tail /aws/apigateway/TribalAppAPI --follow
```

## 🧪 Test Payloads

### Language Detection
```json
{
  "text": "जोहार, मैं सरकारी योजना के बारे में जानना चाहता हूं",
  "sessionId": "test-123"
}
```

### Cultural Assistant
```json
{
  "query": "What scholarships are available?",
  "language": "santali",
  "userId": "test-user",
  "sessionId": "test-session",
  "culturalContext": "tribal-community"
}
```

### Text-to-Speech
```json
{
  "text": "नमस्ते, आपका स्वागत है",
  "language": "hindi",
  "sessionId": "test-session",
  "format": "mp3"
}
```

### News
```json
{
  "language": "santali",
  "category": "general",
  "limit": 10
}
```

## 🔐 Security Checklist

- [ ] AWS credentials configured
- [ ] IAM roles with least privilege
- [ ] S3 buckets encrypted
- [ ] API Gateway CORS configured
- [ ] Lambda environment variables secured
- [ ] DynamoDB encryption enabled
- [ ] CloudWatch logs retention set

## 📱 Mobile App Structure

```
mobile-app/
├── App.js                    # Main app component
├── src/
│   ├── components/
│   │   ├── VoiceAssistant.js    # Voice UI
│   │   ├── LanguageSelector.js  # Language picker
│   │   └── NewsFeed.js          # News display
│   └── services/
│       ├── APIService.js        # API client
│       └── OfflineManager.js    # Offline cache
└── package.json
```

## 🎯 Success Criteria

- [ ] Infrastructure deployed
- [ ] API endpoints responding
- [ ] Mobile app connects
- [ ] Voice input works
- [ ] Language detection accurate
- [ ] Cultural responses generated
- [ ] News feed displays
- [ ] Offline mode functional

## 📞 Support Resources

- **GitHub**: https://github.com/hs-2428/ai-hackathon
- **AWS Bedrock Docs**: https://docs.aws.amazon.com/bedrock/
- **React Native Voice**: https://github.com/react-native-voice/voice
- **Expo Docs**: https://docs.expo.dev/

## 🎓 Learning Resources

### AWS Services
- [Amazon Bedrock Workshop](https://catalog.workshops.aws/bedrock/)
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [DynamoDB Design Patterns](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)

### React Native
- [React Native Tutorial](https://reactnative.dev/docs/tutorial)
- [Expo Guide](https://docs.expo.dev/tutorial/introduction/)

## 🔄 Update Commands

### Update Lambda Code
```bash
cd backend/lambda/cultural-assistant
# Make changes
cd ../../../infrastructure
cdk deploy
```

### Update Mobile App
```bash
cd mobile-app
# Make changes
npm start  # Test
expo build:android  # Build
```

### Update Cultural Knowledge
```bash
# Edit data/cultural-knowledge/{language}/knowledge.json
aws s3 sync data/cultural-knowledge/ s3://tribal-app-knowledge/cultural-kb/
```

## 🗑️ Cleanup Commands

### Delete All Resources
```bash
cd infrastructure
cdk destroy
```

### Delete S3 Buckets (if needed)
```bash
aws s3 rb s3://tribal-app-audio --force
aws s3 rb s3://tribal-app-knowledge --force
aws s3 rb s3://tribal-app-news --force
```

---

**Quick Reference Version**: 1.0
**For**: Tribal Language Accessibility Platform

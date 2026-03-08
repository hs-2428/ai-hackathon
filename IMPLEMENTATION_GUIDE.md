# Tribal Language AI Assistant - Complete Implementation Guide

## 🎯 Project Overview

A fully functional offline-capable AI assistant app for tribal communities in India, supporting multiple tribal languages with AWS services integration.

## 🌍 Supported Tribal Languages

1. **Santali (संताली)** - Jharkhand, West Bengal, Odisha
2. **Gondi (गोंडी)** - Madhya Pradesh, Chhattisgarh, Maharashtra
3. **Bhili (भीली)** - Rajasthan, Gujarat, Madhya Pradesh
4. **Kurukh (कुड़ुख)** - Jharkhand, Chhattisgarh (Oraon community)
5. **Munda (मुंडा/मुंडारी)** - Jharkhand, Odisha, West Bengal
6. **Hindi (हिंदी)** - Common language
7. **English** - For wider accessibility

## 🏗️ Architecture

### AWS Services Used

1. **Amazon Bedrock** - Claude 3.5 Sonnet for AI responses
2. **AWS Lambda** - Serverless compute for all endpoints
3. **Amazon API Gateway** - REST API endpoints
4. **Amazon DynamoDB** - User sessions, interactions, news cache
5. **Amazon S3** - Cultural knowledge base, audio files, news data
6. **Amazon Polly** - Text-to-speech in tribal languages
7. **Amazon Transcribe** - Speech-to-text (future enhancement)
8. **AWS IoT Greengrass** - Offline edge deployment

### Application Components

```
┌─────────────────────────────────────────────────────────┐
│                    Web/Mobile App                        │
│  (React Native + Web, Offline-capable with localStorage)│
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Amazon API Gateway (REST)                   │
│  /cultural-assistant  /news  /detect-language  /tts     │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┐
        ▼            ▼            ▼            ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
   │ Lambda  │  │ Lambda  │  │ Lambda  │  │ Lambda  │
   │Cultural │  │  News   │  │Language │  │   TTS   │
   │Assistant│  │Aggreg.  │  │Detector │  │         │
   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
   ┌─────────────────────────────────────────────────┐
   │  Amazon Bedrock (Claude 3.5 Sonnet)             │
   │  Amazon Polly (Text-to-Speech)                  │
   │  DynamoDB (Sessions, Interactions, News Cache)  │
   │  S3 (Knowledge Base, Audio, News Data)          │
   └─────────────────────────────────────────────────┘
```

## 📋 Features Implemented

### ✅ Core Features

1. **Multi-Language Support**
   - 7 languages including 5 tribal languages
   - Automatic language detection
   - Language-specific cultural responses

2. **AI Cultural Assistant**
   - Government schemes information
   - Health services guidance
   - Education scholarships
   - Agricultural support
   - Forest rights information
   - Ration card assistance
   - Complaint filing guidance

3. **News Aggregator**
   - Tribal language news
   - Government announcements
   - Cultural events
   - Health campaigns
   - Education opportunities

4. **Voice Interface**
   - Voice input (Web Speech API)
   - Text-to-speech output
   - Hands-free operation

5. **Offline Capability**
   - LocalStorage caching
   - Service Worker (future)
   - AWS IoT Greengrass for edge deployment

## 🚀 Deployment Steps

### Prerequisites

```bash
# Install AWS CLI
# Install Node.js 18+
# Install AWS CDK
npm install -g aws-cdk

# Configure AWS credentials
aws configure
```

### Step 1: Install Dependencies

```bash
# Install infrastructure dependencies
cd infrastructure
npm install
cd ..

# Install Lambda dependencies
cd backend/lambda/cultural-assistant && npm install && cd ../../..
cd backend/lambda/news-aggregator && npm install && cd ../../..
cd backend/lambda/language-detector && npm install && cd ../../..
cd backend/lambda/text-to-speech && npm install && cd ../../..
cd backend/lambda/voice-processor && npm install && cd ../../..
```

### Step 2: Bootstrap CDK (First time only)

```bash
cd infrastructure
cdk bootstrap
```

### Step 3: Deploy to AWS

```bash
# Deploy the stack
cd infrastructure
cdk deploy

# Or use the automated script
chmod +x update-deployment.sh
./update-deployment.sh
```

### Step 4: Upload Cultural Knowledge

```bash
# Upload cultural knowledge to S3
aws s3 cp data/cultural-knowledge/ s3://tribal-app-knowledge/cultural-knowledge/ --recursive

# Upload sample news
aws s3 cp data/sample-news/ s3://tribal-app-knowledge/sample-news/ --recursive
```

### Step 5: Test Deployment

```bash
# Test cultural assistant
curl -X POST "https://YOUR-API-ENDPOINT/prod/cultural-assistant" \
  -H "Content-Type: application/json" \
  -d '{"query":"What scholarships are available?","language":"hindi"}'

# Test news endpoint
curl -X POST "https://YOUR-API-ENDPOINT/prod/news" \
  -H "Content-Type: application/json" \
  -d '{"language":"santali","limit":5}'
```

## 🧪 Local Testing

### Start Local Mock Server

```bash
# Start the local server
node local-server/server.js

# Access the web app
# Open: http://localhost:3002/web-app/index.html
```

### Test Endpoints Locally

```bash
# Test cultural assistant
curl -X POST "http://localhost:3002/cultural-assistant" \
  -H "Content-Type: application/json" \
  -d '{"question":"What scholarships are available?","language":"hindi"}'

# Test news
curl "http://localhost:3002/news?language=santali"
```

## 📱 Web App Features

### Language Selection
- Click on language buttons to switch
- App remembers your selection
- News and responses adapt to selected language

### Voice Assistant
1. **Text Input**: Type your question
2. **Voice Input**: Click microphone button and speak
3. **Get Answer**: AI responds in your selected language
4. **Speak Answer**: Click speaker button to hear the response

### News Feed
- Automatically loads news in selected language
- Updates when you change language
- Shows latest 3 news items
- Categories: Education, Health, Rights, Culture, etc.

## 🔧 Configuration

### Update API Endpoint

The web app automatically detects if running locally or on AWS:

```javascript
// In web-app/app.js
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3002'
    : 'https://YOUR-API-ENDPOINT/prod';
```

### Environment Variables

Lambda functions use these environment variables:
- `KNOWLEDGE_BUCKET` - S3 bucket for cultural knowledge
- `AUDIO_BUCKET` - S3 bucket for audio files
- `NEWS_BUCKET` - S3 bucket for news data
- `SESSIONS_TABLE` - DynamoDB table for sessions
- `INTERACTIONS_TABLE` - DynamoDB table for interactions
- `NEWS_TABLE` - DynamoDB table for news cache

## 💰 Cost Optimization

### Current Settings

1. **Lambda Concurrency**: Limited to 10
2. **API Throttling**: 100 requests/second
3. **DynamoDB**: On-demand billing (no idle cost)
4. **S3 Lifecycle**: 30-day expiration for audio files
5. **TTL**: 30 days for DynamoDB records

### Estimated Costs

- **Per voice query**: ~$0.02
- **Idle cost**: $0 (serverless)
- **100 queries/day**: ~$2/day = $60/month
- **1000 queries/day**: ~$20/day = $600/month

### Cost Monitoring

```bash
# Check current costs
aws ce get-cost-and-usage \
  --time-period Start=2026-03-01,End=2026-03-08 \
  --granularity DAILY \
  --metrics BlendedCost
```

## 🌐 GitHub Pages Deployment

### Update demo.html

```html
<!-- Ensure API endpoint is correct -->
<script>
const API_URL = 'https://hlk4vx4dcg.execute-api.us-east-1.amazonaws.com/prod';
</script>
```

### Deploy to GitHub Pages

```bash
# Commit changes
git add .
git commit -m "Update AWS deployment with tribal language support"
git push origin main

# Access at: https://hs-2428.github.io/ai-hackathon/demo.html
```

## 🔍 Troubleshooting

### Issue: API returns 403 Forbidden
**Solution**: Check CORS settings in API Gateway

### Issue: Lambda timeout
**Solution**: Increase timeout in infrastructure/lib/tribal-app-stack.js

### Issue: Bedrock access denied
**Solution**: Enable Claude 3.5 Sonnet in Bedrock console
- Go to: https://console.aws.amazon.com/bedrock/home?region=us-east-1#/modelaccess
- Enable "Claude 3.5 Sonnet v2"

### Issue: News not loading
**Solution**: Check S3 bucket permissions and upload sample news data

## 📊 Monitoring

### CloudWatch Logs

```bash
# View Lambda logs
aws logs tail /aws/lambda/TribalAppStack-CulturalAssistant --follow

# View API Gateway logs
aws logs tail /aws/apigateway/TribalAppAPI --follow
```

### Metrics

- Lambda invocations
- API Gateway requests
- Bedrock API calls
- DynamoDB read/write units
- S3 storage and requests

## 🎓 Cultural Knowledge Base

### Structure

```
data/cultural-knowledge/
├── santali/
│   └── knowledge.json
├── gondi/
│   └── knowledge.json
└── ...
```

### Adding New Knowledge

1. Create JSON file for language
2. Include: schemes, festivals, rights, traditions
3. Upload to S3: `aws s3 cp knowledge.json s3://tribal-app-knowledge/cultural-knowledge/LANGUAGE/`

## 🔐 Security

1. **API Gateway**: CORS enabled for specific origins
2. **Lambda**: IAM roles with least privilege
3. **S3**: Bucket encryption enabled
4. **DynamoDB**: Encryption at rest
5. **Bedrock**: API calls logged in CloudWatch

## 📈 Future Enhancements

1. **Mobile App**: React Native implementation
2. **Offline Mode**: Complete offline functionality with Greengrass
3. **More Languages**: Add more tribal languages
4. **Voice Recognition**: Better tribal language recognition
5. **SMS Integration**: For feature phone users
6. **WhatsApp Bot**: Reach users on WhatsApp
7. **USSD Integration**: For basic phones
8. **Regional Dialects**: Support for language variations

## 🤝 Contributing

To add a new tribal language:

1. Add language to `web-app/app.js` language selector
2. Add responses in `backend/lambda/cultural-assistant/index.js`
3. Add news data in `backend/lambda/news-aggregator/index.js`
4. Create cultural knowledge JSON in `data/cultural-knowledge/`
5. Test locally and deploy

## 📞 Support

For issues or questions:
- Check CloudWatch logs
- Review API Gateway execution logs
- Test endpoints with curl
- Verify Bedrock model access

## ✅ Deployment Checklist

- [ ] AWS CLI configured
- [ ] Bedrock model access enabled
- [ ] CDK bootstrapped
- [ ] Lambda dependencies installed
- [ ] Stack deployed successfully
- [ ] Cultural knowledge uploaded to S3
- [ ] Sample news uploaded to S3
- [ ] API endpoints tested
- [ ] Web app updated with correct API URL
- [ ] GitHub Pages deployed
- [ ] Cost monitoring enabled

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ Web app loads at https://hs-2428.github.io/ai-hackathon/demo.html
2. ✅ Language selection works
3. ✅ AI assistant responds to questions in selected language
4. ✅ News feed shows tribal language news
5. ✅ Voice input and output work
6. ✅ All 7 languages are functional
7. ✅ Responses are culturally appropriate
8. ✅ Government schemes information is accurate

---

**Built with ❤️ for tribal communities in India**

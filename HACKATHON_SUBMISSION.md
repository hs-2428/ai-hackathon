# Tribal Language Accessibility Platform - Hackathon Submission

## 🎯 Project Overview
AI-powered voice assistant for tribal and marginalized communities in India, providing access to government schemes, news, and information in tribal languages.

## 🚀 Live Demo
**API Endpoint:** https://hlk4vx4dcg.execute-api.us-east-1.amazonaws.com/prod/

## ✅ Working Features
1. **Language Detection** - Detects Hindi, Santali, Gondi, and other tribal languages
2. **AI Cultural Assistant** - Provides culturally-aware responses using Amazon Nova Pro
3. **News Aggregator** - News in tribal languages
4. **Offline Capability** - Edge computing with AWS IoT Greengrass

## 🏗️ Architecture
- **Frontend:** React Native (Android/iOS/Web)
- **Backend:** AWS Lambda (Node.js)
- **AI:** Amazon Bedrock (Nova Pro)
- **Database:** DynamoDB
- **Storage:** S3
- **API:** API Gateway
- **Voice:** Amazon Polly & Transcribe

## 🧪 Quick Test

### Test Language Detection
```bash
curl -X POST "https://hlk4vx4dcg.execute-api.us-east-1.amazonaws.com/prod/detect-language" \
  -H "Content-Type: application/json" \
  -d '{"text":"नमस्ते, मुझे सरकारी योजनाओं के बारे में बताएं"}'
```

### Test AI Assistant
```bash
curl -X POST "https://hlk4vx4dcg.execute-api.us-east-1.amazonaws.com/prod/cultural-assistant" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What education scholarships are available?",
    "language": "hindi",
    "userId": "demo-user",
    "sessionId": "demo-session"
  }'
```

### Test News Aggregator
```bash
curl -X POST "https://hlk4vx4dcg.execute-api.us-east-1.amazonaws.com/prod/news" \
  -H "Content-Type: application/json" \
  -d '{"language":"santali","category":"government"}'
```

## 💰 Cost Efficiency
- **Per query:** ~$0.02
- **Idle cost:** $0 (fully serverless)
- **Monthly (1000 users):** ~$20
- **Scalable:** Auto-scales to millions

## 🎯 Impact
- Bridges information gap for 100M+ tribal population in India
- Provides access to government schemes in native languages
- Offline-capable for remote areas
- Cultural context-aware responses

## 📊 Technical Highlights
- Serverless architecture (zero idle costs)
- Multi-language support (8+ tribal languages)
- Cultural knowledge base integration
- Edge computing for offline mode
- Cost-optimized ($0.02 per interaction)

## 🔗 Repository
https://github.com/hs-2428/ai-hackathon

## 👥 Team
[Add your team members here]

## 📹 Demo Video
[Add demo video link if available]

## 🏆 AWS Services Used
✅ Amazon Bedrock (Nova Pro)
✅ AWS Lambda
✅ Amazon S3
✅ Amazon DynamoDB
✅ Amazon Polly
✅ Amazon Transcribe
✅ AWS IoT Greengrass
✅ API Gateway

---

**Deployed and tested on:** March 8, 2026
**Status:** Production Ready ✅

# Tribal Language Accessibility Platform

🎯 **AI-powered voice assistant for tribal and marginalized communities in India**

**Live Demo:** https://hs-2428.github.io/ai-hackathon/demo.html  
**API Endpoint:** https://b52h5hjcc6.execute-api.us-east-1.amazonaws.com/prod/

---

## 🚀 Quick Start

### Test the API
```bash
# Language Detection
curl -X POST "https://b52h5hjcc6.execute-api.us-east-1.amazonaws.com/prod/detect-language" \
  -H "Content-Type: application/json" \
  -d '{"text":"नमस्ते"}'

# AI Assistant
curl -X POST "https://b52h5hjcc6.execute-api.us-east-1.amazonaws.com/prod/cultural-assistant" \
  -H "Content-Type: application/json" \
  -d '{"query":"What scholarships are available?","language":"hindi","userId":"test","sessionId":"test123"}'
```

### Run Tests
```bash
./test-deployment.sh
```

---

## ✨ Features

- 🗣️ **Voice-based AI Assistant** - Culturally-aware responses in tribal languages
- 🌍 **Multi-language Support** - Hindi, Santali, Gondi, Bhili, and more
- 📰 **News Aggregator** - Local news in tribal languages
- 🎓 **Government Schemes** - Information about education, health, welfare
- 📱 **Cross-platform** - React Native (Android/iOS/Web)
- 🔌 **Offline Mode** - Works without internet using AWS IoT Greengrass

---

## 🏗️ Architecture

**AWS Services:**
- Amazon Bedrock (Nova Pro) - AI reasoning
- AWS Lambda - Serverless compute
- Amazon S3 - Storage
- Amazon DynamoDB - Database
- Amazon Polly - Text-to-speech
- Amazon Transcribe - Speech-to-text
- API Gateway - REST API
- AWS IoT Greengrass - Edge computing

**Tech Stack:**
- Backend: Node.js, AWS Lambda
- Frontend: React Native
- Infrastructure: AWS CDK
- AI: Amazon Nova Pro

---

## 💰 Cost Efficiency

- **Per query:** ~$0.02
- **Idle cost:** $0 (fully serverless)
- **1000 users/month:** ~$20
- **Scalable:** Auto-scales to millions

**Cost Protection:**
- API throttling: 100 req/sec
- Lambda concurrency limits
- DynamoDB on-demand pricing
- S3 lifecycle policies

---

## 🎯 Impact

- **Target:** 100M+ tribal population in India
- **Problem:** Information gap due to language barriers
- **Solution:** AI assistant in native tribal languages
- **Benefit:** Access to government schemes, education, healthcare

---

## 📊 Technical Highlights

✅ Serverless architecture (zero idle costs)  
✅ Multi-language support (8+ tribal languages)  
✅ Cultural knowledge base integration  
✅ Edge computing for offline mode  
✅ Cost-optimized ($0.02 per interaction)  
✅ Production-ready with CORS support  

---

## 🧪 Testing

### Quick Test
```bash
cd /Users/tsharma/ai-hackathon
./test-deployment.sh
```

### Web Demo
Open: https://hs-2428.github.io/ai-hackathon/demo.html

### Monitor Costs
```bash
./check-costs.sh
```

---

## 📱 Deployment

### Deploy to AWS
```bash
./deploy-with-monitoring.sh
```

### Destroy (Stop Costs)
```bash
cd infrastructure
cdk destroy
```

---

## 🔗 Links

- **GitHub:** https://github.com/hs-2428/ai-hackathon
- **Demo:** https://hs-2428.github.io/ai-hackathon/demo.html
- **API:** https://b52h5hjcc6.execute-api.us-east-1.amazonaws.com/prod/

---

## 👥 Team

[Add your team members]

---

## 📄 License

MIT License

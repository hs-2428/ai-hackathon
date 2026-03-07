# 🚀 Tribal Language Assistant - Ready for AWS Deployment

## ✅ Current Features (All Working Locally)

### 1. Multi-Language Support (7 Languages)
- Santali (संताली)
- Gondi (गोंडी)
- Bhili (भीली)
- Kurukh/Oraon (कुड़ुख)
- Munda (मुंडा)
- Hindi (हिंदी)
- English

### 2. AI Assistant Features
- Text input with instant responses
- Voice input (auto-submit after recording)
- Text-to-speech for answers
- Language-specific responses in tribal dialects
- 10+ topic categories:
  - Scholarship/Education
  - Health/Ayushman Bharat
  - Farming/PM-KISAN
  - Ration cards
  - Government schemes
  - Tribal rights
  - Complaints/Grievances
  - Politics/Elections/Voting
  - Forest rights
  - Festivals/Culture
  - Latest world news

### 3. News Feed
- Community-specific news for each language
- Auto-updates based on selected language
- Culturally relevant content

### 4. Offline Support
- LocalStorage caching
- Works without internet (with cached data)

---

## 🏗️ AWS Services Used

### Core Services (Required for Deployment)

1. **AWS Lambda** (5 functions)
   - `language-detector` - Detects input language
   - `cultural-assistant` - AI responses using Bedrock
   - `text-to-speech` - Converts text to audio
   - `voice-processor` - Processes voice input
   - `news-aggregator` - Fetches community news
   - **Cost**: FREE (1M requests/month), then $0.20/1M
   - **Memory**: 256MB per function
   - **Timeout**: 30-60 seconds

2. **Amazon Bedrock** (AI/ML)
   - Claude 3.5 Sonnet - Cultural reasoning & responses
   - Amazon Titan Text - Knowledge queries
   - Amazon Titan Embeddings - Semantic search
   - **Cost**: First 2 months FREE, then ~$0.003/1K tokens
   - **Usage**: ~$0.50-2 for hackathon demo

3. **API Gateway** (REST API)
   - Endpoints: /detect-language, /cultural-assistant, /text-to-speech, /news
   - CORS enabled for web app
   - **Cost**: FREE (1M requests/month), then $3.50/1M

4. **Amazon DynamoDB** (Database)
   - Tables: user-sessions, cultural-cache
   - On-demand billing mode
   - **Cost**: 25GB storage FREE, 25 read/write units FREE

5. **Amazon S3** (Storage)
   - Cultural knowledge data (JSON files)
   - Sample news data
   - Web app hosting (static files)
   - **Cost**: 5GB storage FREE, 20K GET requests FREE

6. **Amazon Polly** (Text-to-Speech)
   - Converts responses to audio
   - Supports Hindi voice (closest to tribal languages)
   - **Cost**: 5M characters/month FREE, then $4/1M chars

7. **Amazon Transcribe** (Speech-to-Text)
   - Processes voice input
   - Language detection
   - **Cost**: 60 minutes/month FREE, then $0.024/min

### Optional Services (For Production)

8. **AWS IoT Greengrass** (Edge Computing)
   - Offline mode for remote areas
   - Local AI processing
   - **Cost**: Pay per device

9. **Amazon CloudWatch** (Monitoring)
   - Logs and metrics
   - **Cost**: 5GB logs FREE

10. **AWS IAM** (Security)
    - Role-based access control
    - **Cost**: FREE

---

## 💰 Cost Estimate

### Hackathon Demo (1 week)
- Lambda: $0.00 (within free tier)
- Bedrock: $0.50-1.00
- API Gateway: $0.00 (within free tier)
- DynamoDB: $0.00 (within free tier)
- S3: $0.00 (within free tier)
- Polly: $0.00 (within free tier)
- Transcribe: $0.00 (within free tier)
- **Total: $0.50-2.00**

### Production (1000 users/month)
- Lambda: $0.20
- Bedrock: $15-20
- API Gateway: $3.50
- DynamoDB: $5
- S3: $1
- Polly: $2
- Transcribe: $5
- **Total: $20-50/month**

---

## 📋 Pre-Deployment Checklist

### ✅ Completed
- [x] 7 tribal languages implemented
- [x] Voice input/output working
- [x] 10+ topic categories with responses
- [x] Community-specific news feeds
- [x] Offline support (localStorage)
- [x] Web app UI complete
- [x] Local testing successful
- [x] All Lambda functions coded
- [x] Cultural knowledge data prepared

### 🔲 To Do Before AWS Deployment

1. **AWS Account Setup**
   - [ ] Create/login to AWS account
   - [ ] Configure AWS CLI (`aws configure`)
   - [ ] Set default region (us-east-1 recommended)

2. **Enable Bedrock Models**
   - [ ] Go to AWS Console → Bedrock
   - [ ] Enable Claude 3.5 Sonnet
   - [ ] Enable Amazon Titan Text
   - [ ] Enable Amazon Titan Embeddings
   - [ ] Wait for approval (usually instant)

3. **Create IAM Role**
   - [ ] Create lambda-execution-role
   - [ ] Attach policies: Lambda, Bedrock, DynamoDB, S3, Polly, Transcribe

4. **Deploy Lambda Functions**
   - [ ] Package each function with dependencies
   - [ ] Upload to AWS Lambda
   - [ ] Configure environment variables
   - [ ] Test each function

5. **Setup API Gateway**
   - [ ] Create REST API
   - [ ] Create resources and methods
   - [ ] Enable CORS
   - [ ] Deploy to stage (prod)
   - [ ] Get API endpoint URL

6. **Create DynamoDB Tables**
   - [ ] tribal-user-sessions
   - [ ] tribal-cultural-cache

7. **Upload to S3**
   - [ ] Create bucket for cultural data
   - [ ] Upload knowledge files
   - [ ] Create bucket for web app
   - [ ] Upload web app files
   - [ ] Enable static website hosting

8. **Update Web App**
   - [ ] Change API_URL in web-app/app.js to API Gateway URL
   - [ ] Re-upload to S3

9. **Test Deployment**
   - [ ] Test each Lambda function
   - [ ] Test API endpoints
   - [ ] Test web app
   - [ ] Test all languages
   - [ ] Test voice input/output

10. **Monitor Costs**
    - [ ] Set up billing alerts
    - [ ] Monitor CloudWatch logs

---

## 🚀 Quick Deploy Commands

See `AWS_DEPLOYMENT_STEPS.md` for detailed step-by-step guide.

Quick summary:
```bash
# 1. Configure AWS
aws configure

# 2. Create IAM role
aws iam create-role --role-name tribal-lambda-role --assume-role-policy-document file://trust-policy.json

# 3. Deploy Lambda functions (repeat for all 5)
cd backend/lambda/language-detector
npm install --production
zip -r function.zip .
aws lambda create-function --function-name tribal-language-detector --runtime nodejs18.x --role YOUR_ROLE_ARN --handler index.handler --zip-file fileb://function.zip

# 4. Create DynamoDB tables
aws dynamodb create-table --table-name tribal-user-sessions --attribute-definitions AttributeName=userId,AttributeType=S --key-schema AttributeName=userId,KeyType=HASH --billing-mode PAY_PER_REQUEST

# 5. Upload to S3
aws s3 mb s3://tribal-data-YOUR_ACCOUNT_ID
aws s3 cp data/ s3://tribal-data-YOUR_ACCOUNT_ID/data/ --recursive

# 6. Deploy web app
aws s3 mb s3://tribal-web-YOUR_ACCOUNT_ID
aws s3 cp web-app/ s3://tribal-web-YOUR_ACCOUNT_ID/ --recursive
aws s3 website s3://tribal-web-YOUR_ACCOUNT_ID --index-document index.html
```

---

## 📊 Architecture Diagram

```
User (Web Browser)
    ↓
Web App (S3 Static Hosting)
    ↓
API Gateway (REST API)
    ↓
    ├─→ Lambda: language-detector → Bedrock
    ├─→ Lambda: cultural-assistant → Bedrock → DynamoDB
    ├─→ Lambda: text-to-speech → Polly
    ├─→ Lambda: voice-processor → Transcribe
    └─→ Lambda: news-aggregator → S3 → DynamoDB
```

---

## 🎯 Key Features for Hackathon Demo

1. **Multi-lingual**: 7 tribal languages + Hindi + English
2. **Voice-enabled**: Speak questions, hear answers
3. **Culturally relevant**: Community-specific content
4. **Comprehensive**: 10+ topic categories
5. **Offline-capable**: Works without internet
6. **Cost-effective**: $0.50-2 for entire demo
7. **Scalable**: Serverless architecture
8. **Accessible**: Simple web interface

---

## 📝 Demo Script

1. Open web app URL
2. Select language (e.g., Santali)
3. Type "scholarship" → Get answer in Santali
4. Click voice button → Say "health" → Get answer
5. Click speak button → Hear answer
6. Check news feed → See Santali community news
7. Switch to Gondi → News updates automatically
8. Type "latest news" → Get world news in Gondi
9. Type "election" → Get voting rights info
10. Show offline mode (disconnect internet, still works with cache)

---

## 🔗 Important Links

- AWS Console: https://console.aws.amazon.com
- Bedrock: https://console.aws.amazon.com/bedrock
- Lambda: https://console.aws.amazon.com/lambda
- S3: https://console.aws.amazon.com/s3
- DynamoDB: https://console.aws.amazon.com/dynamodb
- API Gateway: https://console.aws.amazon.com/apigateway

---

## 📞 Support

For deployment issues:
1. Check `AWS_DEPLOYMENT_STEPS.md` for detailed guide
2. Check `HACKATHON_COST_OPTIMIZATION.md` for cost tips
3. Check CloudWatch logs for errors
4. Verify IAM permissions
5. Ensure Bedrock models are enabled

---

## ✅ Ready to Deploy!

All features are working locally. Follow the deployment steps in `AWS_DEPLOYMENT_STEPS.md` to deploy to AWS.

Estimated deployment time: 45-60 minutes
Estimated cost: $0.50-2.00 for hackathon demo

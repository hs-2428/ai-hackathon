# 🏗️ Architecture Diagram - Tribal Language AI Assistant

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICES                             │
│  📱 Mobile Browser  💻 Desktop Browser  📲 Mobile App (Future)  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    WEB APPLICATION LAYER                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  web-app/index.html + app.js                             │  │
│  │  • Auto-detects local vs AWS                             │  │
│  │  • 7 language support                                    │  │
│  │  • Voice input/output                                    │  │
│  │  • Offline caching (localStorage)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
         Local Mode                   AWS Mode
                │                         │
                ▼                         ▼
┌──────────────────────────┐  ┌──────────────────────────────────┐
│   LOCAL MOCK SERVER      │  │   AMAZON API GATEWAY (REST)      │
│   localhost:3002         │  │   hlk4vx4dcg.execute-api...      │
│                          │  │                                  │
│   • /cultural-assistant  │  │   • /cultural-assistant (POST)   │
│   • /news (GET)          │  │   • /news (GET, POST)            │
│   • /detect-language     │  │   • /detect-language (POST)      │
│   • /text-to-speech      │  │   • /text-to-speech (POST)       │
│                          │  │   • /voice-processor (POST)      │
└──────────────────────────┘  └──────────────┬───────────────────┘
                                              │
                              ┌───────────────┼───────────────┐
                              │               │               │
                              ▼               ▼               ▼
                    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
                    │   Lambda     │ │   Lambda     │ │   Lambda     │
                    │  Cultural    │ │    News      │ │  Language    │
                    │  Assistant   │ │  Aggregator  │ │  Detector    │
                    │              │ │              │ │              │
                    │  • Quick     │ │  • Cache     │ │  • Bedrock   │
                    │    responses │ │  • S3 data   │ │    AI        │
                    │  • Bedrock   │ │  • Sample    │ │  • Pattern   │
                    │    AI        │ │    news      │ │    matching  │
                    │  • Fallbacks │ │  • Fallback  │ │              │
                    └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
                           │                │                │
                           └────────────────┼────────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
        ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
        │  AMAZON BEDROCK    │ │   AMAZON DYNAMODB  │ │    AMAZON S3       │
        │                    │ │                    │ │                    │
        │  Claude 3.5 Sonnet │ │  • Sessions Table  │ │  • Knowledge Base  │
        │  • AI Responses    │ │  • Interactions    │ │  • Cultural Data   │
        │  • Translation     │ │  • News Cache      │ │  • Sample News     │
        │  • Cultural        │ │  • TTL: 30 days    │ │  • Audio Files     │
        │    Context         │ │  • On-demand       │ │  • Lifecycle: 30d  │
        └────────────────────┘ └────────────────────┘ └────────────────────┘
                    │                      │                      │
                    └──────────────────────┼──────────────────────┘
                                           │
                                           ▼
                              ┌────────────────────────┐
                              │   AMAZON CLOUDWATCH    │
                              │   • Logs               │
                              │   • Metrics            │
                              │   • Monitoring         │
                              └────────────────────────┘
```

## 🔄 Request Flow Diagrams

### Flow 1: Cultural Assistant Query

```
User (Santali Speaker)
    │
    │ 1. Asks: "What scholarships are available?"
    │    Language: Santali
    ▼
Web App (app.js)
    │
    │ 2. Detects environment (AWS)
    │    Sends POST to /cultural-assistant
    │    Body: {query, language: "santali", userId, sessionId}
    ▼
API Gateway
    │
    │ 3. Routes to Lambda
    │    Adds request context
    ▼
Lambda: Cultural Assistant
    │
    ├─→ 4a. Check Quick Responses
    │       ├─ Match: "scholarship" → Return Santali response
    │       └─ No match → Continue to 4b
    │
    ├─→ 4b. Try S3 Knowledge Base
    │       ├─ Found → Use cultural context
    │       └─ Not found → Use defaults
    │
    ├─→ 4c. Query Bedrock AI
    │       │
    │       ▼
    │   Amazon Bedrock (Claude 3.5)
    │       │
    │       │ 5. Generate culturally-aware response
    │       │    System prompt: Tribal community context
    │       │    User query: Original question
    │       │    Language: Santali
    │       │
    │       └─→ AI Response in Santali
    │
    ├─→ 6. Log to DynamoDB
    │       Table: Interactions
    │       Data: {query, response, language, timestamp}
    │
    └─→ 7. Return Response
            {
              response: "संताली छात्रन खातिर...",
              answer: "संताली छात्रन खातिर...",
              language: "santali",
              sessionId: "...",
              source: "bedrock-ai"
            }
    │
    ▼
Web App
    │
    │ 8. Display response
    │    Enable "Speak" button
    │    Update UI
    ▼
User sees answer in Santali
```

### Flow 2: News Feed Loading

```
User
    │
    │ 1. Selects "Gondi" language
    ▼
Web App
    │
    │ 2. Calls loadNews()
    │    Tries POST first (AWS)
    │    Fallback to GET (local)
    ▼
API Gateway
    │
    │ 3. Routes to Lambda
    │    Method: POST or GET
    │    Params: {language: "gondi", limit: 10}
    ▼
Lambda: News Aggregator
    │
    ├─→ 4a. Check DynamoDB Cache
    │       │
    │       ├─ Cache Hit → Return cached news
    │       │              (Fast, no cost)
    │       │
    │       └─ Cache Miss → Continue to 4b
    │
    ├─→ 4b. Check S3 Bucket
    │       │
    │       ├─ File Found → Parse JSON
    │       │               Return news
    │       │
    │       └─ Not Found → Continue to 4c
    │
    ├─→ 4c. Use Sample News
    │       │
    │       └─→ Return hardcoded Gondi news
    │           (Always works, no dependencies)
    │
    └─→ 5. Return Response
            {
              articles: [...],
              news: [...],
              source: "cache|s3|sample",
              language: "gondi"
            }
    │
    ▼
Web App
    │
    │ 6. Render news items
    │    • Title in Gondi
    │    • Content in Gondi
    │    • Category & Date
    ▼
User sees Gondi news
```

### Flow 3: Voice Input/Output

```
User
    │
    │ 1. Clicks microphone button
    ▼
Web App (Web Speech API)
    │
    │ 2. Start speech recognition
    │    Language: Based on selected language
    │    recognition.lang = "hi-IN" (for Santali)
    ▼
Browser captures audio
    │
    │ 3. Transcribe to text
    │    (Browser's built-in STT)
    ▼
Web App
    │
    │ 4. Fill input field with transcript
    │    Auto-submit question
    ▼
[Follow Cultural Assistant Flow above]
    │
    ▼
Web App receives response
    │
    │ 5. User clicks "Speak" button
    ▼
Web App (Speech Synthesis API)
    │
    │ 6. Create utterance
    │    text: AI response
    │    lang: Selected language code
    │    rate: 0.9 (slightly slower)
    ▼
Browser speaks response
    │
    ▼
User hears answer in their language
```

## 🗄️ Data Models

### DynamoDB Tables

#### 1. Sessions Table
```
{
  userId: "user-123",           // Partition Key
  sessionId: "session-456",     // Sort Key
  timestamp: 1709856000000,
  language: "santali",
  queries: 5,
  lastActive: 1709856000000,
  ttl: 1712448000              // 30 days
}
```

#### 2. Interactions Table
```
{
  interactionId: "session-456-1709856000000",  // Partition Key
  userId: "user-123",
  sessionId: "session-456",
  timestamp: 1709856000000,
  query: "What scholarships are available?",
  response: "संताली छात्रन खातिर...",
  language: "santali",
  culturalContext: "tribal-education",
  source: "bedrock-ai",
  ttl: 1712448000              // 30 days
}
```

#### 3. News Cache Table
```
{
  newsId: "santali-news-1",    // Partition Key
  timestamp: 1709856000000,    // Sort Key
  language: "santali",
  title: "संताली छात्रों के लिए...",
  content: "झारखंड सरकार ने...",
  category: "शिक्षा",
  date: "2026-03-08",
  source: "government",
  ttl: 1709942400              // 24 hours
}

// Global Secondary Index: language-timestamp-index
// Partition Key: language
// Sort Key: timestamp
```

### S3 Bucket Structure

```
tribal-app-knowledge/
├── cultural-knowledge/
│   ├── santali/
│   │   └── knowledge.json
│   ├── gondi/
│   │   └── knowledge.json
│   ├── bhili/
│   │   └── knowledge.json
│   ├── kurukh/
│   │   └── knowledge.json
│   └── munda/
│       └── knowledge.json
│
├── sample-news/
│   ├── santali-news.json
│   ├── gondi-news.json
│   ├── bhili-news.json
│   ├── kurukh-news.json
│   └── munda-news.json
│
└── audio-output/
    └── session-456/
        ├── 1709856000000.mp3
        └── 1709856100000.mp3
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                       │
└─────────────────────────────────────────────────────────┘

Layer 1: Network Security
├─ HTTPS only (TLS 1.2+)
├─ API Gateway with throttling (100 req/sec)
└─ CloudFront CDN (future)

Layer 2: Authentication & Authorization
├─ IAM Roles for Lambda
│  ├─ Least privilege principle
│  ├─ Bedrock: InvokeModel only
│  ├─ DynamoDB: Read/Write specific tables
│  └─ S3: Read/Write specific buckets
│
└─ API Gateway
   ├─ CORS configured
   ├─ Request validation
   └─ Rate limiting

Layer 3: Data Security
├─ S3 Encryption at rest (AES-256)
├─ DynamoDB Encryption at rest
├─ CloudWatch Logs encrypted
└─ No PII stored

Layer 4: Application Security
├─ Input validation
├─ Output sanitization
├─ Error handling (no stack traces)
└─ Logging (no sensitive data)

Layer 5: Monitoring & Compliance
├─ CloudWatch Logs (all API calls)
├─ CloudWatch Metrics (performance)
├─ CloudWatch Alarms (errors, costs)
└─ AWS CloudTrail (audit trail)
```

## 💰 Cost Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    COST BREAKDOWN                        │
└─────────────────────────────────────────────────────────┘

Per Request Cost:
├─ API Gateway:      $0.0000035 per request
├─ Lambda:           $0.0000002 per request (128MB, 1s)
├─ Bedrock:          $0.0150000 per request (Claude 3.5)
├─ DynamoDB:         $0.0000013 per request (read/write)
└─ S3:               $0.0000004 per request (GET)
                     ─────────────────────────────
Total per request:   ~$0.0150054 ≈ $0.015

Monthly Fixed Costs:
├─ S3 Storage:       $0.023 per GB/month
│  └─ 1 GB data:     $0.023/month
├─ DynamoDB:         $0 (on-demand, pay per request)
├─ Lambda:           $0 (no idle cost)
└─ API Gateway:      $0 (no idle cost)
                     ─────────────────────────────
Total fixed:         ~$0.023/month

Usage Scenarios:
├─ 100 queries/day:  $1.50/day = $45/month + $0.023 = $45.02/month
├─ 500 queries/day:  $7.50/day = $225/month + $0.023 = $225.02/month
└─ 1000 queries/day: $15/day = $450/month + $0.023 = $450.02/month

Cost Optimization:
├─ Lambda concurrency: Limited to 10 (prevents runaway costs)
├─ API throttling: 100 req/sec (prevents abuse)
├─ DynamoDB TTL: 30 days (auto-cleanup)
├─ S3 Lifecycle: 30 days (auto-delete old audio)
└─ Caching: DynamoDB cache reduces Bedrock calls
```

## 📊 Performance Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 PERFORMANCE METRICS                      │
└─────────────────────────────────────────────────────────┘

Response Times:
├─ Quick Response (cached):     < 100ms
│  └─ Lambda + DynamoDB
│
├─ S3 Response:                 < 500ms
│  └─ Lambda + S3 GET
│
├─ Bedrock AI Response:         1-3 seconds
│  └─ Lambda + Bedrock + DynamoDB
│
└─ Voice Processing:            2-5 seconds
   └─ Lambda + Transcribe + Bedrock + Polly

Throughput:
├─ API Gateway:                 10,000 req/sec (max)
├─ Lambda (concurrent):         10 (configured limit)
├─ DynamoDB:                    Unlimited (on-demand)
└─ Bedrock:                     Limited by quota

Caching Strategy:
├─ Browser Cache:               LocalStorage (offline)
├─ DynamoDB Cache:              24 hours (news)
├─ S3 Cache:                    Static (knowledge base)
└─ CDN Cache (future):          CloudFront

Optimization:
├─ Lambda warm start:           < 100ms
├─ Lambda cold start:           1-2 seconds
├─ Connection pooling:          Reuse AWS SDK clients
└─ Batch operations:            DynamoDB batch writes
```

## 🌐 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 DEPLOYMENT PIPELINE                      │
└─────────────────────────────────────────────────────────┘

Development:
├─ Local Testing
│  ├─ node local-server/server.js
│  ├─ http://localhost:3002
│  └─ Mock data, no AWS costs
│
└─ Local AWS Testing
   ├─ AWS CLI configured
   ├─ CDK synth (validate)
   └─ CDK diff (preview changes)

Staging (AWS):
├─ CDK Bootstrap (one-time)
│  └─ cdk bootstrap
│
├─ CDK Deploy
│  ├─ cdk deploy
│  ├─ Creates CloudFormation stack
│  ├─ Provisions all resources
│  └─ Outputs API endpoint
│
└─ Upload Data
   ├─ Cultural knowledge → S3
   └─ Sample news → S3

Production:
├─ GitHub Pages
│  ├─ Static web app
│  ├─ Auto-detects AWS endpoint
│  └─ https://hs-2428.github.io/...
│
└─ AWS Services
   ├─ API Gateway (entry point)
   ├─ Lambda (compute)
   ├─ Bedrock (AI)
   ├─ DynamoDB (data)
   └─ S3 (storage)

Monitoring:
├─ CloudWatch Logs
│  ├─ Lambda execution logs
│  ├─ API Gateway access logs
│  └─ Error tracking
│
├─ CloudWatch Metrics
│  ├─ Request count
│  ├─ Error rate
│  ├─ Latency
│  └─ Cost
│
└─ CloudWatch Alarms
   ├─ Error rate > 5%
   ├─ Latency > 5s
   └─ Cost > $100/day
```

## 🔄 Offline Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  OFFLINE CAPABILITY                      │
└─────────────────────────────────────────────────────────┘

Current Implementation:
├─ LocalStorage Cache
│  ├─ Recent queries & responses
│  ├─ News articles
│  ├─ User preferences
│  └─ Language selection
│
└─ Fallback Responses
   ├─ Hardcoded cultural knowledge
   ├─ Sample news data
   └─ Basic functionality

Future Enhancement (AWS IoT Greengrass):
├─ Edge Device
│  ├─ Raspberry Pi / Android device
│  ├─ Local Lambda functions
│  ├─ Local DynamoDB
│  └─ Local S3 cache
│
├─ Sync Strategy
│  ├─ Periodic sync when online
│  ├─ Delta sync (only changes)
│  └─ Conflict resolution
│
└─ Offline Features
   ├─ Full AI responses (local model)
   ├─ Voice processing (local STT/TTS)
   ├─ News cache (7 days)
   └─ Cultural knowledge (full copy)
```

---

**This architecture supports 104 million tribal people across India! 🇮🇳**

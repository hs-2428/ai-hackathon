# System Architecture - Tribal Language Accessibility Platform

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Mobile Application                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Voice      │  │   Language   │  │     News     │          │
│  │  Assistant   │  │   Selector   │  │     Feed     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │           Offline Manager (SQLite)                │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS API Gateway                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ /cultural│ │ /detect- │ │  /voice- │ │  /news   │          │
│  │-assistant│ │ language │ │ processor│ │          │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS Lambda Functions                        │
│  ┌──────────────────────────────────────────────────┐          │
│  │  Cultural Assistant Lambda                        │          │
│  │  • Bedrock Claude 3.5 Sonnet integration         │          │
│  │  • Cultural context reasoning                     │          │
│  │  • Government scheme mapping                      │          │
│  └──────────────────────────────────────────────────┘          │
│  ┌──────────────────────────────────────────────────┐          │
│  │  Language Detector Lambda                         │          │
│  │  • Bedrock-powered detection                      │          │
│  │  • Multi-script support                           │          │
│  └──────────────────────────────────────────────────┘          │
│  ┌──────────────────────────────────────────────────┐          │
│  │  Voice Processor Lambda                           │          │
│  │  • Amazon Transcribe integration                  │          │
│  │  • Custom vocabulary support                      │          │
│  └──────────────────────────────────────────────────┘          │
│  ┌──────────────────────────────────────────────────┐          │
│  │  Text-to-Speech Lambda                            │          │
│  │  • Amazon Polly neural voices                     │          │
│  │  • Multi-language support                         │          │
│  └──────────────────────────────────────────────────┘          │
│  ┌──────────────────────────────────────────────────┐          │
│  │  News Aggregator Lambda                           │          │
│  │  • Cultural adaptation                            │          │
│  │  • Scheme mapping                                 │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS Services Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Amazon     │  │   Amazon     │  │   Amazon     │          │
│  │   Bedrock    │  │  Transcribe  │  │    Polly     │          │
│  │              │  │              │  │              │          │
│  │ • Claude 3.5 │  │ • Custom     │  │ • Neural TTS │          │
│  │ • Titan Text │  │   Vocabulary │  │ • Indian     │          │
│  │ • Embeddings │  │ • Tribal     │  │   Voices     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Storage Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  DynamoDB    │  │  Amazon S3   │  │  Amazon S3   │          │
│  │              │  │              │  │              │          │
│  │ • Sessions   │  │ • Audio      │  │ • Cultural   │          │
│  │ • Interactions│ │   Files      │  │   Knowledge  │          │
│  │ • News Cache │  │ • TTS Output │  │ • News Data  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Edge Computing (Optional)                      │
│  ┌──────────────────────────────────────────────────┐          │
│  │         AWS IoT Greengrass                        │          │
│  │  • Offline AI Assistant                           │          │
│  │  • Local SQLite cache                             │          │
│  │  • Cultural knowledge base                        │          │
│  │  • Sync with cloud when online                    │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

### 1. Voice Query Processing

```
User Voice Input
    │
    ▼
Mobile App (React Native Voice)
    │
    ▼
Base64 Encode Audio
    │
    ▼
API Gateway: POST /voice-processor
    │
    ▼
Voice Processor Lambda
    │
    ├─► Upload to S3 (audio-input/)
    │
    └─► Amazon Transcribe
            │
            ▼
        Transcription Result
            │
            ▼
    Store in DynamoDB (sessions)
```

### 2. Language Detection & Cultural Response

```
Transcribed Text
    │
    ▼
API Gateway: POST /detect-language
    │
    ▼
Language Detector Lambda
    │
    └─► Amazon Bedrock (Claude)
            │
            ▼
        Language + Confidence
            │
            ▼
API Gateway: POST /cultural-assistant
    │
    ▼
Cultural Assistant Lambda
    │
    ├─► Fetch from S3 (cultural-kb/)
    │
    ├─► Query DynamoDB (user history)
    │
    └─► Amazon Bedrock (Claude 3.5)
            │
            ▼
        Culturally-Adapted Response
            │
            ▼
    Store in DynamoDB (interactions)
```

### 3. Text-to-Speech Generation

```
Response Text
    │
    ▼
API Gateway: POST /text-to-speech
    │
    ▼
Text-to-Speech Lambda
    │
    └─► Amazon Polly (Neural)
            │
            ▼
        Audio Stream
            │
            ├─► Upload to S3 (audio-output/)
            │
            └─► Generate Presigned URL
                    │
                    ▼
                Return to Mobile App
                    │
                    ▼
                Play Audio
```

### 4. News Feed Flow

```
User Opens News Feed
    │
    ▼
API Gateway: POST /news
    │
    ▼
News Aggregator Lambda
    │
    ├─► Check DynamoDB Cache
    │   │
    │   └─► If cached: Return immediately
    │
    └─► If not cached:
            │
            ├─► Fetch from S3 (news-feed/)
            │
            └─► Amazon Bedrock (Claude)
                    │
                    ▼
                Translate & Adapt
                    │
                    ├─► Cache in DynamoDB
                    │
                    └─► Return to Mobile App
```

### 5. Offline Mode Flow

```
User Query (No Internet)
    │
    ▼
Offline Manager (Mobile)
    │
    ├─► Query SQLite Cache
    │   │
    │   └─► If found: Return cached response
    │
    └─► If not found:
            │
            └─► Query Cultural Knowledge Base
                    │
                    ├─► Pattern matching
                    │
                    └─► Generate local response
                            │
                            ▼
                        Local TTS (Expo Speech)
                            │
                            ▼
                        Play Audio
```

## Data Models

### DynamoDB Tables

#### Sessions Table
```json
{
  "userId": "string (partition key)",
  "sessionId": "string (sort key)",
  "timestamp": "number",
  "audioKey": "string",
  "transcriptionJobName": "string",
  "status": "string",
  "ttl": "number"
}
```

#### Interactions Table
```json
{
  "interactionId": "string (partition key)",
  "userId": "string",
  "sessionId": "string",
  "timestamp": "number",
  "query": "string",
  "response": "string",
  "language": "string",
  "culturalContext": "string",
  "ttl": "number"
}
```

#### News Table
```json
{
  "newsId": "string (partition key)",
  "timestamp": "number (sort key)",
  "language": "string (GSI partition key)",
  "title": "string",
  "content": "string",
  "adapted": {
    "translatedTitle": "string",
    "simplifiedContent": "string",
    "culturalRelevance": "string",
    "relatedSchemes": "string"
  },
  "ttl": "number"
}
```

### S3 Bucket Structure

```
tribal-app-audio/
├── audio-input/
│   └── {userId}/
│       └── {sessionId}/
│           └── {timestamp}.wav
├── audio-output/
│   └── {sessionId}/
│       └── {timestamp}.mp3
└── vocabulary/
    └── tribal-vocab.txt

tribal-app-knowledge/
└── cultural-kb/
    ├── santali/
    │   └── knowledge.json
    ├── gondi/
    │   └── knowledge.json
    └── {language}/
        └── knowledge.json

tribal-app-news/
└── news-feed/
    ├── santali/
    │   └── latest.json
    └── {language}/
        └── latest.json
```

### SQLite Schema (Mobile - Offline)

```sql
-- Cached responses
CREATE TABLE cached_responses (
    id INTEGER PRIMARY KEY,
    query TEXT,
    response TEXT,
    language TEXT,
    timestamp INTEGER
);

-- Cached news
CREATE TABLE cached_news (
    id INTEGER PRIMARY KEY,
    language TEXT,
    title TEXT,
    content TEXT,
    adapted_data TEXT,
    timestamp INTEGER
);

-- Cultural knowledge
CREATE TABLE cultural_knowledge (
    id INTEGER PRIMARY KEY,
    language TEXT,
    topic TEXT,
    content TEXT,
    keywords TEXT
);
```

## Security Architecture

### IAM Roles & Permissions

```
Lambda Execution Role:
├── Bedrock: InvokeModel
├── Polly: SynthesizeSpeech
├── Transcribe: StartTranscriptionJob, GetTranscriptionJob
├── S3: GetObject, PutObject (specific buckets)
├── DynamoDB: Query, PutItem, GetItem (specific tables)
└── CloudWatch: CreateLogGroup, CreateLogStream, PutLogEvents
```

### API Security (Future Enhancement)

```
API Gateway
├── AWS IAM Authorization
├── API Keys for mobile apps
├── Rate limiting (1000 req/min per user)
├── CORS configuration
└── Request validation
```

## Scalability Considerations

### Current Capacity
- Lambda: 1000 concurrent executions
- DynamoDB: On-demand (auto-scaling)
- S3: Unlimited storage
- API Gateway: 10,000 req/sec

### Optimization Strategies
1. **Caching**: DynamoDB TTL for automatic cleanup
2. **Batching**: Process multiple requests together
3. **CDN**: CloudFront for static assets
4. **Edge**: Greengrass for offline areas
5. **Compression**: Gzip for API responses

## Monitoring & Observability

### CloudWatch Metrics
- Lambda invocations, errors, duration
- DynamoDB read/write capacity
- S3 request metrics
- API Gateway 4xx/5xx errors

### CloudWatch Logs
- Lambda function logs
- API Gateway access logs
- Application logs from mobile app

### X-Ray Tracing
- End-to-end request tracing
- Performance bottleneck identification
- Service map visualization

## Disaster Recovery

### Backup Strategy
- DynamoDB: Point-in-time recovery enabled
- S3: Versioning enabled
- Lambda: Code stored in version control

### Recovery Objectives
- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 5 minutes

---

**Architecture Version**: 1.0
**Last Updated**: March 2026

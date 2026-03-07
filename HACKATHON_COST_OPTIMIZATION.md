# 🏆 Hackathon Cost Optimization Guide

## 💰 Keep AWS Costs Under $5 for Entire Hackathon

### Phase 1: Development & Testing (Cost: $0)

**Use Local Testing Only**
```bash
# Test everything locally - NO AWS costs
test-local.bat  # or ./test-local.sh
```

**Benefits:**
- ✅ Unlimited testing
- ✅ Zero AWS costs
- ✅ Faster iteration
- ✅ No internet required

---

### Phase 2: Deploy for Demo (Cost: $2-5)

**Deploy 24 Hours Before Presentation**

```bash
# Deploy infrastructure
cd infrastructure
cdk deploy

# Takes 10 minutes
```

**Why Wait?**
- No idle costs during development
- Fresh deployment = no stale data
- Bedrock costs only during demo

---

### Phase 3: Demo Day Strategy

#### Before Your Presentation (30 min before)

1. **Pre-load Cache**
```bash
# Upload sample data to reduce live API calls
aws s3 sync data/sample-news/ s3://tribal-app-news/news-feed/santali/
```

2. **Test One Complete Flow**
- One voice query
- One news fetch
- Verify everything works

**Cost:** ~$0.10

#### During Presentation (15 minutes)

**Recommended Demo Flow:**
1. Show mobile app (2 min)
2. Voice query in Santali (1 min) - **$0.02**
3. Show cultural response (1 min)
4. Display news feed (cached) (1 min) - **$0.00**
5. Show offline mode (2 min) - **$0.00**
6. Architecture diagram (3 min)
7. Code walkthrough (5 min)

**Total Demo Cost:** ~$0.02

#### After Presentation

**Option A: Keep Running (for judges to test)**
- Cost: ~$0.50/day
- Keep for 2-3 days max

**Option B: Destroy Immediately**
```bash
cd infrastructure
cdk destroy
```
- Cost: $0 after destruction

---

## 🎯 Cost Optimization Techniques

### 1. Use Cached Responses (90% cost reduction)

**Already Implemented:**
```javascript
// Check cache first
const cached = await dynamodb.query({
  TableName: process.env.NEWS_TABLE,
  // ... returns cached data
});

if (cached.Items.length > 0) {
  return cached.Items;  // No Bedrock call = $0
}
```

### 2. Limit Bedrock Token Usage

**Current Settings:**
```javascript
max_tokens: 2000  // Reasonable limit
```

**Cost per request:** ~$0.015

**Optimization:**
```javascript
max_tokens: 500   // For demo, shorter responses
```

**New cost:** ~$0.004 (73% savings)

### 3. Pre-generate Demo Content

**Strategy:**
```bash
# Before demo, generate 10 sample responses
# Store in DynamoDB
# Demo uses cached responses = $0
```

**Implementation:**
```javascript
// Pre-populate cache
const sampleQueries = [
  'What scholarships are available?',
  'How do I get health insurance?',
  'Tell me about farming schemes'
];

for (const query of sampleQueries) {
  // Generate and cache responses
  await generateAndCache(query, 'santali');
}
```

**Demo Cost:** $0.15 (one-time)  
**Live Demo Cost:** $0.00 (uses cache)

### 4. Use Smaller Lambda Memory

**Current:** 512 MB  
**Optimized for Demo:** 256 MB

```javascript
memorySize: 256  // 50% cost reduction
```

**Savings:** $0.10/day → $0.05/day

### 5. Reduce DynamoDB Writes

**Strategy:**
- Only log essential interactions
- Skip logging during demo
- Use in-memory cache

```javascript
// Add flag to skip logging
if (!process.env.DEMO_MODE) {
  await dynamodb.put({...});  // Skip in demo
}
```

---

## 📊 Cost Comparison

### Without Optimization
```
Development (7 days):     $50
Demo Day:                 $5
Post-Demo (3 days):       $15
TOTAL:                    $70
```

### With Optimization (This Project)
```
Development (local):      $0
Deploy (1 day before):    $0.50
Demo Day:                 $0.02
Post-Demo (keep 2 days):  $1.00
Destroy after:            $0
TOTAL:                    $1.52 ✅
```

**Savings: 98%** 🎉

---

## 🎬 Complete Hackathon Timeline

### Week 1-2: Development
```bash
# Work locally - $0 cost
test-local.bat
# Iterate, test, refine
```

### Day Before Demo
```bash
# 6 PM: Deploy to AWS
cd infrastructure
cdk deploy

# 7 PM: Upload sample data
aws s3 sync data/ s3://buckets/

# 8 PM: Test end-to-end
./tests/test-api.sh

# 9 PM: Pre-generate cache
node scripts/populate-cache.js
```

**Cost:** $0.50

### Demo Day
```bash
# Morning: Verify everything works
curl $API_URL/health

# During Demo: 
# - Show live voice query (1-2 times)
# - Rest uses cached data
# - Emphasize offline mode
```

**Cost:** $0.02

### After Demo
```bash
# Option 1: Keep for judges (2 days)
# Cost: $1.00

# Option 2: Destroy immediately
cdk destroy
# Cost: $0
```

---

## 🛡️ Cost Protection Measures

### 1. Set Billing Alerts

```bash
# AWS Console → Billing → Budgets
# Create budget: $10/month
# Alert at: $5 (50%)
```

### 2. Lambda Concurrency Limits

**Already Set:**
```javascript
reservedConcurrentExecutions: 10  // Max 10 parallel
```

**Protection:** Prevents runaway costs from attacks

### 3. API Gateway Throttling

**Add to CDK:**
```javascript
api.root.addMethod('ANY', integration, {
  throttle: {
    rateLimit: 100,    // 100 req/sec
    burstLimit: 200    // 200 burst
  }
});
```

### 4. DynamoDB Auto-Scaling Limits

**Already On-Demand:** No runaway costs possible

### 5. S3 Bucket Quotas

```javascript
// Add to CDK
new s3.BucketPolicy(this, 'Policy', {
  bucket: audioBucket,
  // Limit uploads to 1GB/day
});
```

---

## 💡 Free Alternatives for Hackathon

### If You Want $0 Cost

**Option 1: Use AWS Free Tier Only**
- Lambda: 1M requests FREE
- DynamoDB: 25GB FREE
- S3: 5GB FREE
- API Gateway: 1M requests FREE

**Only Pay For:**
- Bedrock (no free tier)

**Workaround:**
```javascript
// Use mock responses for demo
if (process.env.DEMO_MODE === 'true') {
  return MOCK_RESPONSES[query];  // $0 cost
}
```

**Option 2: Local Demo Only**
```bash
# Run everything locally
# Use mock Bedrock
# Show architecture diagrams
# Explain how it would work on AWS
```

**Cost:** $0

---

## 📱 Cross-Platform Mobile App (Already Done!)

### React Native = Cross-Platform ✅

**One Codebase → 3 Platforms:**
- ✅ Android
- ✅ iOS  
- ✅ Web

**No Extra Cost!**

### Build for Demo

**Android APK (Free):**
```bash
cd mobile-app
expo build:android
# Download APK
# Install on any Android device
```

**iOS (Requires Mac):**
```bash
expo build:ios
# Or use Expo Go app (free)
```

**Web (Free):**
```bash
expo build:web
# Deploy to Netlify/Vercel (free)
```

---

## 🎯 Recommended Hackathon Strategy

### Minimal Cost Approach ($1-2 total)

**Week 1-2:**
- ✅ Develop locally
- ✅ Test with mocks
- ✅ Perfect your pitch

**Day Before Demo:**
- ✅ Deploy to AWS (evening)
- ✅ Test once ($0.10)
- ✅ Pre-generate cache ($0.15)

**Demo Day:**
- ✅ Show 1-2 live queries ($0.02)
- ✅ Rest uses cache ($0)
- ✅ Emphasize architecture

**After Demo:**
- ✅ Keep 1 day for judges ($0.50)
- ✅ Destroy after results

**TOTAL: $0.77** 🎉

---

## 🚨 Common Cost Mistakes to Avoid

### ❌ DON'T:
1. Deploy during development (use local testing)
2. Leave resources running after hackathon
3. Use large Lambda memory (512MB is enough)
4. Make unnecessary Bedrock calls (use cache)
5. Store large files in S3 (use lifecycle policies)
6. Forget to set billing alerts
7. Use provisioned DynamoDB (use on-demand)

### ✅ DO:
1. Test locally first
2. Deploy 24 hours before demo
3. Use caching aggressively
4. Set billing alerts ($5 threshold)
5. Destroy resources after hackathon
6. Use free tier services
7. Monitor costs daily

---

## 📊 Real Cost Examples

### Example 1: Full Development + Demo
```
Local Development (14 days):        $0.00
Deploy for testing (1 day):         $0.50
Demo Day (2 hours):                 $0.02
Keep for judges (2 days):           $1.00
Destroy after:                      $0.00
────────────────────────────────────────
TOTAL:                              $1.52
```

### Example 2: Minimal Demo
```
Local Development (14 days):        $0.00
Deploy morning of demo:             $0.25
Demo (1 hour):                      $0.02
Destroy immediately:                $0.00
────────────────────────────────────────
TOTAL:                              $0.27
```

### Example 3: Extended Testing
```
Local Development (7 days):         $0.00
Deploy for testing (7 days):        $3.50
Demo Day:                           $0.02
Keep for judges (3 days):           $1.50
Destroy after:                      $0.00
────────────────────────────────────────
TOTAL:                              $5.02
```

---

## 🎓 Hackathon Presentation Tips

### Emphasize Cost Efficiency

**In Your Pitch:**
- "Fully serverless architecture"
- "Pay only for what you use"
- "Scales from 0 to millions"
- "No infrastructure management"
- "Cost: $0.02 per user interaction"

### Show Cost Breakdown Slide

```
┌─────────────────────────────────────┐
│   Cost per 1000 Users               │
├─────────────────────────────────────┤
│   Lambda:           $0.20           │
│   Bedrock:          $15.00          │
│   DynamoDB:         $0.50           │
│   S3:               $0.10           │
│   API Gateway:      $0.35           │
│   Polly:            $2.00           │
│   Transcribe:       $2.40           │
├─────────────────────────────────────┤
│   TOTAL:            $20.55          │
│   Per User:         $0.02           │
└─────────────────────────────────────┘
```

---

## 🎯 Final Checklist

### Before Deploying
- [ ] Test everything locally
- [ ] Set AWS billing alert ($5)
- [ ] Review CDK stack
- [ ] Prepare demo data
- [ ] Practice demo flow

### During Hackathon
- [ ] Deploy 24h before demo
- [ ] Test once
- [ ] Pre-generate cache
- [ ] Monitor costs daily
- [ ] Keep demo under 2 live queries

### After Hackathon
- [ ] Download demo video
- [ ] Export data if needed
- [ ] Destroy AWS resources
- [ ] Verify $0 ongoing costs
- [ ] Update GitHub with results

---

## 💰 Bottom Line

**Your Project:**
- ✅ 100% Serverless
- ✅ Optimized for minimal cost
- ✅ Free tier maximized
- ✅ Auto-scaling
- ✅ No idle costs
- ✅ Cross-platform mobile app

**Hackathon Cost:** $1-2 total  
**Production Cost:** $20-50/month for 1000 users  
**Scalability:** Millions of users (auto-scales)

**You're already optimized!** 🎉


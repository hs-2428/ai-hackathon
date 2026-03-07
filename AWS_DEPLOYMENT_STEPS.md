# AWS Deployment Steps - Zero/Minimal Cost Testing

## Prerequisites
- AWS Account with Free Tier
- AWS CLI installed and configured
- Node.js installed locally

## Cost Estimate
- **Testing Phase**: $0-2 (stays within free tier)
- **Hackathon Demo**: $1-3 total
- **Production (1000 users/month)**: $20-50/month

---

## Step 1: Setup AWS CLI (5 minutes)

```bash
# Install AWS CLI (if not installed)
# Download from: https://aws.amazon.com/cli/

# Configure with your credentials
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: us-east-1
# - Default output format: json
```

---

## Step 2: Enable Bedrock Models (2 minutes)

1. Go to AWS Console → Amazon Bedrock
2. Click "Model access" in left sidebar
3. Click "Enable specific models"
4. Enable these models (all FREE TIER eligible):
   - ✅ Claude 3.5 Sonnet
   - ✅ Amazon Titan Text Express
   - ✅ Amazon Titan Embeddings
5. Click "Save changes"
6. Wait 2-3 minutes for approval (usually instant)

**Cost**: First 2 months FREE, then ~$0.003 per 1000 tokens

---

## Step 3: Deploy Lambda Functions (10 minutes)

```bash
# Navigate to project root
cd D:\Users\aishwaryaD\ai-hackathon(1)

# Deploy each Lambda function
cd backend/lambda/language-detector
npm install
zip -r function.zip .
aws lambda create-function \
  --function-name tribal-language-detector \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 256

# Repeat for other functions:
# - cultural-assistant
# - text-to-speech
# - voice-processor
# - news-aggregator
```

**Cost**: 1M requests/month FREE, then $0.20 per 1M requests

---

## Step 4: Create IAM Role for Lambda (3 minutes)

```bash
# Create trust policy file
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

# Create role
aws iam create-role \
  --role-name lambda-execution-role \
  --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
  --role-name lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess

aws iam attach-role-policy \
  --role-name lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

aws iam attach-role-policy \
  --role-name lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonPollyFullAccess

aws iam attach-role-policy \
  --role-name lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonTranscribeFullAccess
```

**Cost**: FREE

---

## Step 5: Setup API Gateway (5 minutes)

```bash
# Create REST API
aws apigateway create-rest-api \
  --name tribal-assistant-api \
  --description "Tribal Language Assistant API"

# Get API ID (save this)
API_ID=$(aws apigateway get-rest-apis --query "items[?name=='tribal-assistant-api'].id" --output text)

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[0].id" --output text)

# Create resources and methods for each endpoint
# /detect-language
aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_ID \
  --path-part detect-language

# Continue for other endpoints...
# /cultural-assistant
# /text-to-speech
# /news
```

**Cost**: 1M requests/month FREE, then $3.50 per 1M requests

---

## Step 6: Create DynamoDB Tables (2 minutes)

```bash
# User sessions table
aws dynamodb create-table \
  --table-name tribal-user-sessions \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=timestamp,AttributeType=N \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# Cultural knowledge cache
aws dynamodb create-table \
  --table-name tribal-cultural-cache \
  --attribute-definitions \
    AttributeName=language,AttributeType=S \
    AttributeName=topic,AttributeType=S \
  --key-schema \
    AttributeName=language,KeyType=HASH \
    AttributeName=topic,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

**Cost**: 25GB storage FREE, 25 read/write units FREE

---

## Step 7: Upload Cultural Data to S3 (3 minutes)

```bash
# Create S3 bucket
aws s3 mb s3://tribal-cultural-data-YOUR_ACCOUNT_ID

# Upload cultural knowledge
aws s3 cp data/cultural-knowledge/ s3://tribal-cultural-data-YOUR_ACCOUNT_ID/cultural-knowledge/ --recursive

# Upload sample news
aws s3 cp data/sample-news/ s3://tribal-cultural-data-YOUR_ACCOUNT_ID/sample-news/ --recursive

# Set bucket policy for Lambda access
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::tribal-cultural-data-YOUR_ACCOUNT_ID/*"
  }]
}
EOF

aws s3api put-bucket-policy \
  --bucket tribal-cultural-data-YOUR_ACCOUNT_ID \
  --policy file://bucket-policy.json
```

**Cost**: 5GB storage FREE, 20,000 GET requests FREE

---

## Step 8: Deploy Web App to S3 (5 minutes)

```bash
# Create bucket for web hosting
aws s3 mb s3://tribal-assistant-web-YOUR_ACCOUNT_ID

# Enable static website hosting
aws s3 website s3://tribal-assistant-web-YOUR_ACCOUNT_ID \
  --index-document index.html

# Update API URL in web-app/app.js
# Change: const API_URL = 'http://localhost:3002';
# To: const API_URL = 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod';

# Upload web app
aws s3 cp web-app/ s3://tribal-assistant-web-YOUR_ACCOUNT_ID/ --recursive

# Make bucket public
aws s3api put-bucket-policy \
  --bucket tribal-assistant-web-YOUR_ACCOUNT_ID \
  --policy '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::tribal-assistant-web-YOUR_ACCOUNT_ID/*"
    }]
  }'

# Get website URL
echo "Website URL: http://tribal-assistant-web-YOUR_ACCOUNT_ID.s3-website-us-east-1.amazonaws.com"
```

**Cost**: FREE (within 5GB limit)

---

## Step 9: Test Your Deployment (5 minutes)

### Test Lambda Functions Directly

```bash
# Test language detector
aws lambda invoke \
  --function-name tribal-language-detector \
  --payload '{"text":"Hello, how are you?"}' \
  response.json

cat response.json
```

### Test API Gateway

```bash
# Get your API endpoint
API_ENDPOINT="https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod"

# Test detect-language
curl -X POST $API_ENDPOINT/detect-language \
  -H "Content-Type: application/json" \
  -d '{"text":"Namaste"}'

# Test cultural-assistant
curl -X POST $API_ENDPOINT/cultural-assistant \
  -H "Content-Type: application/json" \
  -d '{"question":"What is Sarhul festival?","language":"santali"}'

# Test news
curl $API_ENDPOINT/news?language=santali
```

### Test Web App

1. Open: `http://tribal-assistant-web-YOUR_ACCOUNT_ID.s3-website-us-east-1.amazonaws.com`
2. Select language (Santali/Gondi)
3. Type a question and click "Ask"
4. Check news feed loads
5. Try voice input (if browser supports)

---

## Step 10: Monitor Costs (Ongoing)

```bash
# Check current month costs
aws ce get-cost-and-usage \
  --time-period Start=2026-03-01,End=2026-03-08 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=SERVICE

# Set up billing alert
aws cloudwatch put-metric-alarm \
  --alarm-name billing-alert \
  --alarm-description "Alert when bill exceeds $5" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 21600 \
  --evaluation-periods 1 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold
```

---

## Quick Deploy Script (All-in-One)

Save this as `deploy-to-aws.sh`:

```bash
#!/bin/bash

# Configuration
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
PROJECT_NAME="tribal-assistant"

echo "Deploying to AWS Account: $ACCOUNT_ID"
echo "Region: $REGION"

# 1. Create IAM Role
echo "Creating IAM role..."
aws iam create-role --role-name ${PROJECT_NAME}-lambda-role \
  --assume-role-policy-document file://trust-policy.json 2>/dev/null

# 2. Attach policies
echo "Attaching policies..."
aws iam attach-role-policy --role-name ${PROJECT_NAME}-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam attach-role-policy --role-name ${PROJECT_NAME}-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess
aws iam attach-role-policy --role-name ${PROJECT_NAME}-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

# 3. Create DynamoDB tables
echo "Creating DynamoDB tables..."
aws dynamodb create-table --table-name ${PROJECT_NAME}-sessions \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST 2>/dev/null

# 4. Create S3 buckets
echo "Creating S3 buckets..."
aws s3 mb s3://${PROJECT_NAME}-data-${ACCOUNT_ID} 2>/dev/null
aws s3 mb s3://${PROJECT_NAME}-web-${ACCOUNT_ID} 2>/dev/null

# 5. Upload data
echo "Uploading cultural data..."
aws s3 cp data/ s3://${PROJECT_NAME}-data-${ACCOUNT_ID}/data/ --recursive

# 6. Deploy Lambda functions
echo "Deploying Lambda functions..."
for func in language-detector cultural-assistant text-to-speech voice-processor news-aggregator; do
  echo "Deploying $func..."
  cd backend/lambda/$func
  npm install --production
  zip -r function.zip . -x "*.git*" "node_modules/.cache/*"
  aws lambda create-function \
    --function-name ${PROJECT_NAME}-${func} \
    --runtime nodejs18.x \
    --role arn:aws:iam::${ACCOUNT_ID}:role/${PROJECT_NAME}-lambda-role \
    --handler index.handler \
    --zip-file fileb://function.zip \
    --timeout 30 \
    --memory-size 256 2>/dev/null || \
  aws lambda update-function-code \
    --function-name ${PROJECT_NAME}-${func} \
    --zip-file fileb://function.zip
  cd ../../..
done

# 7. Deploy web app
echo "Deploying web app..."
aws s3 cp web-app/ s3://${PROJECT_NAME}-web-${ACCOUNT_ID}/ --recursive
aws s3 website s3://${PROJECT_NAME}-web-${ACCOUNT_ID} --index-document index.html

echo "✅ Deployment complete!"
echo "Web App URL: http://${PROJECT_NAME}-web-${ACCOUNT_ID}.s3-website-${REGION}.amazonaws.com"
```

Run with: `bash deploy-to-aws.sh`

---

## Cost Breakdown Summary

| Service | Free Tier | After Free Tier | Hackathon Cost |
|---------|-----------|-----------------|----------------|
| Lambda | 1M requests/month | $0.20/1M requests | $0.00 |
| API Gateway | 1M requests/month | $3.50/1M requests | $0.00 |
| Bedrock | 2 months free | $0.003/1K tokens | $0.50 |
| DynamoDB | 25GB + 25 units | $0.25/GB | $0.00 |
| S3 | 5GB + 20K requests | $0.023/GB | $0.00 |
| Polly | 5M chars/month | $4/1M chars | $0.00 |
| Transcribe | 60 min/month | $0.024/min | $0.00 |
| **TOTAL** | | | **$0.50-2.00** |

---

## Cleanup (After Hackathon)

```bash
# Delete Lambda functions
aws lambda delete-function --function-name tribal-assistant-language-detector
aws lambda delete-function --function-name tribal-assistant-cultural-assistant
aws lambda delete-function --function-name tribal-assistant-text-to-speech
aws lambda delete-function --function-name tribal-assistant-voice-processor
aws lambda delete-function --function-name tribal-assistant-news-aggregator

# Delete DynamoDB tables
aws dynamodb delete-table --table-name tribal-user-sessions
aws dynamodb delete-table --table-name tribal-cultural-cache

# Delete S3 buckets
aws s3 rb s3://tribal-cultural-data-YOUR_ACCOUNT_ID --force
aws s3 rb s3://tribal-assistant-web-YOUR_ACCOUNT_ID --force

# Delete IAM role
aws iam detach-role-policy --role-name lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam delete-role --role-name lambda-execution-role
```

---

## Troubleshooting

### Issue: Lambda timeout
**Solution**: Increase timeout to 60 seconds
```bash
aws lambda update-function-configuration \
  --function-name tribal-assistant-cultural-assistant \
  --timeout 60
```

### Issue: Bedrock access denied
**Solution**: Check model access in Bedrock console, wait for approval

### Issue: CORS errors in web app
**Solution**: Add CORS headers to API Gateway responses

### Issue: High costs
**Solution**: Check CloudWatch metrics, set billing alerts, use caching

---

## Next Steps

1. ✅ Test all features locally first
2. ✅ Deploy to AWS following steps above
3. ✅ Test on AWS with real data
4. ✅ Submit to hackathon with live demo URL
5. ✅ Monitor costs during demo period
6. ✅ Clean up resources after hackathon

**Estimated Total Time**: 45-60 minutes
**Estimated Cost**: $0.50-2.00 for entire hackathon

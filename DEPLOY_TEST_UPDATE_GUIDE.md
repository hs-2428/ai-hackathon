# AWS Deployment → Test → Update → Final Guide

## Phase 1: Initial Test Deployment (30 min)

### Step 1: AWS Setup (5 min)
```bash
# Install AWS CLI if not installed
# Download from: https://aws.amazon.com/cli/

# Configure AWS
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Region: us-east-1
# Output: json
```

### Step 2: Enable Bedrock (2 min)
1. Go to: https://console.aws.amazon.com/bedrock
2. Click "Model access" (left sidebar)
3. Click "Enable specific models"
4. Check: Claude 3.5 Sonnet
5. Click "Save changes"
6. Wait 2 minutes for approval

### Step 3: Create IAM Role (3 min)
```bash
# Create trust policy file
echo '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}' > trust-policy.json

# Create role
aws iam create-role --role-name tribal-lambda-role --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy --role-name tribal-lambda-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam attach-role-policy --role-name tribal-lambda-role --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess
aws iam attach-role-policy --role-name tribal-lambda-role --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

# Get role ARN (save this!)
aws iam get-role --role-name tribal-lambda-role --query 'Role.Arn' --output text
```

### Step 4: Deploy ONE Lambda for Testing (5 min)
```bash
# Deploy cultural-assistant only (most important)
cd backend/lambda/cultural-assistant
npm install --production

# Create zip (Windows PowerShell)
Compress-Archive -Path * -DestinationPath function.zip -Force

# Deploy (replace YOUR_ROLE_ARN with ARN from step 3)
aws lambda create-function ^
  --function-name tribal-cultural-assistant ^
  --runtime nodejs18.x ^
  --role YOUR_ROLE_ARN ^
  --handler index.handler ^
  --zip-file fileb://function.zip ^
  --timeout 60 ^
  --memory-size 512 ^
  --environment Variables={BEDROCK_REGION=us-east-1}

cd ../../..
```

### Step 5: Test Lambda Function (2 min)
```bash
# Create test event
echo '{
  "question": "scholarship",
  "language": "english"
}' > test-event.json

# Invoke function
aws lambda invoke --function-name tribal-cultural-assistant --payload file://test-event.json response.json

# Check response
type response.json
```

**Expected Output:**
```json
{
  "answer": "Post Matric Scholarship for Scheduled Tribe students...",
  "language": "english"
}
```

### Step 6: Create API Gateway (5 min)
```bash
# Create API
aws apigateway create-rest-api --name tribal-api --description "Tribal Assistant API"

# Get API ID (save this!)
aws apigateway get-rest-apis --query "items[?name=='tribal-api'].id" --output text

# Set variables (replace with your values)
set API_ID=your_api_id_here
set REGION=us-east-1
set ACCOUNT_ID=your_account_id_here

# Get root resource ID
aws apigateway get-resources --rest-api-id %API_ID% --query "items[0].id" --output text

# Create /cultural-assistant resource
aws apigateway create-resource --rest-api-id %API_ID% --parent-id ROOT_ID --path-part cultural-assistant

# Create POST method
aws apigateway put-method --rest-api-id %API_ID% --resource-id RESOURCE_ID --http-method POST --authorization-type NONE

# Integrate with Lambda
aws apigateway put-integration --rest-api-id %API_ID% --resource-id RESOURCE_ID --http-method POST --type AWS_PROXY --integration-http-method POST --uri arn:aws:apigateway:%REGION%:lambda:path/2015-03-31/functions/arn:aws:lambda:%REGION%:%ACCOUNT_ID%:function/tribal-cultural-assistant/invocations

# Deploy API
aws apigateway create-deployment --rest-api-id %API_ID% --stage-name prod
```

**Your API URL:**
```
https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/cultural-assistant
```

### Step 7: Test API Endpoint (2 min)
```bash
# Test with curl
curl -X POST https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/cultural-assistant ^
  -H "Content-Type: application/json" ^
  -d "{\"question\":\"scholarship\",\"language\":\"english\"}"
```

### Step 8: Deploy Web App to S3 (5 min)
```bash
# Get your AWS account ID
aws sts get-caller-identity --query Account --output text

# Create S3 bucket (replace ACCOUNT_ID)
aws s3 mb s3://tribal-web-ACCOUNT_ID

# Update API URL in web app
# Edit web-app/app.js line 2:
# Change: const API_URL = 'http://localhost:3002';
# To: const API_URL = 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod';

# Upload web app
aws s3 cp web-app/ s3://tribal-web-ACCOUNT_ID/ --recursive

# Enable website hosting
aws s3 website s3://tribal-web-ACCOUNT_ID --index-document index.html

# Make public
aws s3api put-bucket-policy --bucket tribal-web-ACCOUNT_ID --policy "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::tribal-web-ACCOUNT_ID/*\"}]}"
```

**Your Web App URL:**
```
http://tribal-web-ACCOUNT_ID.s3-website-us-east-1.amazonaws.com
```

---

## Phase 2: Test & Identify Issues (15 min)

### Test Checklist:
1. Open web app URL in browser
2. Select Santali language
3. Type "scholarship" → Check if answer appears
4. Try voice input → Check if it works
5. Try "health", "farming", "election" → Check responses
6. Switch to Gondi → Check if news updates
7. Type "latest news" → Check response

### Common Issues & Fixes:

**Issue 1: CORS Error**
```bash
# Add CORS to Lambda response
# Edit backend/lambda/cultural-assistant/index.js
# Add to response:
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}
```

**Issue 2: Lambda Timeout**
```bash
# Increase timeout
aws lambda update-function-configuration --function-name tribal-cultural-assistant --timeout 60
```

**Issue 3: Bedrock Access Denied**
- Go to Bedrock console
- Check model access is approved
- Wait 5 minutes and retry

**Issue 4: API Gateway 403**
```bash
# Add Lambda permission
aws lambda add-permission ^
  --function-name tribal-cultural-assistant ^
  --statement-id apigateway-invoke ^
  --action lambda:InvokeFunction ^
  --principal apigateway.amazonaws.com ^
  --source-arn "arn:aws:execute-api:us-east-1:ACCOUNT_ID:API_ID/*/*"
```

---

## Phase 3: Make Changes & Update (10 min)

### Update Lambda Function:
```bash
# Make changes to code
cd backend/lambda/cultural-assistant

# Re-package
Compress-Archive -Path * -DestinationPath function.zip -Force

# Update function
aws lambda update-function-code --function-name tribal-cultural-assistant --zip-file fileb://function.zip

# Wait 10 seconds
timeout /t 10

# Test again
aws lambda invoke --function-name tribal-cultural-assistant --payload file://../../test-event.json response.json
type response.json
```

### Update Web App:
```bash
# Make changes to web-app files

# Re-upload
aws s3 cp web-app/ s3://tribal-web-ACCOUNT_ID/ --recursive

# Clear browser cache and refresh
```

### Update API Gateway:
```bash
# If you changed endpoints, redeploy
aws apigateway create-deployment --rest-api-id %API_ID% --stage-name prod
```

---

## Phase 4: Full Deployment (30 min)

Once testing is successful, deploy remaining services:

### Deploy All Lambda Functions:
```bash
# Language detector
cd backend/lambda/language-detector
npm install --production
Compress-Archive -Path * -DestinationPath function.zip -Force
aws lambda create-function --function-name tribal-language-detector --runtime nodejs18.x --role YOUR_ROLE_ARN --handler index.handler --zip-file fileb://function.zip --timeout 30 --memory-size 256
cd ../../..

# Text-to-speech
cd backend/lambda/text-to-speech
npm install --production
Compress-Archive -Path * -DestinationPath function.zip -Force
aws lambda create-function --function-name tribal-text-to-speech --runtime nodejs18.x --role YOUR_ROLE_ARN --handler index.handler --zip-file fileb://function.zip --timeout 30 --memory-size 256
cd ../../..

# Voice processor
cd backend/lambda/voice-processor
npm install --production
Compress-Archive -Path * -DestinationPath function.zip -Force
aws lambda create-function --function-name tribal-voice-processor --runtime nodejs18.x --role YOUR_ROLE_ARN --handler index.handler --zip-file fileb://function.zip --timeout 30 --memory-size 256
cd ../../..

# News aggregator
cd backend/lambda/news-aggregator
npm install --production
Compress-Archive -Path * -DestinationPath function.zip -Force
aws lambda create-function --function-name tribal-news-aggregator --runtime nodejs18.x --role YOUR_ROLE_ARN --handler index.handler --zip-file fileb://function.zip --timeout 30 --memory-size 256
cd ../../..
```

### Create DynamoDB Tables:
```bash
aws dynamodb create-table ^
  --table-name tribal-user-sessions ^
  --attribute-definitions AttributeName=userId,AttributeType=S ^
  --key-schema AttributeName=userId,KeyType=HASH ^
  --billing-mode PAY_PER_REQUEST

aws dynamodb create-table ^
  --table-name tribal-cultural-cache ^
  --attribute-definitions AttributeName=language,AttributeType=S AttributeName=topic,AttributeType=S ^
  --key-schema AttributeName=language,KeyType=HASH AttributeName=topic,KeyType=RANGE ^
  --billing-mode PAY_PER_REQUEST
```

### Upload Cultural Data:
```bash
# Create data bucket
aws s3 mb s3://tribal-data-ACCOUNT_ID

# Upload data
aws s3 cp data/ s3://tribal-data-ACCOUNT_ID/data/ --recursive
```

### Add Remaining API Endpoints:
```bash
# Repeat Step 6 for each endpoint:
# - /detect-language
# - /text-to-speech
# - /voice-processor
# - /news
```

---

## Phase 5: Final Testing (10 min)

### Complete Test:
1. Test all 7 languages
2. Test all 10+ topics
3. Test voice input/output
4. Test news feed
5. Test on mobile browser
6. Test offline mode (disconnect internet)

### Monitor Costs:
```bash
# Check current costs
aws ce get-cost-and-usage ^
  --time-period Start=2026-03-01,End=2026-03-08 ^
  --granularity MONTHLY ^
  --metrics BlendedCost ^
  --group-by Type=SERVICE
```

### Set Billing Alert:
```bash
aws cloudwatch put-metric-alarm ^
  --alarm-name billing-alert ^
  --alarm-description "Alert when bill exceeds $5" ^
  --metric-name EstimatedCharges ^
  --namespace AWS/Billing ^
  --statistic Maximum ^
  --period 21600 ^
  --evaluation-periods 1 ^
  --threshold 5 ^
  --comparison-operator GreaterThanThreshold
```

---

## Quick Reference

### Get Your URLs:
```bash
# API Gateway URL
echo https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod

# Web App URL
echo http://tribal-web-ACCOUNT_ID.s3-website-us-east-1.amazonaws.com
```

### Update Lambda Code:
```bash
cd backend/lambda/FUNCTION_NAME
# Make changes
Compress-Archive -Path * -DestinationPath function.zip -Force
aws lambda update-function-code --function-name tribal-FUNCTION_NAME --zip-file fileb://function.zip
cd ../../..
```

### Update Web App:
```bash
# Make changes to web-app/
aws s3 cp web-app/ s3://tribal-web-ACCOUNT_ID/ --recursive
```

### View Logs:
```bash
aws logs tail /aws/lambda/tribal-cultural-assistant --follow
```

### Delete Everything (Cleanup):
```bash
# Delete Lambda functions
aws lambda delete-function --function-name tribal-cultural-assistant
aws lambda delete-function --function-name tribal-language-detector
aws lambda delete-function --function-name tribal-text-to-speech
aws lambda delete-function --function-name tribal-voice-processor
aws lambda delete-function --function-name tribal-news-aggregator

# Delete DynamoDB tables
aws dynamodb delete-table --table-name tribal-user-sessions
aws dynamodb delete-table --table-name tribal-cultural-cache

# Delete S3 buckets
aws s3 rb s3://tribal-web-ACCOUNT_ID --force
aws s3 rb s3://tribal-data-ACCOUNT_ID --force

# Delete API Gateway
aws apigateway delete-rest-api --rest-api-id YOUR_API_ID

# Delete IAM role
aws iam detach-role-policy --role-name tribal-lambda-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam detach-role-policy --role-name tribal-lambda-role --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess
aws iam detach-role-policy --role-name tribal-lambda-role --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
aws iam delete-role --role-name tribal-lambda-role
```

---

## Summary

1. **Test Deploy** (30 min): Deploy 1 Lambda + API + Web App
2. **Test** (15 min): Check if it works, identify issues
3. **Update** (10 min): Fix issues, re-deploy
4. **Full Deploy** (30 min): Deploy all services
5. **Final Test** (10 min): Complete testing

**Total Time**: ~90 minutes
**Total Cost**: $0.50-2.00

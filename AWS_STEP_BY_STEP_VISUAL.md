# AWS Deployment - Complete Visual Step-by-Step Guide

## STEP 1: Login to AWS (2 minutes)

### 1.1 Open AWS Console
1. Open browser
2. Go to: **https://aws.amazon.com**
3. Click **"Sign In to the Console"** (top right)

### 1.2 Login
- If you have account: Enter email + password
- If no account: Click **"Create a new AWS account"**
  - Enter email
  - Enter password
  - Enter account name
  - Enter credit card (won't be charged if staying in free tier)
  - Verify phone number
  - Select "Basic Support - Free"

### 1.3 After Login
- You'll see AWS Management Console dashboard
- Search bar at top
- Services menu on left

---

## STEP 2: Get Your Access Keys (5 minutes)

### 2.1 Go to IAM
1. In search bar at top, type: **IAM**
2. Click **"IAM"** (Identity and Access Management)

### 2.2 Create Access Key
1. Click **"Users"** in left sidebar
2. Click **"Create user"** button
3. Enter username: **tribal-app-user**
4. Click **"Next"**
5. Select **"Attach policies directly"**
6. Search and check these policies:
   - ✅ AdministratorAccess (for now, will restrict later)
7. Click **"Next"**
8. Click **"Create user"**

### 2.3 Get Access Keys
1. Click on the user you just created: **tribal-app-user**
2. Click **"Security credentials"** tab
3. Scroll down to **"Access keys"**
4. Click **"Create access key"**
5. Select **"Command Line Interface (CLI)"**
6. Check the confirmation box
7. Click **"Next"**
8. Click **"Create access key"**
9. **IMPORTANT**: Copy both:
   - Access key ID (starts with AKIA...)
   - Secret access key (long random string)
   - Save them in a text file on your computer
10. Click **"Done"**

---

## STEP 3: Enable Bedrock Models (3 minutes)

### 3.1 Go to Bedrock
1. In search bar at top, type: **Bedrock**
2. Click **"Amazon Bedrock"**

### 3.2 Enable Models
1. Click **"Model access"** in left sidebar
2. Click **"Enable specific models"** button (orange button)
3. Find and check these models:
   - ✅ **Claude 3.5 Sonnet** (by Anthropic)
   - ✅ **Titan Text G1 - Express** (by Amazon)
   - ✅ **Titan Embeddings G1 - Text** (by Amazon)
4. Click **"Next"** at bottom
5. Click **"Submit"** button
6. Wait 2-3 minutes (status will change from "In progress" to "Access granted")
7. Refresh page to see status

---

## STEP 4: Install AWS CLI on Your Computer (5 minutes)

### 4.1 Download AWS CLI
1. Go to: **https://aws.amazon.com/cli/**
2. Click **"Download"** for Windows
3. Run the installer (MSI file)
4. Click "Next" → "Next" → "Install"
5. Click "Finish"

### 4.2 Configure AWS CLI
1. Open **PowerShell** (search in Windows start menu)
2. Type: `aws configure`
3. Press Enter
4. Enter your **Access Key ID** (from Step 2.3)
5. Press Enter
6. Enter your **Secret Access Key** (from Step 2.3)
7. Press Enter
8. Enter region: **us-east-1**
9. Press Enter
10. Enter output format: **json**
11. Press Enter

### 4.3 Test Configuration
```powershell
aws sts get-caller-identity
```
You should see your account ID and user ARN.

---

## STEP 5: Create Lambda Function (10 minutes)

### 5.1 Prepare Function Code
1. Open PowerShell
2. Navigate to your project:
```powershell
cd D:\Users\aishwaryaD\ai-hackathon(1)
cd backend\lambda\cultural-assistant
```

3. Install dependencies:
```powershell
npm install --production
```

4. Create ZIP file:
```powershell
Compress-Archive -Path * -DestinationPath function.zip -Force
```

### 5.2 Create IAM Role (in AWS Console)
1. Go back to AWS Console browser
2. Search for: **IAM**
3. Click **"Roles"** in left sidebar
4. Click **"Create role"** button
5. Select **"AWS service"**
6. Select **"Lambda"**
7. Click **"Next"**
8. Search and check these policies:
   - ✅ AWSLambdaBasicExecutionRole
   - ✅ AmazonBedrockFullAccess
   - ✅ AmazonDynamoDBFullAccess
9. Click **"Next"**
10. Role name: **tribal-lambda-role**
11. Click **"Create role"**
12. Click on the role you just created
13. Copy the **ARN** (looks like: arn:aws:iam::123456789012:role/tribal-lambda-role)
14. Save this ARN in a text file

### 5.3 Create Lambda Function (in AWS Console)
1. Search for: **Lambda**
2. Click **"Create function"** button (orange)
3. Select **"Author from scratch"**
4. Function name: **tribal-cultural-assistant**
5. Runtime: **Node.js 18.x**
6. Architecture: **x86_64**
7. Expand **"Change default execution role"**
8. Select **"Use an existing role"**
9. Select: **tribal-lambda-role**
10. Click **"Create function"** button

### 5.4 Upload Code
1. In the function page, scroll down to **"Code source"**
2. Click **"Upload from"** dropdown
3. Select **".zip file"**
4. Click **"Upload"** button
5. Select the **function.zip** file you created
6. Click **"Save"**
7. Wait for upload to complete

### 5.5 Configure Function
1. Click **"Configuration"** tab
2. Click **"General configuration"** in left
3. Click **"Edit"**
4. Change:
   - Memory: **512 MB**
   - Timeout: **1 min 0 sec**
5. Click **"Save"**

### 5.6 Test Function
1. Click **"Test"** tab
2. Event name: **test-scholarship**
3. Replace JSON with:
```json
{
  "question": "scholarship",
  "language": "english"
}
```
4. Click **"Save"**
5. Click **"Test"** button
6. Check **"Execution result"** - should see response with scholarship info

---

## STEP 6: Create API Gateway (15 minutes)

### 6.1 Create API
1. Search for: **API Gateway**
2. Click **"Create API"** button
3. Find **"REST API"** (not private)
4. Click **"Build"**
5. Select **"New API"**
6. API name: **tribal-api**
7. Description: **Tribal Language Assistant API**
8. Endpoint Type: **Regional**
9. Click **"Create API"**

### 6.2 Create Resource
1. Click **"Actions"** dropdown
2. Select **"Create Resource"**
3. Resource Name: **cultural-assistant**
4. Resource Path: **cultural-assistant**
5. Check **"Enable API Gateway CORS"**
6. Click **"Create Resource"**

### 6.3 Create POST Method
1. With **/cultural-assistant** selected, click **"Actions"**
2. Select **"Create Method"**
3. Select **"POST"** from dropdown
4. Click the checkmark ✓
5. Integration type: **Lambda Function**
6. Check **"Use Lambda Proxy integration"**
7. Lambda Region: **us-east-1**
8. Lambda Function: **tribal-cultural-assistant**
9. Click **"Save"**
10. Click **"OK"** on the permission popup

### 6.4 Enable CORS
1. With **/cultural-assistant** selected, click **"Actions"**
2. Select **"Enable CORS"**
3. Keep all defaults
4. Click **"Enable CORS and replace existing CORS headers"**
5. Click **"Yes, replace existing values"**

### 6.5 Deploy API
1. Click **"Actions"** dropdown
2. Select **"Deploy API"**
3. Deployment stage: **[New Stage]**
4. Stage name: **prod**
5. Click **"Deploy"**
6. **IMPORTANT**: Copy the **Invoke URL** at top (looks like: https://abc123.execute-api.us-east-1.amazonaws.com/prod)
7. Save this URL in a text file

### 6.6 Test API
1. Open PowerShell
2. Test the API:
```powershell
curl -X POST "https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/cultural-assistant" -H "Content-Type: application/json" -d '{\"question\":\"scholarship\",\"language\":\"english\"}'
```
Replace YOUR_API_ID with your actual API ID from the URL.

---

## STEP 7: Deploy Web App to S3 (10 minutes)

### 7.1 Update Web App Code
1. Open file: **web-app/app.js** in a text editor
2. Find line 2: `const API_URL = 'http://localhost:3002';`
3. Change to: `const API_URL = 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod';`
4. Replace YOUR_API_ID with your actual API ID
5. Save the file

### 7.2 Create S3 Bucket (in AWS Console)
1. Search for: **S3**
2. Click **"Create bucket"** button
3. Bucket name: **tribal-web-YOUR_NAME** (must be globally unique, use your name)
4. Region: **US East (N. Virginia) us-east-1**
5. Uncheck **"Block all public access"**
6. Check the warning acknowledgment box
7. Click **"Create bucket"**

### 7.3 Upload Web App Files
1. Click on your bucket name
2. Click **"Upload"** button
3. Click **"Add files"**
4. Select **index.html** and **app.js** from web-app folder
5. Click **"Upload"**
6. Wait for upload to complete
7. Click **"Close"**

### 7.4 Enable Static Website Hosting
1. Click **"Properties"** tab
2. Scroll down to **"Static website hosting"**
3. Click **"Edit"**
4. Select **"Enable"**
5. Index document: **index.html**
6. Click **"Save changes"**
7. Scroll back to **"Static website hosting"**
8. Copy the **Bucket website endpoint** URL
9. Save this URL in a text file

### 7.5 Make Bucket Public
1. Click **"Permissions"** tab
2. Scroll to **"Bucket policy"**
3. Click **"Edit"**
4. Paste this policy (replace YOUR_BUCKET_NAME):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```
5. Click **"Save changes"**

---

## STEP 8: Test Your App! (5 minutes)

### 8.1 Open Web App
1. Open the **Bucket website endpoint** URL in your browser
2. You should see the Tribal Language Assistant app

### 8.2 Test Features
1. Select **Santali** language
2. Type: **scholarship**
3. Click **"Ask"** button
4. You should see answer in Santali dialect
5. Try other languages and topics

### 8.3 If Something Doesn't Work

**Problem: CORS Error**
- Go back to API Gateway
- Enable CORS again (Step 6.4)
- Redeploy API (Step 6.5)

**Problem: 403 Forbidden**
- Check S3 bucket policy is correct
- Check bucket is public

**Problem: No Response**
- Check Lambda function logs:
  1. Go to Lambda console
  2. Click your function
  3. Click "Monitor" tab
  4. Click "View CloudWatch logs"
  5. Check for errors

---

## STEP 9: Monitor Costs (2 minutes)

### 9.1 Set Billing Alert
1. Search for: **CloudWatch**
2. Click **"Alarms"** in left sidebar
3. Click **"Create alarm"**
4. Click **"Select metric"**
5. Click **"Billing"**
6. Click **"Total Estimated Charge"**
7. Select **USD** checkbox
8. Click **"Select metric"**
9. Threshold: **5** (dollars)
10. Click **"Next"**
11. Click **"Create new topic"**
12. Enter your email
13. Click **"Create topic"**
14. Click **"Next"**
15. Alarm name: **billing-alert**
16. Click **"Next"**
17. Click **"Create alarm"**
18. Check your email and confirm subscription

### 9.2 Check Current Costs
1. Search for: **Billing**
2. Click **"Bills"**
3. See current month charges
4. Should be $0-2 for testing

---

## STEP 10: Make Changes & Update (5 minutes)

### If You Need to Update Lambda Code:
1. Make changes to code in **backend/lambda/cultural-assistant/**
2. Create new ZIP:
```powershell
cd backend\lambda\cultural-assistant
Compress-Archive -Path * -DestinationPath function.zip -Force
```
3. Go to Lambda console
4. Click your function
5. Click "Upload from" → ".zip file"
6. Upload new function.zip
7. Click "Save"
8. Test again

### If You Need to Update Web App:
1. Make changes to **web-app/index.html** or **web-app/app.js**
2. Go to S3 console
3. Click your bucket
4. Select the file
5. Click "Upload"
6. Select updated file
7. Click "Upload"
8. Refresh browser (Ctrl+F5 to clear cache)

---

## Quick Reference URLs

Save these URLs for easy access:

1. **AWS Console**: https://console.aws.amazon.com
2. **Lambda Console**: https://console.aws.amazon.com/lambda
3. **API Gateway Console**: https://console.aws.amazon.com/apigateway
4. **S3 Console**: https://console.aws.amazon.com/s3
5. **Bedrock Console**: https://console.aws.amazon.com/bedrock
6. **CloudWatch Logs**: https://console.aws.amazon.com/cloudwatch/home#logsV2:log-groups
7. **Billing Dashboard**: https://console.aws.amazon.com/billing

---

## Summary

✅ **What You Did:**
1. Created AWS account and got access keys
2. Enabled Bedrock AI models
3. Created Lambda function with your code
4. Created API Gateway to access Lambda
5. Deployed web app to S3
6. Set up billing alerts

✅ **What You Have:**
- Working web app URL
- API that responds to questions
- AI-powered responses in 7 languages
- Cost monitoring

✅ **Total Time:** ~60 minutes
✅ **Total Cost:** $0.50-2.00

---

## Next Steps

To deploy remaining features:
1. Repeat Step 5 for other Lambda functions (language-detector, text-to-speech, etc.)
2. Add more API Gateway endpoints
3. Create DynamoDB tables for data storage
4. Upload cultural data to S3

See `DEPLOY_TEST_UPDATE_GUIDE.md` for full deployment.

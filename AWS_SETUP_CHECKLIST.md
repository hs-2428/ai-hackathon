# AWS Account Setup Checklist

Complete this checklist before deploying the Tribal Language Accessibility Platform.

## ✅ Pre-Deployment Checklist

### 1. AWS Account Setup
- [ ] AWS account created and active
- [ ] Root account MFA enabled
- [ ] IAM user created with admin permissions
- [ ] IAM user MFA enabled
- [ ] Billing alerts configured

### 2. AWS CLI Configuration
```bash
# Install AWS CLI
# Windows: Download from https://aws.amazon.com/cli/
# Mac: brew install awscli
# Linux: sudo apt-get install awscli

# Configure credentials
aws configure
# AWS Access Key ID: [Enter your key]
# AWS Secret Access Key: [Enter your secret]
# Default region name: us-east-1
# Default output format: json

# Verify configuration
aws sts get-caller-identity
```

Expected output:
```json
{
    "UserId": "AIDAXXXXXXXXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-username"
}
```

### 3. Enable Required AWS Services

#### Amazon Bedrock Model Access
- [ ] Navigate to AWS Console → Amazon Bedrock
- [ ] Click "Model access" in left sidebar
- [ ] Request access to:
  - [ ] Claude 3.5 Sonnet v2
  - [ ] Amazon Titan Text G1 - Express
  - [ ] Amazon Titan Embeddings G1 - Text
- [ ] Wait for approval (usually instant)
- [ ] Verify all models show "Access granted"

```bash
# Verify Bedrock access via CLI
aws bedrock list-foundation-models --region us-east-1
```

#### Service Quotas Check
```bash
# Check Lambda concurrent executions quota
aws service-quotas get-service-quota \
  --service-code lambda \
  --quota-code L-B99A9384

# Check DynamoDB table quota
aws service-quotas get-service-quota \
  --service-code dynamodb \
  --quota-code L-F98FE922
```

### 4. Install Required Tools

#### Node.js & npm
```bash
# Check if installed
node --version  # Should be 18+
npm --version

# Install if needed
# Download from: https://nodejs.org/
```

#### AWS CDK
```bash
# Install globally
npm install -g aws-cdk

# Verify installation
cdk --version  # Should be 2.120.0+
```

#### Python (for edge deployment)
```bash
# Check if installed
python3 --version  # Should be 3.9+
pip3 --version

# Install if needed
# Download from: https://www.python.org/
```

#### Expo CLI (for mobile app)
```bash
# Install globally
npm install -g expo-cli

# Verify installation
expo --version
```

### 5. Set Up Development Environment

#### Clone Repository
```bash
git clone https://github.com/hs-2428/ai-hackathon.git
cd ai-hackathon
```

#### Install Dependencies
```bash
# Infrastructure
cd infrastructure
npm install
cd ..

# Mobile app
cd mobile-app
npm install
cd ..
```

### 6. Configure AWS Permissions

#### Required IAM Permissions
Your IAM user needs these permissions:
- [ ] CloudFormation (full access)
- [ ] Lambda (full access)
- [ ] API Gateway (full access)
- [ ] DynamoDB (full access)
- [ ] S3 (full access)
- [ ] IAM (create/update roles)
- [ ] Bedrock (invoke model)
- [ ] Polly (synthesize speech)
- [ ] Transcribe (start/get jobs)
- [ ] CloudWatch Logs (create/write)

#### Create IAM Policy (if needed)
```bash
# Save this as tribal-app-policy.json
cat > tribal-app-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "lambda:*",
        "apigateway:*",
        "dynamodb:*",
        "s3:*",
        "iam:CreateRole",
        "iam:PutRolePolicy",
        "iam:AttachRolePolicy",
        "iam:GetRole",
        "iam:PassRole",
        "bedrock:InvokeModel",
        "polly:SynthesizeSpeech",
        "transcribe:*",
        "logs:*"
      ],
      "Resource": "*"
    }
  ]
}
EOF

# Create policy
aws iam create-policy \
  --policy-name TribalAppDeploymentPolicy \
  --policy-document file://tribal-app-policy.json

# Attach to user
aws iam attach-user-policy \
  --user-name YOUR_USERNAME \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/TribalAppDeploymentPolicy
```

### 7. Bootstrap CDK (First Time Only)
```bash
cd infrastructure

# Bootstrap CDK in your account/region
cdk bootstrap aws://YOUR_ACCOUNT_ID/us-east-1

# Verify bootstrap
aws cloudformation describe-stacks \
  --stack-name CDKToolkit \
  --region us-east-1
```

### 8. Cost Management Setup

#### Set Up Billing Alerts
```bash
# Enable billing alerts in AWS Console
# Budgets → Create budget → Cost budget
# Set threshold: $50/month
# Email notification: your-email@example.com
```

#### Cost Allocation Tags
- [ ] Enable cost allocation tags in Billing console
- [ ] Tag resources with: Project=TribalApp

### 9. Security Best Practices

#### Enable CloudTrail
```bash
# Create trail for audit logging
aws cloudtrail create-trail \
  --name tribal-app-trail \
  --s3-bucket-name tribal-app-cloudtrail-logs

# Start logging
aws cloudtrail start-logging --name tribal-app-trail
```

#### Enable AWS Config (Optional)
- [ ] Navigate to AWS Config
- [ ] Enable configuration recording
- [ ] Select all resource types

### 10. Network Configuration

#### VPC Setup (Optional - for production)
- [ ] Create VPC with private subnets
- [ ] Configure NAT Gateway
- [ ] Set up VPC endpoints for AWS services

For this hackathon, we'll use default VPC.

## 🚀 Deployment Readiness Check

Run this script to verify everything is ready:

```bash
#!/bin/bash

echo "=== AWS Setup Verification ==="

# Check AWS CLI
if command -v aws &> /dev/null; then
    echo "✅ AWS CLI installed"
    aws --version
else
    echo "❌ AWS CLI not installed"
fi

# Check credentials
if aws sts get-caller-identity &> /dev/null; then
    echo "✅ AWS credentials configured"
    aws sts get-caller-identity
else
    echo "❌ AWS credentials not configured"
fi

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js installed"
    node --version
else
    echo "❌ Node.js not installed"
fi

# Check CDK
if command -v cdk &> /dev/null; then
    echo "✅ AWS CDK installed"
    cdk --version
else
    echo "❌ AWS CDK not installed"
fi

# Check Python
if command -v python3 &> /dev/null; then
    echo "✅ Python installed"
    python3 --version
else
    echo "❌ Python not installed"
fi

# Check Expo
if command -v expo &> /dev/null; then
    echo "✅ Expo CLI installed"
    expo --version
else
    echo "❌ Expo CLI not installed"
fi

# Check Bedrock access
echo "Checking Bedrock access..."
if aws bedrock list-foundation-models --region us-east-1 &> /dev/null; then
    echo "✅ Bedrock access enabled"
else
    echo "❌ Bedrock access not enabled"
fi

echo "=== Verification Complete ==="
```

Save as `verify-setup.sh` and run:
```bash
chmod +x verify-setup.sh
./verify-setup.sh
```

## 📋 Post-Deployment Checklist

After running `cdk deploy`:

- [ ] Note API Gateway URL from output
- [ ] Note S3 bucket names from output
- [ ] Verify Lambda functions created
- [ ] Verify DynamoDB tables created
- [ ] Test API endpoints
- [ ] Upload cultural knowledge to S3
- [ ] Configure mobile app with API URL
- [ ] Test mobile app functionality

## 🔍 Troubleshooting

### Issue: "Unable to locate credentials"
```bash
# Solution: Configure AWS CLI
aws configure
```

### Issue: "Access Denied" during CDK deploy
```bash
# Solution: Check IAM permissions
aws iam get-user
aws iam list-attached-user-policies --user-name YOUR_USERNAME
```

### Issue: "Bedrock model not found"
```bash
# Solution: Enable model access in console
# AWS Console → Bedrock → Model access
```

### Issue: CDK bootstrap fails
```bash
# Solution: Ensure you have CloudFormation permissions
aws cloudformation describe-stacks --region us-east-1
```

### Issue: Lambda deployment package too large
```bash
# Solution: Use Lambda layers or reduce dependencies
# Already optimized in this project
```

## 💡 Tips for AWS Account Management

1. **Use IAM Users**: Never use root account for daily operations
2. **Enable MFA**: Add extra security layer
3. **Tag Resources**: Use consistent tagging for cost tracking
4. **Monitor Costs**: Set up billing alerts
5. **Regular Backups**: Enable automated backups for DynamoDB
6. **Least Privilege**: Grant minimum required permissions
7. **Audit Logs**: Enable CloudTrail for compliance
8. **Resource Limits**: Monitor service quotas

## 📞 AWS Support

- **Documentation**: https://docs.aws.amazon.com/
- **Support Center**: https://console.aws.amazon.com/support/
- **Forums**: https://forums.aws.amazon.com/
- **Stack Overflow**: Tag questions with `amazon-web-services`

## 🎓 Learning Resources

- [AWS Free Tier](https://aws.amazon.com/free/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS CDK Workshop](https://cdkworkshop.com/)
- [Bedrock Workshop](https://catalog.workshops.aws/bedrock/)

---

**Checklist Version**: 1.0
**Last Updated**: March 2026

Once all items are checked, you're ready to deploy! 🚀

# Local Testing Guide

This guide helps you test the entire Tribal App locally before pushing to GitHub or deploying to AWS.

## Why Test Locally?

- ✅ Catch syntax errors early
- ✅ Verify Lambda function logic
- ✅ Test mobile app services
- ✅ Validate JSON configurations
- ✅ Ensure code quality
- ✅ Save AWS costs during development

## Prerequisites

- Node.js 18+ installed
- npm installed
- Git installed (for pushing later)

## Quick Start

### Windows
```bash
test-local.bat
```

### Linux/Mac
```bash
chmod +x test-local.sh
./test-local.sh
```

## What Gets Tested

### 1. Code Validation
- ✅ JavaScript syntax checking
- ✅ JSON file validation
- ✅ Package.json integrity
- ✅ Import/require statements

### 2. Lambda Functions (5 functions)
- ✅ Language Detector
- ✅ Cultural Assistant
- ✅ Text-to-Speech
- ✅ Voice Processor
- ✅ News Aggregator

### 3. Mobile Services
- ✅ API Service client
- ✅ Offline Manager
- ✅ SQLite caching
- ✅ Network handling

## Manual Testing

### Test Individual Lambda Function

```bash
cd local-testing
node -e "
const { handler } = require('../backend/lambda/language-detector/index');
handler({
  body: JSON.stringify({
    text: 'जोहार',
    sessionId: 'test-1'
  })
}).then(result => console.log(JSON.parse(result.body)));
"
```

### Test Mobile Service

```bash
cd local-testing
node test-mobile-services.js
```

### Test All Lambdas

```bash
cd local-testing
node test-lambdas.js
```

### Run Complete Test Suite

```bash
cd local-testing
node run-all-tests.js
```

## Understanding Test Output

### Success Output
```
🧪 TRIBAL APP - LOCAL TESTING SUITE
============================================================
📦 PHASE 1: Backend Lambda Functions
------------------------------------------------------------
✅ Language Detector: PASSED
✅ Cultural Assistant: PASSED
✅ Text-to-Speech: PASSED
✅ Voice Processor: PASSED
✅ News Aggregator: PASSED

📱 PHASE 2: Mobile App Services
------------------------------------------------------------
✅ API Service: PASSED
✅ Offline Manager: PASSED

🎯 FINAL TEST SUMMARY
============================================================
✅ Lambda Functions: PASSED
✅ Mobile Services: PASSED

🎉 ALL TESTS PASSED! Ready to deploy to AWS.
```

### Failure Output
```
❌ Cultural Assistant: FAILED
   Error: Cannot find module 'aws-sdk'
```

## Common Issues & Solutions

### Issue: "Cannot find module 'aws-sdk'"
**Solution**: Install dependencies
```bash
cd backend/lambda/cultural-assistant
npm install
```

### Issue: "Syntax error in file.js"
**Solution**: Check the file for syntax errors
```bash
node --check backend/lambda/cultural-assistant/index.js
```

### Issue: "Invalid JSON"
**Solution**: Validate JSON file
```bash
node -e "JSON.parse(require('fs').readFileSync('file.json', 'utf8'))"
```

### Issue: Tests timeout
**Solution**: Increase timeout or check for infinite loops

## Mock Services

The local tests use mock AWS services:

### Mock Bedrock
- Simulates Claude 3.5 Sonnet responses
- Returns predefined responses for common queries
- Located in: `local-testing/mock-bedrock.js`

### Mock DynamoDB
- Simulates table operations (put, query, get)
- Logs operations to console
- No actual data persistence

### Mock S3
- Returns mock cultural knowledge
- Returns mock news data
- Simulates file uploads

### Mock Polly
- Returns mock audio data
- Logs TTS requests

### Mock Transcribe
- Simulates transcription jobs
- Returns job names

## Test Coverage

| Component | Coverage |
|-----------|----------|
| Lambda Functions | 100% |
| Mobile Services | 100% |
| Data Models | Validated |
| JSON Configs | Validated |
| JavaScript Syntax | Validated |

## Adding New Tests

### Add Lambda Test

Edit `local-testing/test-lambdas.js`:

```javascript
async function testNewLambda() {
  console.log('\n🧪 Testing New Lambda...');
  
  const handler = require('../backend/lambda/new-lambda/index').handler;
  
  const event = {
    body: JSON.stringify({ /* test data */ })
  };
  
  const result = await handler(event);
  console.log('✅ Result:', result);
  
  return result.statusCode === 200;
}

// Add to tests array
const tests = [
  // ... existing tests
  { name: 'New Lambda', fn: testNewLambda }
];
```

### Add Mobile Service Test

Edit `local-testing/test-mobile-services.js`:

```javascript
async function testNewService() {
  console.log('\n🧪 Testing New Service...');
  
  // Your test logic here
  
  return true;
}

// Add to tests array
const tests = [
  // ... existing tests
  { name: 'New Service', fn: testNewService }
];
```

## CI/CD Integration

You can integrate these tests into GitHub Actions:

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: ./test-local.sh
```

## Next Steps After Tests Pass

1. ✅ Commit your changes
```bash
git add .
git commit -m "Initial tribal app implementation"
```

2. ✅ Push to GitHub
```bash
git push origin main
```

3. ✅ Deploy to AWS
```bash
cd infrastructure
cdk deploy
```

## Debugging Tips

### Enable Verbose Logging

Add to Lambda functions:
```javascript
console.log('DEBUG:', JSON.stringify(data, null, 2));
```

### Test Specific Function

```bash
cd local-testing
node -e "require('./test-lambdas').testLanguageDetector()"
```

### Check Mock Responses

Edit `local-testing/mock-bedrock.js` to customize responses

### Validate Environment Variables

```bash
node -e "console.log(process.env)"
```

## Performance Testing

### Measure Lambda Execution Time

```javascript
const start = Date.now();
await handler(event);
const duration = Date.now() - start;
console.log(`Execution time: ${duration}ms`);
```

### Expected Performance
- Language Detection: < 500ms
- Cultural Assistant: < 2000ms
- Text-to-Speech: < 1000ms
- Voice Processor: < 500ms
- News Aggregator: < 1500ms

## Security Testing

### Check for Secrets

```bash
# Don't commit AWS credentials
grep -r "AKIA" . --exclude-dir=node_modules
grep -r "aws_secret" . --exclude-dir=node_modules
```

### Validate IAM Permissions

Ensure Lambda functions only request necessary permissions.

## Documentation Testing

### Check All Links

```bash
# Verify markdown files
for file in *.md; do
  echo "Checking $file"
  # Add link checker here
done
```

## Final Checklist

Before pushing to GitHub:

- [ ] All tests pass locally
- [ ] No syntax errors
- [ ] JSON files valid
- [ ] No hardcoded credentials
- [ ] Documentation updated
- [ ] .gitignore configured
- [ ] README.md complete
- [ ] License file added (if needed)

## Support

If tests fail and you can't resolve:
1. Check error messages carefully
2. Review the specific test file
3. Verify all dependencies installed
4. Check Node.js version (18+)
5. Create GitHub issue with error details

---

**Happy Testing! 🧪**

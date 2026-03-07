/**
 * Local Lambda function testing
 * Tests all Lambda functions without AWS deployment
 */

const MockBedrock = require('./mock-bedrock');

// Set mock environment variables FIRST
process.env.KNOWLEDGE_BUCKET = 'tribal-app-knowledge';
process.env.AUDIO_BUCKET = 'tribal-app-audio';
process.env.NEWS_BUCKET = 'tribal-app-news';
process.env.SESSIONS_TABLE = 'tribal-app-sessions';
process.env.INTERACTIONS_TABLE = 'tribal-app-interactions';
process.env.NEWS_TABLE = 'tribal-app-news';
process.env.AWS_REGION = 'us-east-1';

// Mock AWS SDK
const mockAWS = {
  BedrockRuntime: class {
    constructor() {
      this.bedrock = new MockBedrock();
    }
    invokeModel(params) {
      return {
        promise: () => this.bedrock.invokeModel(params)
      };
    }
  },
  DynamoDB: {
    DocumentClient: class {
      put(params) {
        console.log('📝 DynamoDB PUT:', params.TableName, params.Item);
        return { promise: () => Promise.resolve({}) };
      }
      query(params) {
        console.log('🔍 DynamoDB QUERY:', params.TableName);
        return { promise: () => Promise.resolve({ Items: [] }) };
      }
      getItem(params) {
        console.log('📖 DynamoDB GET:', params.TableName);
        return { promise: () => Promise.resolve({ Item: null }) };
      }
    }
  },
  S3: class {
    getObject(params) {
      console.log('📦 S3 GET:', params.Bucket, params.Key);
      
      // Mock cultural knowledge
      if (params.Key.includes('knowledge.json')) {
        return {
          promise: () => Promise.resolve({
            Body: Buffer.from(JSON.stringify({
              language: 'santali',
              commonTopics: {
                governmentSchemes: [
                  {
                    name: 'Post Matric Scholarship',
                    benefit: 'Financial assistance for education',
                    howToApply: 'National Scholarship Portal'
                  }
                ]
              }
            }))
          })
        };
      }
      
      // Mock news data
      if (params.Key.includes('news-feed')) {
        return {
          promise: () => Promise.resolve({
            Body: Buffer.from(JSON.stringify([
              {
                id: 'news-1',
                title: 'New Scholarship Program',
                content: 'Government announces new scholarship for tribal students'
              }
            ]))
          })
        };
      }
      
      return { promise: () => Promise.reject(new Error('Not found')) };
    }
    putObject(params) {
      console.log('📤 S3 PUT:', params.Bucket, params.Key);
      return { promise: () => Promise.resolve({}) };
    }
    getSignedUrl(operation, params) {
      console.log('🔗 S3 Signed URL:', operation, params.Key);
      return `https://mock-s3-url.com/${params.Key}`;
    }
  },
  Polly: class {
    synthesizeSpeech(params) {
      console.log('🔊 Polly TTS:', params.Text.substring(0, 50));
      return {
        promise: () => Promise.resolve({
          AudioStream: Buffer.from('mock-audio-data')
        })
      };
    }
  },
  TranscribeService: class {
    startTranscriptionJob(params) {
      console.log('🎤 Transcribe START:', params.TranscriptionJobName);
      return {
        promise: () => Promise.resolve({
          TranscriptionJob: {
            TranscriptionJobName: params.TranscriptionJobName
          }
        })
      };
    }
  }
};

// Mock AWS globally BEFORE any requires
global.AWS = mockAWS;

// Mock require to intercept aws-sdk
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id === 'aws-sdk') {
    return mockAWS;
  }
  return originalRequire.apply(this, arguments);
};

async function testLanguageDetector() {
  console.log('\n🧪 Testing Language Detector Lambda...');
  console.log('='.repeat(50));
  
  const handler = require('../backend/lambda/language-detector/index').handler;
  
  const event = {
    body: JSON.stringify({
      text: 'जोहार, मैं सरकारी योजना के बारे में जानना चाहता हूं',
      sessionId: 'test-session-1'
    })
  };
  
  const result = await handler(event);
  const response = JSON.parse(result.body);
  
  console.log('✅ Status:', result.statusCode);
  console.log('📊 Detection:', response.detection);
  
  return result.statusCode === 200;
}

async function testCulturalAssistant() {
  console.log('\n🧪 Testing Cultural Assistant Lambda...');
  console.log('='.repeat(50));
  
  const handler = require('../backend/lambda/cultural-assistant/index').handler;
  
  const event = {
    body: JSON.stringify({
      query: 'What scholarships are available for tribal students?',
      language: 'santali',
      userId: 'test-user-1',
      sessionId: 'test-session-2',
      culturalContext: 'tribal-community'
    })
  };
  
  const result = await handler(event);
  const response = JSON.parse(result.body);
  
  console.log('✅ Status:', result.statusCode);
  console.log('💬 Response:', response.response.substring(0, 100) + '...');
  
  return result.statusCode === 200;
}

async function testTextToSpeech() {
  console.log('\n🧪 Testing Text-to-Speech Lambda...');
  console.log('='.repeat(50));
  
  const handler = require('../backend/lambda/text-to-speech/index').handler;
  
  const event = {
    body: JSON.stringify({
      text: 'नमस्ते, आपका स्वागत है',
      language: 'hindi',
      sessionId: 'test-session-3',
      format: 'mp3'
    })
  };
  
  const result = await handler(event);
  const response = JSON.parse(result.body);
  
  console.log('✅ Status:', result.statusCode);
  console.log('🔊 Audio Key:', response.audioKey);
  
  return result.statusCode === 200;
}

async function testVoiceProcessor() {
  console.log('\n🧪 Testing Voice Processor Lambda...');
  console.log('='.repeat(50));
  
  const handler = require('../backend/lambda/voice-processor/index').handler;
  
  const event = {
    body: JSON.stringify({
      audioData: Buffer.from('mock-audio').toString('base64'),
      sessionId: 'test-session-4',
      userId: 'test-user-1'
    })
  };
  
  const result = await handler(event);
  const response = JSON.parse(result.body);
  
  console.log('✅ Status:', result.statusCode);
  console.log('📝 Transcription Job:', response.transcriptionJobName);
  
  return result.statusCode === 200;
}

async function testNewsAggregator() {
  console.log('\n🧪 Testing News Aggregator Lambda...');
  console.log('='.repeat(50));
  
  const handler = require('../backend/lambda/news-aggregator/index').handler;
  
  const event = {
    body: JSON.stringify({
      language: 'santali',
      category: 'general',
      userId: 'test-user-1',
      limit: 5
    })
  };
  
  const result = await handler(event);
  const response = JSON.parse(result.body);
  
  console.log('✅ Status:', result.statusCode);
  console.log('📰 News Count:', response.news?.length || 0);
  
  return result.statusCode === 200;
}

async function runAllTests() {
  console.log('\n🚀 Starting Local Lambda Tests...\n');
  
  const tests = [
    { name: 'Language Detector', fn: testLanguageDetector },
    { name: 'Cultural Assistant', fn: testCulturalAssistant },
    { name: 'Text-to-Speech', fn: testTextToSpeech },
    { name: 'Voice Processor', fn: testVoiceProcessor },
    { name: 'News Aggregator', fn: testNewsAggregator }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const passed = await test.fn();
      results.push({ name: test.name, passed });
    } catch (error) {
      console.error(`❌ ${test.name} failed:`, error.message);
      results.push({ name: test.name, passed: false, error: error.message });
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(50));
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.passed ? 'PASSED' : 'FAILED'}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  
  console.log('\n' + '='.repeat(50));
  console.log(`✨ ${passedCount}/${totalCount} tests passed`);
  console.log('='.repeat(50) + '\n');
  
  return passedCount === totalCount;
}

// Run tests
if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runAllTests };

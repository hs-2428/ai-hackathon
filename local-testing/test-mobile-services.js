/**
 * Test mobile app services locally
 */

// Mock AsyncStorage
const mockStorage = new Map();
global.AsyncStorage = {
  getItem: async (key) => mockStorage.get(key) || null,
  setItem: async (key, value) => mockStorage.set(key, value),
  removeItem: async (key) => mockStorage.delete(key)
};

// Mock axios
const mockAxios = {
  post: async (url, data) => {
    console.log(`📡 API Call: ${url}`);
    console.log(`📦 Data:`, JSON.stringify(data, null, 2));
    
    if (url.includes('/detect-language')) {
      return {
        data: {
          detection: {
            language: 'santali',
            confidence: 0.95,
            script: 'devanagari'
          }
        }
      };
    }
    
    if (url.includes('/cultural-assistant')) {
      return {
        data: {
          response: 'Post Matric Scholarship is available for tribal students. Apply through National Scholarship Portal.',
          language: data.language,
          sessionId: data.sessionId
        }
      };
    }
    
    if (url.includes('/text-to-speech')) {
      return {
        data: {
          audioUrl: 'https://mock-audio-url.com/audio.mp3',
          audioKey: 'mock-key',
          language: data.language
        }
      };
    }
    
    if (url.includes('/news')) {
      return {
        data: {
          news: [
            {
              id: 'news-1',
              title: 'New Scholarship Program',
              content: 'Government announces scholarships',
              adapted: {
                translatedTitle: 'नया छात्रवृत्ति कार्यक्रम',
                simplifiedContent: 'सरकार ने आदिवासी छात्रों के लिए नई छात्रवृत्ति की घोषणा की',
                culturalRelevance: 'This helps tribal students pursue higher education',
                relatedSchemes: 'Post Matric Scholarship, Pre Matric Scholarship'
              }
            }
          ]
        }
      };
    }
    
    return { data: {} };
  }
};

async function testAPIService() {
  console.log('\n🧪 Testing API Service...');
  console.log('='.repeat(50));
  
  // Mock environment
  process.env.API_GATEWAY_URL = 'https://mock-api.com/prod';
  
  // Create mock API service
  const APIService = {
    async detectLanguage(text) {
      const response = await mockAxios.post(
        `${process.env.API_GATEWAY_URL}/detect-language`,
        { text, sessionId: 'test-session' }
      );
      return response.data.detection;
    },
    
    async getCulturalResponse({ query, language, userId, sessionId }) {
      const response = await mockAxios.post(
        `${process.env.API_GATEWAY_URL}/cultural-assistant`,
        { query, language, userId, sessionId }
      );
      return response.data;
    },
    
    async getNews(language, limit = 10) {
      const response = await mockAxios.post(
        `${process.env.API_GATEWAY_URL}/news`,
        { language, limit }
      );
      return response.data.news;
    }
  };
  
  // Test language detection
  console.log('\n1️⃣ Testing Language Detection...');
  const detection = await APIService.detectLanguage('जोहार');
  console.log('✅ Detected:', detection.language, `(${detection.confidence})`);
  
  // Test cultural response
  console.log('\n2️⃣ Testing Cultural Response...');
  const response = await APIService.getCulturalResponse({
    query: 'What scholarships are available?',
    language: 'santali',
    userId: 'test-user',
    sessionId: 'test-session'
  });
  console.log('✅ Response:', response.response.substring(0, 80) + '...');
  
  // Test news
  console.log('\n3️⃣ Testing News Feed...');
  const news = await APIService.getNews('santali', 5);
  console.log('✅ News Count:', news.length);
  console.log('✅ First News:', news[0].title);
  
  return true;
}

async function testOfflineManager() {
  console.log('\n🧪 Testing Offline Manager...');
  console.log('='.repeat(50));
  
  // Mock SQLite
  const mockDB = {
    data: {
      responses: [],
      news: [],
      knowledge: []
    },
    
    async execAsync(sql) {
      console.log('📝 SQL Execute:', sql.substring(0, 50) + '...');
    },
    
    async runAsync(sql, params) {
      console.log('📝 SQL Run:', sql.substring(0, 50) + '...');
      if (sql.includes('INSERT INTO cached_responses')) {
        this.data.responses.push({ query: params[0], response: params[1] });
      }
    },
    
    async getFirstAsync(sql, params) {
      console.log('🔍 SQL Get:', sql.substring(0, 50) + '...');
      if (sql.includes('cached_responses')) {
        const match = this.data.responses.find(r => 
          r.query.includes(params[0].replace(/%/g, ''))
        );
        return match ? { response: match.response } : null;
      }
      return null;
    },
    
    async getAllAsync(sql, params) {
      console.log('🔍 SQL GetAll:', sql.substring(0, 50) + '...');
      return this.data.news;
    }
  };
  
  const OfflineManager = {
    db: mockDB,
    
    async initialize() {
      await this.db.execAsync('CREATE TABLE IF NOT EXISTS...');
      console.log('✅ Database initialized');
    },
    
    async cacheResponse(query, response, language) {
      await this.db.runAsync(
        'INSERT INTO cached_responses...',
        [query, response, language, Date.now()]
      );
      console.log('✅ Response cached');
    },
    
    async getOfflineResponse(query, language) {
      const result = await this.db.getFirstAsync(
        'SELECT response FROM cached_responses...',
        [query, language]
      );
      return result ? result.response : 'Offline response not found';
    }
  };
  
  // Test initialization
  console.log('\n1️⃣ Testing Initialization...');
  await OfflineManager.initialize();
  
  // Test caching
  console.log('\n2️⃣ Testing Response Caching...');
  await OfflineManager.cacheResponse(
    'scholarship',
    'Post Matric Scholarship available',
    'santali'
  );
  
  // Test retrieval
  console.log('\n3️⃣ Testing Offline Retrieval...');
  const cached = await OfflineManager.getOfflineResponse('scholarship', 'santali');
  console.log('✅ Retrieved:', cached);
  
  return true;
}

async function runAllTests() {
  console.log('\n🚀 Starting Mobile Services Tests...\n');
  
  const tests = [
    { name: 'API Service', fn: testAPIService },
    { name: 'Offline Manager', fn: testOfflineManager }
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
  });
  
  const passedCount = results.filter(r => r.passed).length;
  console.log(`\n✨ ${passedCount}/${results.length} tests passed\n`);
  
  return passedCount === results.length;
}

if (require.main === module) {
  runAllTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runAllTests };

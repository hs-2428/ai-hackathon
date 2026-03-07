/**
 * Mock Bedrock service for local testing
 * Simulates Claude 3.5 Sonnet responses
 */

class MockBedrock {
  constructor() {
    this.responses = {
      languageDetection: {
        'जोहार': { language: 'santali', confidence: 0.95, script: 'devanagari' },
        'hello': { language: 'english', confidence: 0.99, script: 'latin' },
        'नमस्ते': { language: 'hindi', confidence: 0.98, script: 'devanagari' }
      },
      culturalResponses: {
        'scholarship': 'Post Matric Scholarship for ST Students is available. You can apply through National Scholarship Portal. This provides financial assistance for tribal students pursuing higher education.',
        'health': 'Ayushman Bharat provides free health insurance up to ₹5 lakh for tribal families. Visit your nearest health center for enrollment.',
        'farming': 'PM-KISAN scheme provides ₹6000 per year to farmers. You can also get Soil Health Card and Kisan Credit Card. Contact your local agriculture office.'
      }
    };
  }

  async invokeModel(params) {
    const body = JSON.parse(params.body);
    const userMessage = body.messages[0].content.toLowerCase();

    let responseText = '';

    // Language detection
    if (userMessage.includes('detect') || userMessage.includes('identify')) {
      const textToDetect = userMessage.match(/"([^"]+)"/)?.[1] || 'hindi';
      const detection = this.responses.languageDetection[textToDetect] || 
        { language: 'hindi', confidence: 0.7, script: 'devanagari' };
      
      responseText = JSON.stringify({
        language: detection.language,
        languageCode: detection.language === 'santali' ? 'sat' : 'hi',
        confidence: detection.confidence,
        script: detection.script,
        culturalContext: detection.language === 'santali' ? 'Santali tribal community' : 'General'
      });
    }
    // News translation/adaptation
    else if (userMessage.includes('translate') && userMessage.includes('news')) {
      responseText = JSON.stringify({
        translatedTitle: 'नया छात्रवृत्ति कार्यक्रम',
        simplifiedContent: 'सरकार ने आदिवासी छात्रों के लिए नई छात्रवृत्ति की घोषणा की है। यह उच्च शिक्षा के लिए वित्तीय सहायता प्रदान करती है।',
        culturalRelevance: 'This scholarship helps tribal students pursue higher education and improve their livelihood',
        relatedSchemes: 'Post Matric Scholarship, Pre Matric Scholarship, National Fellowship'
      });
    }
    // Cultural responses
    else if (userMessage.includes('scholarship') || userMessage.includes('education')) {
      responseText = this.responses.culturalResponses.scholarship;
    }
    else if (userMessage.includes('health') || userMessage.includes('hospital')) {
      responseText = this.responses.culturalResponses.health;
    }
    else if (userMessage.includes('farm') || userMessage.includes('agriculture')) {
      responseText = this.responses.culturalResponses.farming;
    }
    else {
      responseText = 'I can help you with government schemes, health information, and agricultural support. Please ask specific questions about scholarships, health services, or farming assistance.';
    }

    return {
      body: Buffer.from(JSON.stringify({
        content: [{ text: responseText }]
      }))
    };
  }
}

module.exports = MockBedrock;

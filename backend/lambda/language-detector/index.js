const AWS = require('aws-sdk');
const bedrock = new AWS.BedrockRuntime();

// Tribal language patterns and identifiers
const TRIBAL_LANGUAGES = {
    'santali': { code: 'sat', script: ['devanagari', 'ol-chiki'], keywords: ['ᱚᱞ', 'ᱪᱤᱠᱤ', 'होड़'] },
    'gondi': { code: 'gon', script: ['devanagari'], keywords: ['गोंडी', 'कोया'] },
    'bhili': { code: 'bhi', script: ['devanagari'], keywords: ['भीली', 'भील'] },
    'kurukh': { code: 'kru', script: ['devanagari'], keywords: ['कुड़ुख', 'ओरांव'] },
    'munda': { code: 'unr', script: ['devanagari'], keywords: ['मुंडा', 'मुंडारी'] },
    'khasi': { code: 'kha', script: ['latin'], keywords: ['ka', 'ki', 'u', 'nga'] },
    'mizo': { code: 'lus', script: ['latin'], keywords: ['chu', 'hi', 'kan'] },
    'bodo': { code: 'brx', script: ['devanagari'], keywords: ['बड़ो', 'बर'] }
};

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event));
    
    try {
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { text, sessionId } = body;
        
        if (!text) {
            throw new Error('No text provided for detection');
        }

        // Use Bedrock Claude for language detection with cultural context
        // Using standard model ID if possible, fallback to cross-region if needed
        const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20240620-v1:0';
        
        const prompt = `Analyze this text and identify if it's from an Indian tribal language. 
Text: "${text}"

Available tribal languages: Santali, Gondi, Bhili, Kurukh, Munda, Khasi, Mizo, Bodo, Hindi, English.

Respond ONLY with a JSON object:
{
    "language": "detected language name (lowercase)",
    "languageCode": "ISO code",
    "confidence": 0.0-1.0,
    "script": "script used",
    "culturalContext": "brief cultural note if tribal language"
}`;

        const response = await bedrock.invokeModel({
            modelId: modelId,
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: 500,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        }).promise();
        
        const result = JSON.parse(Buffer.from(response.body).toString());
        const responseText = result.content[0].text.trim();
        
        // Extract JSON if Claude adds conversational text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const detectionResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);
        
        // Normalize language name to lowercase
        if (detectionResult.language) {
            detectionResult.language = detectionResult.language.toLowerCase();
        }
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                sessionId,
                detection: detectionResult,
                timestamp: Date.now()
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                error: error.message,
                detection: {
                    language: 'hindi',
                    confidence: 0.5,
                    error: true
                }
            })
        };
    }
};


const AWS = require('aws-sdk');
const bedrock = new AWS.BedrockRuntime();

// Tribal language patterns and identifiers
const TRIBAL_LANGUAGES = {
    'santali': { code: 'sat', script: ['devanagari', 'ol-chiki'], keywords: ['ᱚᱞ', 'ᱪᱤᱠᱤ', 'होड़'] },
    'gondi': { code: 'gon', script: ['devanagari'], keywords: ['गोंडी', 'कोया'] },
    'bhili': { code: 'bhi', script: ['devanagari'], keywords: ['भीली', 'भील'] },
    'kurukh': { code: 'kru', script: ['devanagari'], keywords: ['कुड़ुख', 'ओरांव'] },
    'khasi': { code: 'kha', script: ['latin'], keywords: ['ka', 'ki', 'u', 'nga'] },
    'mizo': { code: 'lus', script: ['latin'], keywords: ['chu', 'hi', 'kan'] },
    'bodo': { code: 'brx', script: ['devanagari'], keywords: ['बड़ो', 'बर'] }
};

exports.handler = async (event) => {
    try {
        const { text, sessionId } = JSON.parse(event.body);
        
        // Use Bedrock Claude for language detection with cultural context
        const prompt = `Analyze this text and identify if it's from an Indian tribal language. 
Text: "${text}"

Available tribal languages: Santali, Gondi, Bhili, Kurukh, Khasi, Mizo, Bodo, Hindi, English.

Respond in JSON format:
{
    "language": "detected language name",
    "languageCode": "ISO code",
    "confidence": 0.0-1.0,
    "script": "script used",
    "culturalContext": "brief cultural note if tribal language"
}`;

        const response = await bedrock.invokeModel({
            modelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
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
        const detectionResult = JSON.parse(result.content[0].text);
        
        return {
            statusCode: 200,
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
            body: JSON.stringify({ error: error.message })
        };
    }
};

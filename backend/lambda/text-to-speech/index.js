const AWS = require('aws-sdk');
const polly = new AWS.Polly();
const s3 = new AWS.S3();

// Language to Polly voice mapping
const VOICE_MAPPING = {
    'santali': { voiceId: 'Aditi', languageCode: 'hi-IN' }, // Using Hindi voice as fallback
    'gondi': { voiceId: 'Aditi', languageCode: 'hi-IN' },
    'bhili': { voiceId: 'Aditi', languageCode: 'hi-IN' },
    'kurukh': { voiceId: 'Aditi', languageCode: 'hi-IN' },
    'khasi': { voiceId: 'Aditi', languageCode: 'hi-IN' },
    'mizo': { voiceId: 'Aditi', languageCode: 'hi-IN' },
    'bodo': { voiceId: 'Aditi', languageCode: 'hi-IN' },
    'hindi': { voiceId: 'Aditi', languageCode: 'hi-IN' },
    'english': { voiceId: 'Kajal', languageCode: 'en-IN' }
};

exports.handler = async (event) => {
    try {
        const { text, language, sessionId, format = 'mp3' } = JSON.parse(event.body);
        
        const voiceConfig = VOICE_MAPPING[language.toLowerCase()] || VOICE_MAPPING['hindi'];
        
        // Generate speech using Polly
        const pollyParams = {
            Text: text,
            OutputFormat: format,
            VoiceId: voiceConfig.voiceId,
            LanguageCode: voiceConfig.languageCode,
            Engine: 'neural'
        };
        
        const audioStream = await polly.synthesizeSpeech(pollyParams).promise();
        
        // Store audio in S3
        const audioKey = `audio-output/${sessionId}/${Date.now()}.${format}`;
        await s3.putObject({
            Bucket: process.env.AUDIO_BUCKET,
            Key: audioKey,
            Body: audioStream.AudioStream,
            ContentType: `audio/${format}`
        }).promise();
        
        // Generate presigned URL for download
        const audioUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.AUDIO_BUCKET,
            Key: audioKey,
            Expires: 3600 // 1 hour
        });
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                audioUrl,
                audioKey,
                language,
                voiceId: voiceConfig.voiceId,
                duration: audioStream.AudioStream.length,
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

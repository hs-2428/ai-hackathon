const AWS = require('aws-sdk');
const transcribe = new AWS.TranscribeService();
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const { audioData, sessionId, userId } = JSON.parse(event.body);
        
        // Upload audio to S3
        const audioKey = `audio-input/${userId}/${sessionId}/${Date.now()}.wav`;
        await s3.putObject({
            Bucket: process.env.AUDIO_BUCKET,
            Key: audioKey,
            Body: Buffer.from(audioData, 'base64'),
            ContentType: 'audio/wav'
        }).promise();
        
        // Start transcription job with custom vocabulary for tribal languages
        const transcriptionJob = await transcribe.startTranscriptionJob({
            TranscriptionJobName: `tribal-${sessionId}-${Date.now()}`,
            LanguageCode: 'hi-IN', // Will be detected dynamically
            MediaFormat: 'wav',
            Media: {
                MediaFileUri: `s3://${process.env.AUDIO_BUCKET}/${audioKey}`
            },
            Settings: {
                VocabularyName: 'tribal-languages-vocab',
                ShowAlternatives: true,
                MaxAlternatives: 3
            }
        }).promise();
        
        // Log session
        await dynamodb.put({
            TableName: process.env.SESSIONS_TABLE,
            Item: {
                sessionId,
                userId,
                timestamp: Date.now(),
                audioKey,
                transcriptionJobName: transcriptionJob.TranscriptionJob.TranscriptionJobName,
                status: 'processing'
            }
        }).promise();
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                sessionId,
                transcriptionJobName: transcriptionJob.TranscriptionJob.TranscriptionJobName,
                status: 'processing'
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

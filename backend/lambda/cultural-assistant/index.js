const AWS = require('aws-sdk');
const bedrock = new AWS.BedrockRuntime();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const { query, language, userId, sessionId, culturalContext } = JSON.parse(event.body);
        
        // Fetch cultural knowledge base from S3
        const knowledgeBase = await s3.getObject({
            Bucket: process.env.KNOWLEDGE_BUCKET,
            Key: `cultural-kb/${language}/knowledge.json`
        }).promise();
        
        const culturalKnowledge = JSON.parse(knowledgeBase.Body.toString());
        
        // Get user history for context
        const userHistory = await dynamodb.query({
            TableName: process.env.SESSIONS_TABLE,
            KeyConditionExpression: 'userId = :uid',
            ExpressionAttributeValues: { ':uid': userId },
            Limit: 5,
            ScanIndexForward: false
        }).promise();
        
        // Build culturally-aware prompt
        const systemPrompt = `You are a helpful assistant for tribal communities in India. 
Language: ${language}
Cultural Context: ${culturalContext || 'General tribal community'}
Knowledge Base: ${JSON.stringify(culturalKnowledge.commonTopics)}

Provide responses that:
1. Respect cultural traditions and practices
2. Use simple, accessible language
3. Include relevant government schemes and benefits
4. Consider local context and needs
5. Provide practical, actionable information`;

        const response = await bedrock.invokeModel({
            modelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: 2000,
                system: systemPrompt,
                messages: [{
                    role: 'user',
                    content: query
                }]
            })
        }).promise();
        
        const result = JSON.parse(Buffer.from(response.body).toString());
        const assistantResponse = result.content[0].text;
        
        // Log interaction
        await dynamodb.put({
            TableName: process.env.INTERACTIONS_TABLE,
            Item: {
                interactionId: `${sessionId}-${Date.now()}`,
                userId,
                sessionId,
                timestamp: Date.now(),
                query,
                response: assistantResponse,
                language,
                culturalContext
            }
        }).promise();
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                response: assistantResponse,
                language,
                sessionId,
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

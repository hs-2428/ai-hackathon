const AWS = require('aws-sdk');
const bedrock = new AWS.BedrockRuntime();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const { language, category = 'general', userId, limit = 10 } = JSON.parse(event.body);
        
        // Fetch cached news from DynamoDB
        const cachedNews = await dynamodb.query({
            TableName: process.env.NEWS_TABLE,
            IndexName: 'language-timestamp-index',
            KeyConditionExpression: 'language = :lang',
            ExpressionAttributeValues: { ':lang': language },
            Limit: limit,
            ScanIndexForward: false
        }).promise();
        
        if (cachedNews.Items && cachedNews.Items.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    news: cachedNews.Items,
                    source: 'cache',
                    language
                })
            };
        }
        
        // Fetch latest news from S3 (pre-aggregated)
        const newsData = await s3.getObject({
            Bucket: process.env.NEWS_BUCKET,
            Key: `news-feed/${language}/latest.json`
        }).promise();
        
        const newsArticles = JSON.parse(newsData.Body.toString());
        
        // Translate and culturally adapt news using Bedrock
        const adaptedNews = await Promise.all(
            newsArticles.slice(0, limit).map(async (article) => {
                const translationPrompt = `Translate and culturally adapt this news for ${language} tribal community:

Title: ${article.title}
Content: ${article.content}

Provide:
1. Translated title
2. Simplified content (max 200 words)
3. Cultural relevance note
4. Related government schemes if applicable

Format as JSON.`;

                const response = await bedrock.invokeModel({
                    modelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
                    contentType: 'application/json',
                    accept: 'application/json',
                    body: JSON.stringify({
                        anthropic_version: 'bedrock-2023-05-31',
                        max_tokens: 1000,
                        messages: [{
                            role: 'user',
                            content: translationPrompt
                        }]
                    })
                }).promise();
                
                const result = JSON.parse(Buffer.from(response.body).toString());
                return {
                    ...article,
                    adapted: JSON.parse(result.content[0].text)
                };
            })
        );
        
        // Cache adapted news
        await Promise.all(
            adaptedNews.map(news => 
                dynamodb.put({
                    TableName: process.env.NEWS_TABLE,
                    Item: {
                        newsId: `${language}-${news.id}`,
                        language,
                        timestamp: Date.now(),
                        ...news,
                        ttl: Math.floor(Date.now() / 1000) + 86400 // 24 hours
                    }
                }).promise()
            )
        );
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                news: adaptedNews,
                source: 'fresh',
                language
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

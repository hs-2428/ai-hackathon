const AWS = require('aws-sdk');
const bedrock = new AWS.BedrockRuntime();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

// Sample news data for tribal languages
const sampleNews = {
    santali: [
        {
            id: 'news-1',
            title: 'संताली छात्रों के लिए विशेष छात्रवृत्ति',
            content: 'झारखंड सरकार ने संताली भाषा में पढ़ने वाले छात्रों के लिए विशेष छात्रवृत्ति योजना शुरू की है। संताली साहित्य और संस्कृति के अध्ययन के लिए 60,000 रुपये प्रति वर्ष मिलेगा।',
            category: 'शिक्षा',
            date: new Date().toLocaleDateString('hi-IN')
        },
        {
            id: 'news-2',
            title: 'सरहुल महोत्सव की तैयारी',
            content: 'संताली समुदाय के सबसे बड़े त्योहार सरहुल की तैयारियां शुरू हो गई हैं। इस बार राज्य सरकार द्वारा विशेष सांस्कृतिक कार्यक्रम आयोजित किए जाएंगे।',
            category: 'संस्कृति',
            date: new Date(Date.now() - 86400000).toLocaleDateString('hi-IN')
        },
        {
            id: 'news-3',
            title: 'संताली भाषा में स्वास्थ्य जागरूकता',
            content: 'संताली गांवों में संताली भाषा में स्वास्थ्य जागरूकता अभियान चलाया जा रहा है। मुफ्त स्वास्थ्य जांच और दवाई वितरण किया जाएगा।',
            category: 'स्वास्थ्य',
            date: new Date(Date.now() - 172800000).toLocaleDateString('hi-IN')
        }
    ],
    gondi: [
        {
            id: 'news-1',
            title: 'गोंडी भाषा संरक्षण योजना',
            content: 'मध्य प्रदेश सरकार ने गोंडी भाषा और लिपि के संरक्षण के लिए विशेष योजना शुरू की है। गोंडी भाषा के शिक्षकों को प्रशिक्षण दिया जाएगा।',
            category: 'भाषा',
            date: new Date().toLocaleDateString('hi-IN')
        },
        {
            id: 'news-2',
            title: 'गोंड आदिवासी कला प्रदर्शनी',
            content: 'गोंड चित्रकला की विशेष प्रदर्शनी का आयोजन किया जा रहा है। गोंड कलाकारों को राष्ट्रीय मंच पर प्रदर्शन का अवसर मिलेगा।',
            category: 'कला',
            date: new Date(Date.now() - 86400000).toLocaleDateString('hi-IN')
        },
        {
            id: 'news-3',
            title: 'गोंड गांवों में सौर ऊर्जा',
            content: 'गोंड बहुल गांवों में सौर ऊर्जा परियोजना शुरू की गई है। 500 गांवों में मुफ्त सोलर पैनल लगाए जाएंगे।',
            category: 'विकास',
            date: new Date(Date.now() - 172800000).toLocaleDateString('hi-IN')
        }
    ],
    bhili: [
        {
            id: 'news-1',
            title: 'भील समुदाय के लिए कौशल विकास',
            content: 'राजस्थान और गुजरात में भील युवाओं के लिए विशेष कौशल विकास केंद्र खोले गए हैं। पारंपरिक कला और आधुनिक तकनीक का प्रशिक्षण दिया जाएगा।',
            category: 'रोजगार',
            date: new Date().toLocaleDateString('hi-IN')
        },
        {
            id: 'news-2',
            title: 'भीली भाषा में शिक्षा सामग्री',
            content: 'प्राथमिक कक्षाओं के लिए भीली भाषा में पाठ्यपुस्तकें तैयार की गई हैं। भील बच्चों को मातृभाषा में शिक्षा मिलेगी।',
            category: 'शिक्षा',
            date: new Date(Date.now() - 86400000).toLocaleDateString('hi-IN')
        },
        {
            id: 'news-3',
            title: 'भील महिलाओं के लिए स्वरोजगार',
            content: 'भील महिलाओं को पारंपरिक हस्तशिल्प के लिए ऋण और प्रशिक्षण दिया जा रहा है। ऑनलाइन बाजार से जोड़ने की योजना है।',
            category: 'महिला सशक्तिकरण',
            date: new Date(Date.now() - 172800000).toLocaleDateString('hi-IN')
        }
    ],
    kurukh: [
        {
            id: 'news-1',
            title: 'कुड़ुख भाषा का डिजिटल संरक्षण',
            content: 'उरांव समुदाय की कुड़ुख भाषा के लिए डिजिटल शब्दकोश और ऐप विकसित किया गया है। युवा पीढ़ी को भाषा सीखने में मदद मिलेगी।',
            category: 'तकनीक',
            date: new Date().toLocaleDateString('hi-IN')
        },
        {
            id: 'news-2',
            title: 'उरांव समुदाय के लिए भूमि अधिकार',
            content: 'झारखंड में उरांव समुदाय को पारंपरिक भूमि के पट्टे दिए जा रहे हैं। 10,000 परिवारों को लाभ मिलेगा।',
            category: 'अधिकार',
            date: new Date(Date.now() - 86400000).toLocaleDateString('hi-IN')
        },
        {
            id: 'news-3',
            title: 'कुड़ुख संस्कृति महोत्सव',
            content: 'वार्षिक कुड़ुख संस्कृति महोत्सव का आयोजन किया जाएगा। पारंपरिक नृत्य, संगीत और खेलों का प्रदर्शन होगा।',
            category: 'संस्कृति',
            date: new Date(Date.now() - 172800000).toLocaleDateString('hi-IN')
        }
    ],
    munda: [
        {
            id: 'news-1',
            title: 'बिरसा मुंडा जयंती समारोह',
            content: 'बिरसा मुंडा जयंती पर विशेष कार्यक्रम आयोजित किए जाएंगे। मुंडा युवाओं को छात्रवृत्ति और सम्मान दिया जाएगा।',
            category: 'समारोह',
            date: new Date().toLocaleDateString('hi-IN')
        },
        {
            id: 'news-2',
            title: 'मुंडारी भाषा का संरक्षण',
            content: 'मुंडारी भाषा के लिए विशेष शिक्षण केंद्र खोले गए हैं। भाषा और संस्कृति को जीवित रखने के प्रयास किए जा रहे हैं।',
            category: 'भाषा',
            date: new Date(Date.now() - 86400000).toLocaleDateString('hi-IN')
        },
        {
            id: 'news-3',
            title: 'मुंडा गांवों में जल संरक्षण',
            content: 'मुंडा गांवों में पारंपरिक जल संरक्षण तकनीकों को पुनर्जीवित किया जा रहा है। सरकार द्वारा तालाब और कुओं का जीर्णोद्धार किया जाएगा।',
            category: 'पर्यावरण',
            date: new Date(Date.now() - 172800000).toLocaleDateString('hi-IN')
        }
    ],
    khasi: [
        {
            id: 'news-1',
            title: 'Khasi Language Day Celebration',
            content: 'Celebration of Khasi language and culture in Shillong with various events.',
            category: 'Culture',
            date: new Date().toLocaleDateString()
        }
    ],
    mizo: [
        {
            id: 'news-1',
            title: 'Mizo Cultural Festival',
            content: 'Annual Mizo cultural festival showcasing traditional dance and music.',
            category: 'Festival',
            date: new Date().toLocaleDateString()
        }
    ],
    bodo: [
        {
            id: 'news-1',
            title: 'Bodo Literature Award',
            content: 'Bodo writers honored for their contribution to Bodo literature.',
            category: 'Literature',
            date: new Date().toLocaleDateString()
        }
    ],
    hindi: [
        {
            id: 'news-1',
            title: 'नई छात्रवृत्ति योजना की घोषणा',
            content: 'सरकार ने आदिवासी छात्रों के लिए उच्च शिक्षा हेतु नई छात्रवृत्ति योजना की घोषणा की है। प्रति वर्ष 50,000 रुपये तक की वित्तीय सहायता प्रदान की जाएगी।',
            category: 'शिक्षा',
            date: new Date().toLocaleDateString('hi-IN')
        },
        {
            id: 'news-2',
            title: 'वन अधिकार अधिनियम का कार्यान्वयन',
            content: 'जिला प्रशासन ने वन अधिकार अधिनियम के तहत नए आवेदन स्वीकार करना शुरू कर दिया है। आदिवासी समुदाय अपनी पारंपरिक वन भूमि के अधिकारों का दावा कर सकते हैं।',
            category: 'अधिकार',
            date: new Date(Date.now() - 86400000).toLocaleDateString('hi-IN')
        },
        {
            id: 'news-3',
            title: 'मुफ्त स्वास्थ्य जांच शिविर',
            content: 'अगले सप्ताह आदिवासी गांवों में मुफ्त स्वास्थ्य जांच शिविर का आयोजन किया जाएगा। आयुष्मान भारत योजना के तहत मुफ्त इलाज की सुविधा उपलब्ध होगी।',
            category: 'स्वास्थ्य',
            date: new Date(Date.now() - 172800000).toLocaleDateString('hi-IN')
        }
    ],
    english: [
        {
            id: 'news-1',
            title: 'New Scholarship Program Announced',
            content: 'The government has announced a new scholarship program for tribal students pursuing higher education. Financial assistance up to Rs.50,000 per year will be provided.',
            category: 'Education',
            date: new Date().toLocaleDateString('en-US')
        },
        {
            id: 'news-2',
            title: 'Forest Rights Act Implementation',
            content: 'District administration has started accepting new applications under the Forest Rights Act. Tribal communities can now claim their traditional forest land rights.',
            category: 'Rights',
            date: new Date(Date.now() - 86400000).toLocaleDateString('en-US')
        },
        {
            id: 'news-3',
            title: 'Free Health Checkup Camp',
            content: 'A free health checkup camp will be organized in tribal villages next week. Free treatment under Ayushman Bharat scheme will be available.',
            category: 'Health',
            date: new Date(Date.now() - 172800000).toLocaleDateString('en-US')
        }
    ]
};

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event));

    try {
        // Handle both GET and POST requests
        let language, category, limit;

        if (event.httpMethod === 'GET' || event.requestContext?.http?.method === 'GET') {
            language = event.queryStringParameters?.language || 'santali';
            category = event.queryStringParameters?.category || 'general';
            limit = parseInt(event.queryStringParameters?.limit || '10');
        } else {
            const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
            language = body.language || 'santali';
            category = body.category || 'general';
            limit = body.limit || 10;
        }

        console.log('Fetching news for language:', language);

        // Try to fetch from DynamoDB cache first
        try {
            const cachedNews = await dynamodb.query({
                TableName: process.env.NEWS_TABLE,
                IndexName: 'language-timestamp-index',
                KeyConditionExpression: 'language = :lang',
                ExpressionAttributeValues: { ':lang': language },
                Limit: limit,
                ScanIndexForward: false
            }).promise();

            if (cachedNews.Items && cachedNews.Items.length > 0) {
                console.log('Returning cached news');
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({
                        articles: cachedNews.Items,
                        news: cachedNews.Items,
                        source: 'cache',
                        language
                    })
                };
            }
        } catch (err) {
            console.log('Cache miss or error:', err.message);
        }

        // Try to fetch from S3
        try {
            const newsData = await s3.getObject({
                Bucket: process.env.NEWS_BUCKET,
                Key: `sample-news/${language}-news.json`
            }).promise();

            const newsArticles = JSON.parse(newsData.Body.toString());
            console.log('Returning S3 news');

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    articles: newsArticles.slice(0, limit),
                    news: newsArticles.slice(0, limit),
                    source: 's3',
                    language
                })
            };
        } catch (err) {
            console.log('S3 fetch failed:', err.message);
        }

        // Fallback to sample news
        const news = sampleNews[language] || sampleNews.hindi;
        console.log('Returning sample news');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                articles: news.slice(0, limit),
                news: news.slice(0, limit),
                source: 'sample',
                language
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                error: error.message,
                articles: [],
                news: []
            })
        };
    }
};

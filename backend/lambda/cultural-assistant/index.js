const AWS = require('aws-sdk');
const bedrock = new AWS.BedrockRuntime();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

// Rich cultural knowledge responses for tribal languages
const culturalResponses = {
    santali: {
        scholarship: 'संताली छात्रन खातिर पोस्ट मैट्रिक छात्रवृत्ति मिलेला। राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) पर आवेदन करीं। ऊंच पढ़ाई खातिर 50,000 रुपिया साल भर मिलेगा। संताली भाषा अउ संस्कृति के पढ़ाई खातिर विशेष छात्रवृत्ति भी हवय।',
        health: 'आयुष्मान भारत योजना म संताली परिवारन ला 5 लाख रुपिया तक मुफ्त इलाज मिलथे। नजदीक के स्वास्थ्य केंद्र म नाम लिखावीं। संताली गांवन म विशेष स्वास्थ्य शिविर लगथे।',
        farming: 'पीएम-किसान योजना म संताली किसानन ला 6,000 रुपिया साल भर मिलथे। कृषि कार्यालय म पंजीकरण करावीं। जंगल के उपज खातिर न्यूनतम समर्थन मूल्य भी मिलथे।',
        default: 'हम संताली समुदाय खातिर सरकारी योजना, स्वास्थ्य, पढ़ाई, खेती, अधिकार, राशन, शिकायत अउ संस्कृति के जानकारी दे सकत हन। अपन सवाल पूछीं।'
    },
    gondi: {
        scholarship: 'गोंडी विद्यार्थियन खातिर पोस्ट मैट्रिक छात्रवृत्ति मिलथे। राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) म आवेदन करव। ऊंच पढ़ाई खातिर 50,000 रुपिया हर साल मिलही।',
        health: 'आयुष्मान भारत योजना म गोंडी परिवारन ला 5 लाख रुपिया तक मुफ्त इलाज मिलथे। नजदीक के स्वास्थ्य केंद्र म नाम लिखाव।',
        farming: 'पीएम-किसान योजना म गोंडी किसानन ला 6,000 रुपिया साल भर मिलथे। कृषि कार्यालय म पंजीकरण कराव।',
        default: 'हम गोंडी समुदाय खातिर सरकारी योजना, स्वास्थ्य, पढ़ाई, खेती, अधिकार के जानकारी दे सकत हन।'
    },
    bhili: {
        scholarship: 'भील विद्यार्थियन खातिर पोस्ट मैट्रिक छात्रवृत्ति मिलै। राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) पर आवेदन करो। ऊंची पढ़ाई खातिर 50,000 रुपिया हर साल मिलैगो।',
        health: 'आयुष्मान भारत योजना म भील परिवारन नै 5 लाख रुपिया तक मुफ्त इलाज मिलै। नजदीकी स्वास्थ्य केंद्र म नाम लिखावो।',
        farming: 'पीएम-किसान योजना म भील किसानन नै 6,000 रुपिया साल भर मिलै। कृषि कार्यालय म पंजीकरण करावो।',
        default: 'हम भील समुदाय खातिर सरकारी योजना, स्वास्थ्य, पढ़ाई, खेती, अधिकार की जानकारी दे सकत हां।'
    },
    kurukh: {
        scholarship: 'उरांव विद्यार्थियन खातिर पोस्ट मैट्रिक छात्रवृत्ति मिलेला। राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) पर आवेदन करीं। ऊंच पढ़ाई खातिर 50,000 रुपिया साल भर मिलेगा।',
        health: 'आयुष्मान भारत योजना म उरांव परिवारन ला 5 लाख रुपिया तक मुफ्त इलाज मिलथे। नजदीक के स्वास्थ्य केंद्र म नाम लिखावीं।',
        farming: 'पीएम-किसान योजना म उरांव किसानन ला 6,000 रुपिया साल भर मिलथे। कृषि कार्यालय म पंजीकरण करावीं।',
        default: 'हम उरांव समुदाय खातिर सरकारी योजना, स्वास्थ्य, पढ़ाई, खेती, अधिकार के जानकारी दे सकत हन।'
    },
    munda: {
        scholarship: 'मुंडा विद्यार्थियन खातिर पोस्ट मैट्रिक छात्रवृत्ति मिलेला। राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) पर आवेदन करीं। ऊंच पढ़ाई खातिर 50,000 रुपिया साल भर मिलेगा।',
        health: 'आयुष्मान भारत योजना म मुंडा परिवारन ला 5 लाख रुपिया तक मुफ्त इलाज मिलथे। नजदीक के स्वास्थ्य केंद्र म नाम लिखावीं।',
        farming: 'पीएम-किसान योजना म मुंडा किसानन ला 6,000 रुपिया साल भर मिलथे। कृषि कार्यालय म पंजीकरण करावीं।',
        default: 'हम मुंडा समुदाय खातिर सरकारी योजना, स्वास्थ्य, पढ़ाई, खेती, अधिकार के जानकारी दे सकत हन।'
    },
    khasi: {
        scholarship: 'Ka scholarship bar ka pule puthi na ka bynta ki khynnah tribal. Phi lah ban apply ha ka National Scholarship Portal.',
        health: 'Ka Ayushman Bharat ka ai jingsumar ei haduh 5 lak tyngka na ka bynta ki longiing tribal.',
        farming: 'Ka PM-KISAN ka ai jingiarap pisa 6,000 tyngka shisnem ia ki nongrep.',
        default: 'Ngi lah ban iarap ia phi shaphang ki skhim sorkar, ka pule puthi, ka koit ka khiah bad kiwei.'
    },
    mizo: {
        scholarship: 'ST zirlaite tana scholarship a awm a. National Scholarship Portal-ah dil theih a ni.',
        health: 'Ayushman Bharat hian ST chhungkuate tan nuai 5 thleng thlawna inenkawlna a pe a ni.',
        farming: 'PM-KISAN hian loneitute hnenah kum khatah Rs. 6,000 a pe thin a ni.',
        default: 'Sawrkar scheme, zirna, hriselna leh loneih chungchangahte kan tanpui thei che u a ni.'
    },
    bodo: {
        scholarship: 'ST फरायसाफोरनि थाखाय पोस्ट मेट्रिक स्कलारसिप दं। बेनि थाखाय गौथुमनि पोर्टल (scholarships.gov.in) आव आरज गाबनांगोन।',
        health: 'आयुष्मान भारत बिथांखिनि सिङाव ५ लाख रां सिम नाहारनायनि सुबिदा दं।',
        farming: 'पीएम-किसान बिथांखिनि सिङाव फरायसाफोरनो बोसोरसेयाव ६,००० रां होनाय जायो।',
        default: 'जों फरायसा, सुजुनाय, गेलेनाय आरो हारिमुनि सोमोन्दै मिथिनो हागोन।'
    },
    hindi: {
        scholarship: 'अनुसूचित जनजाति छात्रों के लिए पोस्ट मैट्रिक छात्रवृत्ति उपलब्ध है। राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) पर आवेदन करें। उच्च शिक्षा के लिए 50,000 रुपये प्रति वर्ष की वित्तीय सहायता मिलती है।',
        health: 'आयुष्मान भारत योजना में आदिवासी परिवारों को 5 लाख रुपये तक का मुफ्त स्वास्थ्य बीमा मिलता है। नजदीकी स्वास्थ्य केंद्र में पंजीकरण कराएं।',
        farming: 'पीएम-किसान योजना में किसानों को 6,000 रुपये प्रति वर्ष मिलते हैं। स्थानीय कृषि कार्यालय में पंजीकरण कराएं या pmkisan.gov.in पर जाएं।',
        default: 'मैं सरकारी योजनाओं, स्वास्थ्य सेवाओं, शिक्षा छात्रवृत्ति, कृषि सहायता, अधिकार के बारे में जानकारी दे सकता हूं।'
    },
    english: {
        scholarship: 'Post Matric Scholarship for Scheduled Tribe students is available. Apply through National Scholarship Portal (scholarships.gov.in). Financial assistance up to Rs.50,000 per year is provided for higher education.',
        health: 'Ayushman Bharat scheme provides free health insurance up to Rs.5 lakh for tribal families. Visit your nearest health center for enrollment.',
        farming: 'PM-KISAN scheme provides Rs.6,000 per year to farmers. Register at your local agriculture office or visit pmkisan.gov.in.',
        default: 'I can help you with information about government schemes, health services, education scholarships, agricultural support, and tribal rights.'
    }
};

function getQuickResponse(query, language) {
    const q = query.toLowerCase();
    const responses = culturalResponses[language] || culturalResponses.hindi;

    if (q.includes('scholarship') || q.includes('छात्रवृत्ति') || q.includes('education') || q.includes('शिक्षा') || q.includes('student')) {
        return responses.scholarship;
    } else if (q.includes('health') || q.includes('स्वास्थ्य') || q.includes('hospital') || q.includes('doctor') || q.includes('ayushman')) {
        return responses.health;
    } else if (q.includes('farm') || q.includes('खेती') || q.includes('agriculture') || q.includes('किसान') || q.includes('kisan')) {
        return responses.farming;
    }

    return null;
}

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event));

    try {
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { query, question, language, userId, sessionId, culturalContext } = body;

        const userQuery = query || question || '';
        const userLanguage = (language || 'hindi').toLowerCase();
        const user = userId || 'anonymous-' + Date.now();
        const session = sessionId || 'session-' + Date.now();

        console.log('Query:', userQuery, 'Language:', userLanguage);

        // Try quick response first
        const quickResponse = getQuickResponse(userQuery, userLanguage);
        if (quickResponse) {
            console.log('Using quick response');
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    response: quickResponse,
                    answer: quickResponse,
                    language: userLanguage,
                    sessionId: session,
                    timestamp: Date.now(),
                    source: 'quick-response'
                })
            };
        }

        // Fetch cultural knowledge base from S3 if available
        let culturalKnowledge = {};
        try {
            const knowledgeBase = await s3.getObject({
                Bucket: process.env.KNOWLEDGE_BUCKET,
                Key: `cultural-knowledge/${userLanguage}/knowledge.json`
            }).promise();
            culturalKnowledge = JSON.parse(knowledgeBase.Body.toString());
        } catch (err) {
            console.log('No cultural knowledge found, using defaults');
        }

        // Build culturally-aware prompt
        const systemPrompt = `You are a helpful assistant for tribal communities in India. 
Language: ${userLanguage}
Cultural Context: ${culturalContext || 'General tribal community'}

Provide responses that:
1. Respect cultural traditions and practices
2. Use simple, accessible language in ${userLanguage}
3. Include relevant government schemes and benefits
4. Consider local context and needs
5. Provide practical, actionable information
6. Keep responses concise (max 200 words)`;

        const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20240620-v1:0';

        const response = await bedrock.invokeModel({
            modelId: modelId,
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: 1000,
                system: systemPrompt,
                messages: [{
                    role: 'user',
                    content: userQuery
                }]
            })
        }).promise();

        const result = JSON.parse(Buffer.from(response.body).toString());
        const assistantResponse = result.content[0].text;

        // Log interaction
        try {
            await dynamodb.put({
                TableName: process.env.INTERACTIONS_TABLE,
                Item: {
                    interactionId: `${session}-${Date.now()}`,
                    userId: user,
                    sessionId: session,
                    timestamp: Date.now(),
                    query: userQuery,
                    response: assistantResponse,
                    language: userLanguage,
                    culturalContext,
                    ttl: Math.floor(Date.now() / 1000) + 2592000 // 30 days
                }
            }).promise();
        } catch (err) {
            console.log('Failed to log interaction:', err);
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
                response: assistantResponse,
                answer: assistantResponse,
                language: userLanguage,
                sessionId: session,
                timestamp: Date.now(),
                source: 'bedrock-ai'
            })
        };
    } catch (error) {
        console.error('Error:', error);

        // Fallback response
        const fallbackResponses = culturalResponses[(event.body?.language || 'hindi').toLowerCase()] || culturalResponses.hindi;
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                response: fallbackResponses.default,
                answer: fallbackResponses.default,
                language: event.body?.language || 'hindi',
                error: error.message,
                source: 'fallback'
            })
        };
    }
};


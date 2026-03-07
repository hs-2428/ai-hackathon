const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 3002;

const culturalKnowledge = {
  santali: {
    governmentSchemes: [
      {
        name: 'Post Matric Scholarship for ST Students',
        benefit: 'Financial assistance up to Rs.50,000 per year for higher education',
        howToApply: 'Apply through National Scholarship Portal (scholarships.gov.in)',
        eligibility: 'Santali students pursuing post-matriculation studies'
      }
    ]
  }
};

const newsData = {
  santali: [
    {
      id: 'news-1',
      title: 'संताली छात्रों के लिए विशेष छात्रवृत्ति',
      content: 'झारखंड सरकार ने संताली भाषा में पढ़ने वाले छात्रों के लिए विशेष छात्रवृत्ति योजना शुरू की है। संताली साहित्य और संस्कृति के अध्ययन के लिए 60,000 रुपये प्रति वर्ष मिलेगा।',
      category: 'संताली समुदाय',
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
      category: 'गोंड समुदाय',
      date: new Date().toLocaleDateString('hi-IN')
    },
    {
      id: 'news-2',
      title: 'गोंड आदिवासी कला प्रदर्शनी',
      content: 'गोंड चित्रकला की विशेष प्रदर्शनी का आयोजन किया जा रहा है। गोंड कलाकारों को राष्ट्रीय मंच पर प्रदर्शन का अवसर मिलेगा।',
      category: 'कला और संस्कृति',
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
      category: 'भील समुदाय',
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
      category: 'उरांव समुदाय',
      date: new Date().toLocaleDateString('hi-IN')
    },
    {
      id: 'news-2',
      title: 'उरांव समुदाय के लिए भूमि अधिकार',
      content: 'झारखंड में उरांव समुदाय को पारंपरिक भूमि के पट्टे दिए जा रहे हैं। 10,000 परिवारों को लाभ मिलेगा।',
      category: 'भूमि अधिकार',
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
      title: 'मुंडा समुदाय के नायक बिरसा मुंडा जयंती',
      content: 'बिरसा मुंडा जयंती पर विशेष कार्यक्रम आयोजित किए जाएंगे। मुंडा युवाओं को छात्रवृत्ति और सम्मान दिया जाएगा।',
      category: 'मुंडा समुदाय',
      date: new Date().toLocaleDateString('hi-IN')
    },
    {
      id: 'news-2',
      title: 'मुंडारी भाषा का संरक्षण',
      content: 'मुंडारी भाषा के लिए विशेष शिक्षण केंद्र खोले गए हैं। भाषा और संस्कृति को जीवित रखने के प्रयास किए जा रहे हैं।',
      category: 'भाषा संरक्षण',
      date: new Date(Date.now() - 86400000).toLocaleDateString('hi-IN')
    },
    {
      id: 'news-3',
      title: 'मुंडा गांवों में जल संरक्षण',
      content: 'मुंडा गांवों में पारंपरिक जल संरक्षण तकनीकों को पुनर्जीवित किया जा रहा है। सरकार द्वारा तालाब और कुओं का जीर्णोद्धार किया जाएगा।',
      category: 'जल संरक्षण',
      date: new Date(Date.now() - 172800000).toLocaleDateString('hi-IN')
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

const responses = {
  santali: {
    scholarship: 'संताली छात्रन खातिर पोस्ट मैट्रिक छात्रवृत्ति मिलेला। राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) पर आवेदन करीं। ऊंच पढ़ाई खातिर 50,000 रुपिया साल भर मिलेगा। संताली भाषा अउ संस्कृति के पढ़ाई खातिर विशेष छात्रवृत्ति भी हवय।',
    health: 'आयुष्मान भारत योजना म संताली परिवारन ला 5 लाख रुपिया तक मुफ्त इलाज मिलथे। नजदीक के स्वास्थ्य केंद्र म नाम लिखावीं। संताली गांवन म विशेष स्वास्थ्य शिविर लगथे।',
    farming: 'पीएम-किसान योजना म संताली किसानन ला 6,000 रुपिया साल भर मिलथे। कृषि कार्यालय म पंजीकरण करावीं। जंगल के उपज खातिर न्यूनतम समर्थन मूल्य भी मिलथे।',
    sarhul: 'सरहुल संताली समुदाय के सबसे बड़ा त्योहार हवय। ये वसंत ऋतु म साल वृक्ष के पूजा के साथ मनाए जाथे। गांव के सब लोग मिलके नाचथे अउ गाथे। ये प्रकृति के प्रति आभार व्यक्त करे के त्योहार हवय।',
    forest: 'वन अधिकार कानून के तहत संताली समुदाय अपन पुरखा के जमीन के दावा कर सकथे। जिला कार्यालय म आवेदन देवीं। जंगल के उपज इकट्ठा करे अउ बेचे के अधिकार मिलथे।',
    ration: 'राशन कार्ड खातिर तहसील कार्यालय म आवेदन करीं। संताली परिवारन ला प्राथमिकता मिलथे। अंत्योदय योजना म 35 किलो अनाज मुफ्त मिलथे।',
    schemes: 'संताली समुदाय खातिर मुख्य योजना: पोस्ट मैट्रिक छात्रवृत्ति, आयुष्मान भारत, पीएम-किसान, वन अधिकार, आवास योजना, स्वच्छ भारत। सब योजना के जानकारी खातिर ग्राम पंचायत या जिला कार्यालय जावीं।',
    rights: 'संताली समुदाय के अधिकार: वन भूमि अधिकार, पंचायत में आरक्षण, मातृभाषा में शिक्षा, सांस्कृतिक संरक्षण, रोजगार में आरक्षण। संविधान की पांचवीं अनुसूची म विशेष सुरक्षा मिलथे।',
    complaint: 'शिकायत दर्ज करे खातिर: जिला कलेक्टर कार्यालय, आदिवासी कल्याण विभाग, या ऑनलाइन pgportal.gov.in पर जावीं। टोल फ्री नंबर 1800-111-555 पर भी शिकायत कर सकत हीं।',
    politics: 'संताली समुदाय के राजनीतिक अधिकार: लोकसभा अउ विधानसभा म आरक्षित सीट, पंचायत म आरक्षण, मतदान के अधिकार। अपन मतदाता पहचान पत्र बनवावीं अउ चुनाव म जरूर वोट देवीं।',
    news: 'ताजा खबर: भारत में G20 शिखर सम्मेलन सफल रहा। नई शिक्षा नीति में आदिवासी भाषाओं को प्राथमिकता। जलवायु परिवर्तन पर वैश्विक सम्मेलन में भारत की भागीदारी। डिजिटल इंडिया से ग्रामीण क्षेत्रों में इंटरनेट विस्तार।',
    default: 'हम संताली समुदाय खातिर सरकारी योजना, स्वास्थ्य, पढ़ाई, खेती, अधिकार, राशन, शिकायत अउ संस्कृति के जानकारी दे सकत हन। अपन सवाल पूछीं।'
  },
  gondi: {
    scholarship: 'गोंडी विद्यार्थियन खातिर पोस्ट मैट्रिक छात्रवृत्ति मिलथे। राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) म आवेदन करव। ऊंच पढ़ाई खातिर 50,000 रुपिया हर साल मिलही। गोंड समुदाय के छात्रन ला प्राथमिकता दिए जाथे।',
    health: 'आयुष्मान भारत योजना म गोंडी परिवारन ला 5 लाख रुपिया तक मुफ्त इलाज मिलथे। नजदीक के स्वास्थ्य केंद्र म नाम लिखाव। गोंड इलाका म खास स्वास्थ्य शिविर लगथे।',
    farming: 'पीएम-किसान योजना म गोंडी किसानन ला 6,000 रुपिया साल भर मिलथे। कृषि कार्यालय म पंजीकरण कराव। जंगल के उपज खातिर न्यूनतम समर्थन मूल्य भी मिलथे।',
    festival: 'गोंड समुदाय के मुख्य त्योहार बीज पंडुम, नवाखानी अउ दशहरा हवय। ये सब प्रकृति अउ खेती से जुड़े त्योहार हवय। पूरा गांव मिलके मनाथे। गोंड चित्रकला अउ नृत्य के प्रदर्शन होथे।',
    forest: 'वन अधिकार कानून के तहत गोंडी समुदाय अपन पुरखा के जमीन के दावा कर सकथे। जिला कार्यालय म आवेदन देव। जंगल के उपज इकट्ठा करे अउ बेचे के अधिकार मिलथे।',
    ration: 'राशन कार्ड खातिर तहसील कार्यालय म आवेदन करव। गोंड परिवारन ला प्राथमिकता मिलथे। अंत्योदय योजना म 35 किलो अनाज मुफ्त मिलथे।',
    schemes: 'गोंड समुदाय खातिर मुख्य योजना: पोस्ट मैट्रिक छात्रवृत्ति, आयुष्मान भारत, पीएम-किसान, वन अधिकार, आवास योजना, कौशल विकास। सब योजना के जानकारी खातिर ग्राम पंचायत या जिला कार्यालय जाव।',
    rights: 'गोंड समुदाय के अधिकार: वन भूमि अधिकार, पंचायत में आरक्षण, मातृभाषा में शिक्षा, सांस्कृतिक संरक्षण, रोजगार में आरक्षण। संविधान की पांचवीं अनुसूची म विशेष सुरक्षा मिलथे।',
    complaint: 'शिकायत दर्ज करे खातिर: जिला कलेक्टर कार्यालय, आदिवासी कल्याण विभाग, या ऑनलाइन pgportal.gov.in पर जाव। टोल फ्री नंबर 1800-111-555 पर भी शिकायत कर सकत हव।',
    politics: 'गोंड समुदाय के राजनीतिक अधिकार: लोकसभा अउ विधानसभा म आरक्षित सीट, पंचायत म आरक्षण, मतदान के अधिकार। अपन मतदाता पहचान पत्र बनवाव अउ चुनाव म जरूर वोट देव।',
    news: 'ताजा खबर: भारत में G20 शिखर सम्मेलन सफल रहा। नई शिक्षा नीति में आदिवासी भाषाओं को प्राथमिकता। जलवायु परिवर्तन पर वैश्विक सम्मेलन में भारत की भागीदारी। डिजिटल इंडिया से ग्रामीण क्षेत्रों में इंटरनेट विस्तार।',
    default: 'हम गोंडी समुदाय खातिर सरकारी योजना, स्वास्थ्य, पढ़ाई, खेती, अधिकार, राशन अउ संस्कृति के जानकारी दे सकत हन। अपन सवाल पूछव।'
  },
  bhili: {
    scholarship: 'भील विद्यार्थियन खातिर पोस्ट मैट्रिक छात्रवृत्ति मिलै। राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) पर आवेदन करो। ऊंची पढ़ाई खातिर 50,000 रुपिया हर साल मिलैगो। भील समुदाय के छात्रन नै प्राथमिकता मिलै।',
    health: 'आयुष्मान भारत योजना म भील परिवारन नै 5 लाख रुपिया तक मुफ्त इलाज मिलै। नजदीक के स्वास्थ्य केंद्र म नाम लिखावो। भील गांवन म खास स्वास्थ्य शिविर लगै।',
    farming: 'पीएम-किसान योजना म भील किसानन नै 6,000 रुपिया साल भर मिलै। कृषि कार्यालय म पंजीकरण करावो। जंगल की उपज खातिर न्यूनतम समर्थन मूल्य भी मिलै।',
    festival: 'भील समुदाय के मुख्य त्योहार होली, दिवाली अउ भगोरिया हवै। भगोरिया म युवा लोग मिलै अउ पारंपरिक नृत्य करै। ये भील संस्कृति को खास त्योहार हवै।',
    forest: 'वन अधिकार कानून के तहत भील समुदाय अपनी पुरखन की जमीन को दावा कर सकै। जिला कार्यालय म आवेदन दो। जंगल की उपज इकट्ठा करने अउ बेचने को अधिकार मिलै।',
    ration: 'राशन कार्ड खातिर तहसील कार्यालय म आवेदन करो। भील परिवारन नै प्राथमिकता मिलै। अंत्योदय योजना म 35 किलो अनाज मुफ्त मिलै।',
    schemes: 'भील समुदाय खातिर मुख्य योजना: पोस्ट मैट्रिक छात्रवृत्ति, आयुष्मान भारत, पीएम-किसान, वन अधिकार, आवास योजना, कौशल विकास। सब योजना की जानकारी खातिर ग्राम पंचायत या जिला कार्यालय जाओ।',
    rights: 'भील समुदाय के अधिकार: वन भूमि अधिकार, पंचायत में आरक्षण, मातृभाषा में शिक्षा, सांस्कृतिक संरक्षण, रोजगार में आरक्षण। संविधान की पांचवीं अनुसूची म विशेष सुरक्षा मिलै।',
    complaint: 'शिकायत दर्ज करे खातिर: जिला कलेक्टर कार्यालय, आदिवासी कल्याण विभाग, या ऑनलाइन pgportal.gov.in पर जाओ। टोल फ्री नंबर 1800-111-555 पर भी शिकायत कर सकत हो।',
    politics: 'भील समुदाय के राजनीतिक अधिकार: लोकसभा अउ विधानसभा म आरक्षित सीट, पंचायत म आरक्षण, मतदान के अधिकार। अपनो मतदाता पहचान पत्र बनवाओ अउ चुनाव म जरूर वोट दो।',
    news: 'ताजा खबर: भारत में G20 शिखर सम्मेलन सफल रहा। नई शिक्षा नीति में आदिवासी भाषाओं को प्राथमिकता। जलवायु परिवर्तन पर वैश्विक सम्मेलन में भारत की भागीदारी। डिजिटल इंडिया से ग्रामीण क्षेत्रों में इंटरनेट विस्तार।',
    default: 'हम भील समुदाय खातिर सरकारी योजना, स्वास्थ्य, पढ़ाई, खेती, अधिकार, राशन अउ संस्कृति की जानकारी दे सकत हां। अपनो सवाल पूछो।'
  },
  kurukh: {
    scholarship: 'उरांव विद्यार्थियन खातिर पोस्ट मैट्रिक छात्रवृत्ति मिलेला। राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) पर आवेदन करीं। ऊंच पढ़ाई खातिर 50,000 रुपिया साल भर मिलेगा। कुड़ुख भाषा के संरक्षण खातिर विशेष योजना हवय।',
    health: 'आयुष्मान भारत योजना म उरांव परिवारन ला 5 लाख रुपिया तक मुफ्त इलाज मिलथे। नजदीक के स्वास्थ्य केंद्र म नाम लिखावीं। उरांव गांवन म विशेष स्वास्थ्य शिविर लगथे।',
    farming: 'पीएम-किसान योजना म उरांव किसानन ला 6,000 रुपिया साल भर मिलथे। कृषि कार्यालय म पंजीकरण करावीं। जंगल के उपज खातिर न्यूनतम समर्थन मूल्य भी मिलथे।',
    festival: 'उरांव समुदाय के मुख्य त्योहार सरहुल, करमा अउ सोहराई हवय। ये सब प्रकृति अउ खेती से जुड़े त्योहार हवय। पूरा गांव मिलके मनाथे।',
    forest: 'वन अधिकार कानून के तहत उरांव समुदाय अपन पुरखा के जमीन के दावा कर सकथे। जिला कार्यालय म आवेदन देवीं। जंगल के उपज इकट्ठा करे अउ बेचे के अधिकार मिलथे।',
    ration: 'राशन कार्ड खातिर तहसील कार्यालय म आवेदन करीं। उरांव परिवारन ला प्राथमिकता मिलथे। अंत्योदय योजना म 35 किलो अनाज मुफ्त मिलथे।',
    schemes: 'उरांव समुदाय खातिर मुख्य योजना: पोस्ट मैट्रिक छात्रवृत्ति, आयुष्मान भारत, पीएम-किसान, वन अधिकार, आवास योजना। सब योजना के जानकारी खातिर ग्राम पंचायत या जिला कार्यालय जावीं।',
    rights: 'उरांव समुदाय के अधिकार: वन भूमि अधिकार, पंचायत में आरक्षण, मातृभाषा में शिक्षा, सांस्कृतिक संरक्षण, रोजगार में आरक्षण। संविधान की पांचवीं अनुसूची म विशेष सुरक्षा मिलथे।',
    complaint: 'शिकायत दर्ज करे खातिर: जिला कलेक्टर कार्यालय, आदिवासी कल्याण विभाग, या ऑनलाइन pgportal.gov.in पर जावीं। टोल फ्री नंबर 1800-111-555 पर भी शिकायत कर सकत हीं।',
    politics: 'उरांव समुदाय के राजनीतिक अधिकार: लोकसभा अउ विधानसभा म आरक्षित सीट, पंचायत म आरक्षण, मतदान के अधिकार। अपन मतदाता पहचान पत्र बनवावीं अउ चुनाव म जरूर वोट देवीं।',
    news: 'ताजा खबर: भारत में G20 शिखर सम्मेलन सफल रहा। नई शिक्षा नीति में आदिवासी भाषाओं को प्राथमिकता। जलवायु परिवर्तन पर वैश्विक सम्मेलन में भारत की भागीदारी। डिजिटल इंडिया से ग्रामीण क्षेत्रों में इंटरनेट विस्तार।',
    default: 'हम उरांव समुदाय खातिर सरकारी योजना, स्वास्थ्य, पढ़ाई, खेती, अधिकार, राशन अउ संस्कृति के जानकारी दे सकत हन। अपन सवाल पूछीं।'
  },
  munda: {
    scholarship: 'मुंडा विद्यार्थियन खातिर पोस्ट मैट्रिक छात्रवृत्ति मिलेला। राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) पर आवेदन करीं। ऊंच पढ़ाई खातिर 50,000 रुपिया साल भर मिलेगा। मुंडारी भाषा के संरक्षण खातिर विशेष योजना हवय।',
    health: 'आयुष्मान भारत योजना म मुंडा परिवारन ला 5 लाख रुपिया तक मुफ्त इलाज मिलथे। नजदीक के स्वास्थ्य केंद्र म नाम लिखावीं। मुंडा गांवन म विशेष स्वास्थ्य शिविर लगथे।',
    farming: 'पीएम-किसान योजना म मुंडा किसानन ला 6,000 रुपिया साल भर मिलथे। कृषि कार्यालय म पंजीकरण करावीं। जंगल के उपज खातिर न्यूनतम समर्थन मूल्य भी मिलथे।',
    festival: 'मुंडा समुदाय के मुख्य त्योहार सरहुल, करमा अउ सोहराई हवय। बिरसा मुंडा जयंती विशेष रूप से मनाए जाथे। पूरा गांव मिलके मनाथे।',
    forest: 'वन अधिकार कानून के तहत मुंडा समुदाय अपन पुरखा के जमीन के दावा कर सकथे। जिला कार्यालय म आवेदन देवीं। जंगल के उपज इकट्ठा करे अउ बेचे के अधिकार मिलथे।',
    ration: 'राशन कार्ड खातिर तहसील कार्यालय म आवेदन करीं। मुंडा परिवारन ला प्राथमिकता मिलथे। अंत्योदय योजना म 35 किलो अनाज मुफ्त मिलथे।',
    schemes: 'मुंडा समुदाय खातिर मुख्य योजना: पोस्ट मैट्रिक छात्रवृत्ति, आयुष्मान भारत, पीएम-किसान, वन अधिकार, आवास योजना। सब योजना के जानकारी खातिर ग्राम पंचायत या जिला कार्यालय जावीं।',
    rights: 'मुंडा समुदाय के अधिकार: वन भूमि अधिकार, पंचायत में आरक्षण, मातृभाषा में शिक्षा, सांस्कृतिक संरक्षण, रोजगार में आरक्षण। संविधान की पांचवीं अनुसूची म विशेष सुरक्षा मिलथे।',
    complaint: 'शिकायत दर्ज करे खातिर: जिला कलेक्टर कार्यालय, आदिवासी कल्याण विभाग, या ऑनलाइन pgportal.gov.in पर जावीं। टोल फ्री नंबर 1800-111-555 पर भी शिकायत कर सकत हीं।',
    politics: 'मुंडा समुदाय के राजनीतिक अधिकार: लोकसभा अउ विधानसभा म आरक्षित सीट, पंचायत म आरक्षण, मतदान के अधिकार। अपन मतदाता पहचान पत्र बनवावीं अउ चुनाव म जरूर वोट देवीं।',
    news: 'ताजा खबर: भारत में G20 शिखर सम्मेलन सफल रहा। नई शिक्षा नीति में आदिवासी भाषाओं को प्राथमिकता। जलवायु परिवर्तन पर वैश्विक सम्मेलन में भारत की भागीदारी। डिजिटल इंडिया से ग्रामीण क्षेत्रों में इंटरनेट विस्तार।',
    default: 'हम मुंडा समुदाय खातिर सरकारी योजना, स्वास्थ्य, पढ़ाई, खेती, अधिकार, राशन अउ संस्कृति के जानकारी दे सकत हन। अपन सवाल पूछीं।'
  },
  hindi: {
    scholarship: 'अनुसूचित जनजाति छात्रों के लिए पोस्ट मैट्रिक छात्रवृत्ति उपलब्ध है। राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) पर आवेदन करें। उच्च शिक्षा के लिए 50,000 रुपये प्रति वर्ष की वित्तीय सहायता मिलती है।',
    health: 'आयुष्मान भारत योजना में आदिवासी परिवारों को 5 लाख रुपये तक का मुफ्त स्वास्थ्य बीमा मिलता है। नजदीकी स्वास्थ्य केंद्र में पंजीकरण कराएं।',
    farming: 'पीएम-किसान योजना में किसानों को 6,000 रुपये प्रति वर्ष मिलते हैं। स्थानीय कृषि कार्यालय में पंजीकरण कराएं या pmkisan.gov.in पर जाएं।',
    forest: 'वन अधिकार अधिनियम के तहत आदिवासी समुदाय अपनी पारंपरिक वन भूमि का दावा कर सकते हैं। जिला कार्यालय में आवेदन करें।',
    ration: 'राशन कार्ड के लिए तहसील कार्यालय में आवेदन करें। आदिवासी परिवारों को प्राथमिकता मिलती है। अंत्योदय योजना में 35 किलो अनाज मुफ्त मिलता है।',
    schemes: 'आदिवासी समुदाय के लिए मुख्य योजनाएं: पोस्ट मैट्रिक छात्रवृत्ति, आयुष्मान भारत, पीएम-किसान, वन अधिकार, आवास योजना, कौशल विकास। सभी योजनाओं की जानकारी के लिए ग्राम पंचायत या जिला कार्यालय जाएं।',
    rights: 'आदिवासी समुदाय के अधिकार: वन भूमि अधिकार, पंचायत में आरक्षण, मातृभाषा में शिक्षा, सांस्कृतिक संरक्षण, रोजगार में आरक्षण। संविधान की पांचवीं अनुसूची में विशेष सुरक्षा मिलती है।',
    complaint: 'शिकायत दर्ज करने के लिए: जिला कलेक्टर कार्यालय, आदिवासी कल्याण विभाग, या ऑनलाइन pgportal.gov.in पर जाएं। टोल फ्री नंबर 1800-111-555 पर भी शिकायत कर सकते हैं।',
    politics: 'आदिवासी समुदाय के राजनीतिक अधिकार: लोकसभा और विधानसभा में आरक्षित सीटें, पंचायत में आरक्षण, मतदान का अधिकार। अपना मतदाता पहचान पत्र बनवाएं और चुनाव में जरूर वोट दें।',
    news: 'ताजा खबर: भारत में G20 शिखर सम्मेलन सफलतापूर्वक संपन्न हुआ। नई शिक्षा नीति में आदिवासी भाषाओं को प्राथमिकता दी जा रही है। जलवायु परिवर्तन पर वैश्विक सम्मेलन में भारत की भागीदारी। डिजिटल इंडिया कार्यक्रम से ग्रामीण क्षेत्रों में इंटरनेट विस्तार।',
    default: 'मैं सरकारी योजनाओं, स्वास्थ्य सेवाओं, शिक्षा छात्रवृत्ति, कृषि सहायता, अधिकार, राशन और शिकायत के बारे में जानकारी दे सकता हूं।'
  },
  english: {
    scholarship: 'Post Matric Scholarship for Scheduled Tribe students is available. Apply through National Scholarship Portal (scholarships.gov.in). Financial assistance up to Rs.50,000 per year is provided for higher education.',
    health: 'Ayushman Bharat scheme provides free health insurance up to Rs.5 lakh for tribal families. Visit your nearest health center for enrollment. Special health camps are organized in tribal areas.',
    farming: 'PM-KISAN scheme provides Rs.6,000 per year to farmers. Register at your local agriculture office or visit pmkisan.gov.in. Minimum Support Price is also available for forest produce.',
    forest: 'Under Forest Rights Act, tribal communities can claim their traditional forest land. Apply at district office. Rights to collect and sell forest produce are granted.',
    ration: 'Apply for ration card at Tehsil office. Tribal families get priority. Under Antyodaya scheme, 35 kg of free grains are provided monthly.',
    schemes: 'Major schemes for tribal communities: Post Matric Scholarship, Ayushman Bharat, PM-KISAN, Forest Rights, Housing Scheme, Skill Development. Visit Gram Panchayat or District office for details.',
    rights: 'Tribal community rights: Forest land rights, reservation in Panchayat, education in mother tongue, cultural protection, employment reservation. Special protection under Fifth Schedule of Constitution.',
    complaint: 'To file complaint: Visit District Collector office, Tribal Welfare Department, or online at pgportal.gov.in. Toll-free number 1800-111-555 is also available.',
    politics: 'Political rights of tribal communities: Reserved seats in Lok Sabha and Vidhan Sabha, reservation in Panchayat, voting rights. Get your voter ID card and vote in elections.',
    news: 'Latest World News: G20 Summit concluded successfully in India. New Education Policy prioritizes tribal languages. India participates in global climate change conference. Digital India expands internet to rural areas.',
    default: 'I can help you with information about government schemes, health services, education scholarships, agricultural support, tribal rights, ration cards, complaints, and politics. Please ask your question.'
  }
};

function handleRequest(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log('API Call:', req.method, pathname);

  // Serve static files for web app
  if (req.method === 'GET' && pathname.startsWith('/web-app/')) {
    const filePath = path.join(__dirname, '..', pathname);
    const extname = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json'
    };
    const contentType = contentTypes[extname] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Received data:', data);
        
        if (pathname === '/detect-language') {
          const text = data.text.toLowerCase();
          let language = 'hindi';
          let confidence = 0.7;
          
          if (text.includes('johar') || text.includes('जोहार')) {
            language = 'santali';
            confidence = 0.95;
          }
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            detection: {
              language,
              languageCode: language === 'santali' ? 'sat' : 'hi',
              confidence,
              script: 'devanagari'
            }
          }));
          return;
        }
        
        if (pathname === '/cultural-assistant') {
          const question = data.question || data.query || '';
          const language = data.language || 'hindi';
          const query = question.toLowerCase();
          
          console.log('Question:', question, 'Language:', language);
          
          const langResponses = responses[language] || responses.hindi;
          
          // Check if asking for latest/world news
          if (query.includes('latest news') || query.includes('world news') || query.includes('global news') || query.includes('ताजा खबर') || query.includes('विश्व समाचार') || query.includes('news')) {
            answer = langResponses.news || langResponses.default;
            console.log('Matched news');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            const response = JSON.stringify({
              answer: answer,
              language: language,
              sessionId: data.sessionId || 'session-' + Date.now()
            });
            res.end(response);
            return;
          }
          
          let answer = langResponses.default;
          
          console.log('Query to match:', query);
          console.log('Available responses:', Object.keys(langResponses));
          
          // Match keywords for relevant answers
          if (query.includes('scholarship') || query.includes('छात्रवृत्ति') || query.includes('स्कॉलरशिप') || query.includes('education') || query.includes('शिक्षा') || query.includes('study') || query.includes('पढ़ाई') || query.includes('student') || query.includes('college')) {
            answer = langResponses.scholarship || langResponses.default;
            console.log('Matched scholarship');
          } else if (query.includes('health') || query.includes('स्वास्थ्य') || query.includes('hospital') || query.includes('अस्पताल') || query.includes('doctor') || query.includes('medicine') || query.includes('इलाज') || query.includes('ayushman')) {
            answer = langResponses.health || langResponses.default;
            console.log('Matched health');
          } else if (query.includes('farm') || query.includes('खेती') || query.includes('agriculture') || query.includes('कृषि') || query.includes('किसान') || query.includes('crop') || query.includes('kisan') || query.includes('फार्म')) {
            answer = langResponses.farming || langResponses.default;
            console.log('Matched farming');
          } else if (query.includes('ration') || query.includes('राशन') || query.includes('food') || query.includes('अनाज')) {
            answer = langResponses.ration || langResponses.default;
            console.log('Matched ration');
          } else if (query.includes('scheme') || query.includes('योजना') || query.includes('yojana') || query.includes('policy') || query.includes('नीति')) {
            answer = langResponses.schemes || langResponses.default;
            console.log('Matched schemes');
          } else if (query.includes('right') || query.includes('अधिकार') || query.includes('adhikar')) {
            answer = langResponses.rights || langResponses.default;
            console.log('Matched rights');
          } else if (query.includes('complaint') || query.includes('शिकायत') || query.includes('problem') || query.includes('समस्या')) {
            answer = langResponses.complaint || langResponses.default;
            console.log('Matched complaint');
          } else if (query.includes('politic') || query.includes('राजनीति') || query.includes('vote') || query.includes('मतदान') || query.includes('election') || query.includes('चुनाव') || query.includes('party') || query.includes('वोट') || query.includes('इलेक्शन')) {
            answer = langResponses.politics || langResponses.default;
            console.log('Matched politics');
          } else if (query.includes('sarhul') || query.includes('सरहुल') || query.includes('festival') || query.includes('त्योहार') || query.includes('celebration')) {
            answer = langResponses.sarhul || langResponses.festival || langResponses.default;
            console.log('Matched festival');
          } else if (query.includes('forest') || query.includes('वन') || query.includes('जंगल') || query.includes('land') || query.includes('भूमि')) {
            answer = langResponses.forest || langResponses.default;
            console.log('Matched forest');
          } else {
            console.log('No match, using default');
          }
          
          console.log('Final answer length:', answer ? answer.length : 0);
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          const response = JSON.stringify({
            answer: answer || langResponses.default,
            language: language,
            sessionId: data.sessionId || 'session-' + Date.now()
          });
          console.log('Sending response:', response.substring(0, 100));
          res.end(response);
          return;
        }
        
        if (pathname === '/text-to-speech') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            audioUrl: 'http://localhost:' + PORT + '/mock-audio.mp3',
            audioKey: 'audio-' + Date.now()
          }));
          return;
        }
        
        if (pathname === '/news') {
          const language = parsedUrl.query.language || 'santali';
          const news = newsData[language] || newsData.hindi;
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            articles: news
          }));
          return;
        }
        
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
        
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    if (pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }
    
    if (pathname === '/news') {
      const language = parsedUrl.query.language || 'santali';
      const news = newsData[language] || newsData.hindi;
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        articles: news
      }));
      return;
    }
    
    res.writeHead(404);
    res.end();
  }
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('LOCAL MOCK API SERVER RUNNING');
  console.log('='.repeat(60));
  console.log('\nServer URL: http://localhost:' + PORT);
  console.log('Web App URL: http://localhost:' + PORT + '/web-app/index.html');
  console.log('\nAvailable Endpoints:');
  console.log('   POST /detect-language');
  console.log('   POST /cultural-assistant');
  console.log('   POST /text-to-speech');
  console.log('   GET  /news?language=santali');
  console.log('\nPress Ctrl+C to stop');
  console.log('='.repeat(60) + '\n');
});

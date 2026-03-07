// Configuration
const API_URL = 'http://localhost:3002'; // Change to your API Gateway URL for AWS
let selectedLanguage = 'santali';
let currentResponse = '';
let recognition = null;
let synthesis = window.speechSynthesis;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguageSelector();
    initializeVoiceAssistant();
    loadNews();
    
    // Check for Web Speech API support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('Voice transcript:', transcript);
            document.getElementById('questionInput').value = transcript;
            showStatus('Voice input received: ' + transcript, 'success');
            document.getElementById('voiceBtn').textContent = '🎤 Start Voice Input';
            document.getElementById('voiceBtn').classList.remove('recording');
            // Auto-submit after voice input
            setTimeout(() => handleAskQuestion(), 500);
        };
        
        recognition.onerror = (event) => {
            showStatus('Voice input error: ' + event.error, 'error');
            document.getElementById('voiceBtn').textContent = '🎤 Start Voice Input';
            document.getElementById('voiceBtn').classList.remove('recording');
        };
    } else {
        document.getElementById('voiceBtn').disabled = true;
        document.getElementById('voiceBtn').textContent = '🎤 Voice Not Supported';
    }
});

// Language Selector
function initializeLanguageSelector() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedLanguage = btn.dataset.lang;
            showStatus(`Language changed to ${selectedLanguage}`, 'success');
            loadNews(); // Reload news in selected language
        });
    });
}

// Voice Assistant
function initializeVoiceAssistant() {
    document.getElementById('askBtn').addEventListener('click', handleAskQuestion);
    document.getElementById('questionInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAskQuestion();
    });
    document.getElementById('voiceBtn').addEventListener('click', handleVoiceInput);
    document.getElementById('speakBtn').addEventListener('click', handleSpeakAnswer);
}

async function handleAskQuestion() {
    const question = document.getElementById('questionInput').value.trim();
    if (!question) {
        showStatus('Please enter a question', 'error');
        return;
    }
    
    showStatus('Processing your question...', 'info');
    document.getElementById('responseBox').classList.remove('show');
    
    try {
        // Get cultural assistant response with selected language
        const assistantResponse = await fetch(`${API_URL}/cultural-assistant`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                language: selectedLanguage
            })
        });
        
        if (!assistantResponse.ok) {
            throw new Error('Failed to get response');
        }
        
        const assistantData = await assistantResponse.json();
        
        currentResponse = assistantData.answer || 'No answer received';
        document.getElementById('responseText').textContent = currentResponse;
        document.getElementById('responseBox').classList.add('show');
        document.getElementById('speakBtn').disabled = false;
        
        showStatus('Answer received!', 'success');
    } catch (error) {
        showStatus('Error: ' + error.message, 'error');
        console.error('Error:', error);
    }
}

function handleVoiceInput() {
    if (!recognition) {
        showStatus('Voice input not supported in this browser', 'error');
        return;
    }
    
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn.classList.contains('recording')) {
        recognition.stop();
        voiceBtn.textContent = '🎤 Start Voice Input';
        voiceBtn.classList.remove('recording');
    } else {
        recognition.lang = getLanguageCode(selectedLanguage);
        recognition.start();
        voiceBtn.textContent = '⏹️ Stop Recording';
        voiceBtn.classList.add('recording');
        showStatus('Listening...', 'info');
    }
}

function handleSpeakAnswer() {
    if (!currentResponse) return;
    
    if (synthesis.speaking) {
        synthesis.cancel();
        document.getElementById('speakBtn').textContent = '🔊 Speak Answer';
        return;
    }
    
    const utterance = new SpeechSynthesisUtterance(currentResponse);
    utterance.lang = getLanguageCode(selectedLanguage);
    utterance.rate = 0.9;
    
    utterance.onstart = () => {
        document.getElementById('speakBtn').textContent = '⏹️ Stop Speaking';
    };
    
    utterance.onend = () => {
        document.getElementById('speakBtn').textContent = '🔊 Speak Answer';
    };
    
    synthesis.speak(utterance);
}

// News Feed
async function loadNews() {
    const newsFeed = document.getElementById('newsFeed');
    newsFeed.innerHTML = '<div class="news-item"><div class="news-title">Loading news...</div></div>';
    
    try {
        const response = await fetch(`${API_URL}/news?language=${selectedLanguage}`);
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            newsFeed.innerHTML = data.articles.map(article => `
                <div class="news-item">
                    <div class="news-title">${article.title}</div>
                    <div class="news-content">${article.content}</div>
                    <div class="news-meta">
                        ${article.category} • ${article.date}
                    </div>
                </div>
            `).join('');
        } else {
            newsFeed.innerHTML = '<div class="news-item"><div class="news-title">No news available</div></div>';
        }
    } catch (error) {
        newsFeed.innerHTML = '<div class="news-item"><div class="news-title">Error loading news</div></div>';
        console.error('Error loading news:', error);
    }
}

// Utility Functions
function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status show ${type}`;
    setTimeout(() => {
        status.classList.remove('show');
    }, 3000);
}

function getLanguageCode(language) {
    const codes = {
        'santali': 'hi-IN',
        'gondi': 'hi-IN',
        'bhili': 'hi-IN',
        'kurukh': 'hi-IN',
        'munda': 'hi-IN',
        'hindi': 'hi-IN',
        'english': 'en-US'
    };
    return codes[language] || 'en-US';
}

// Offline Support (using localStorage)
function saveToCache(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Cache save error:', e);
    }
}

function getFromCache(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Cache read error:', e);
        return null;
    }
}

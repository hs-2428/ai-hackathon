import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3001';

class APIService {
  async detectLanguage(text) {
    try {
      const response = await axios.post(`${API_BASE_URL}/detect-language`, {
        text,
        sessionId: `session-${Date.now()}`
      });
      return response.data.detection;
    } catch (error) {
      console.error('Language detection error:', error);
      return { language: 'hindi', confidence: 0.5 };
    }
  }

  async getCulturalResponse({ query, language, userId, sessionId }) {
    try {
      const response = await axios.post(`${API_BASE_URL}/cultural-assistant`, {
        query,
        language,
        userId,
        sessionId,
        culturalContext: 'tribal-community'
      });
      return response.data;
    } catch (error) {
      console.error('Cultural response error:', error);
      throw error;
    }
  }

  async textToSpeech(text, language) {
    try {
      const response = await axios.post(`${API_BASE_URL}/text-to-speech`, {
        text,
        language,
        sessionId: `session-${Date.now()}`,
        format: 'mp3'
      });
      return response.data.audioUrl;
    } catch (error) {
      console.error('TTS error:', error);
      throw error;
    }
  }

  async getNews(language, limit = 10) {
    try {
      const response = await axios.post(`${API_BASE_URL}/news`, {
        language,
        category: 'general',
        limit
      });
      return response.data.news;
    } catch (error) {
      console.error('News fetch error:', error);
      return [];
    }
  }

  async processVoiceInput(audioData, userId, sessionId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/voice-processor`, {
        audioData,
        userId,
        sessionId
      });
      return response.data;
    } catch (error) {
      console.error('Voice processing error:', error);
      throw error;
    }
  }
}

export default new APIService();

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

class OfflineManager {
  constructor() {
    this.db = null;
  }

  async initialize() {
    try {
      this.db = await SQLite.openDatabaseAsync('tribal_app.db');
      
      // Create tables
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS cached_responses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          query TEXT,
          response TEXT,
          language TEXT,
          timestamp INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS cached_news (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          language TEXT,
          title TEXT,
          content TEXT,
          adapted_data TEXT,
          timestamp INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS cultural_knowledge (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          language TEXT,
          topic TEXT,
          content TEXT,
          keywords TEXT
        );
      `);
      
      console.log('Offline database initialized');
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  async isOffline() {
    // Check network connectivity
    try {
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        timeout: 3000 
      });
      return !response.ok;
    } catch {
      return true;
    }
  }

  async cacheResponse(query, response, language) {
    try {
      await this.db.runAsync(
        'INSERT INTO cached_responses (query, response, language, timestamp) VALUES (?, ?, ?, ?)',
        [query.toLowerCase(), response, language, Date.now()]
      );
    } catch (error) {
      console.error('Cache response error:', error);
    }
  }

  async getOfflineResponse(query, language) {
    try {
      const result = await this.db.getFirstAsync(
        'SELECT response FROM cached_responses WHERE query LIKE ? AND language = ? ORDER BY timestamp DESC LIMIT 1',
        [`%${query.toLowerCase()}%`, language]
      );
      
      if (result) {
        return result.response;
      }
      
      // Fallback to cultural knowledge base
      return await this.getCulturalKnowledge(query, language);
    } catch (error) {
      console.error('Get offline response error:', error);
      return 'I am currently offline. Please try again when connected.';
    }
  }

  async cacheNews(newsArray, language) {
    try {
      for (const news of newsArray) {
        await this.db.runAsync(
          'INSERT INTO cached_news (language, title, content, adapted_data, timestamp) VALUES (?, ?, ?, ?, ?)',
          [
            language,
            news.title,
            news.content,
            JSON.stringify(news.adapted),
            Date.now()
          ]
        );
      }
    } catch (error) {
      console.error('Cache news error:', error);
    }
  }

  async getCachedNews(language, limit = 10) {
    try {
      const results = await this.db.getAllAsync(
        'SELECT * FROM cached_news WHERE language = ? ORDER BY timestamp DESC LIMIT ?',
        [language, limit]
      );
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        content: row.content,
        adapted: JSON.parse(row.adapted_data),
        timestamp: row.timestamp
      }));
    } catch (error) {
      console.error('Get cached news error:', error);
      return [];
    }
  }

  async cacheCulturalKnowledge(language, topic, content, keywords) {
    try {
      await this.db.runAsync(
        'INSERT INTO cultural_knowledge (language, topic, content, keywords) VALUES (?, ?, ?, ?)',
        [language, topic, content, keywords.join(',')]
      );
    } catch (error) {
      console.error('Cache cultural knowledge error:', error);
    }
  }

  async getCulturalKnowledge(query, language) {
    try {
      const result = await this.db.getFirstAsync(
        'SELECT content FROM cultural_knowledge WHERE language = ? AND (topic LIKE ? OR keywords LIKE ?) LIMIT 1',
        [language, `%${query}%`, `%${query}%`]
      );
      
      return result ? result.content : 'Information not available offline.';
    } catch (error) {
      console.error('Get cultural knowledge error:', error);
      return 'Information not available offline.';
    }
  }

  async clearOldCache(daysOld = 7) {
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    try {
      await this.db.runAsync('DELETE FROM cached_responses WHERE timestamp < ?', [cutoffTime]);
      await this.db.runAsync('DELETE FROM cached_news WHERE timestamp < ?', [cutoffTime]);
      console.log('Old cache cleared');
    } catch (error) {
      console.error('Clear cache error:', error);
    }
  }
}

export default new OfflineManager();

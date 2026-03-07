#!/usr/bin/env python3
"""
Offline AI Assistant for Tribal Communities
Runs on AWS IoT Greengrass at the edge
"""

import json
import sqlite3
import os
from datetime import datetime

class OfflineAssistant:
    def __init__(self, model_path, cache_path):
        self.model_path = model_path
        self.cache_path = cache_path
        self.db_path = os.path.join(cache_path, 'offline.db')
        self.init_database()
        
    def init_database(self):
        """Initialize SQLite database for offline caching"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS responses (
                id INTEGER PRIMARY KEY,
                query TEXT,
                response TEXT,
                language TEXT,
                timestamp INTEGER
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cultural_knowledge (
                id INTEGER PRIMARY KEY,
                language TEXT,
                topic TEXT,
                content TEXT,
                keywords TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS news_cache (
                id INTEGER PRIMARY KEY,
                language TEXT,
                title TEXT,
                content TEXT,
                timestamp INTEGER
            )
        ''')
        
        conn.commit()
        conn.close()
        
    def load_cultural_knowledge(self, language):
        """Load cultural knowledge base for a language"""
        knowledge_file = os.path.join(
            self.model_path, 
            f'cultural-knowledge/{language}/knowledge.json'
        )
        
        if os.path.exists(knowledge_file):
            with open(knowledge_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return None
    
    def get_response(self, query, language):
        """Get response for a query in specified language"""
        # Check cache first
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute(
            'SELECT response FROM responses WHERE query LIKE ? AND language = ? ORDER BY timestamp DESC LIMIT 1',
            (f'%{query.lower()}%', language)
        )
        
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return result[0]
        
        # Use cultural knowledge base
        knowledge = self.load_cultural_knowledge(language)
        if knowledge:
            return self.generate_contextual_response(query, knowledge)
        
        return "Information not available offline. Please connect to internet."
    
    def generate_contextual_response(self, query, knowledge):
        """Generate response using cultural knowledge base"""
        query_lower = query.lower()
        
        # Check for government schemes
        if any(word in query_lower for word in ['scheme', 'yojana', 'benefit', 'सरकारी']):
            schemes = knowledge['commonTopics'].get('governmentSchemes', [])
            if schemes:
                response = "Available government schemes:\n\n"
                for scheme in schemes[:3]:
                    response += f"• {scheme['name']}\n"
                    response += f"  Benefit: {scheme['benefit']}\n"
                    response += f"  How to apply: {scheme['howToApply']}\n\n"
                return response
        
        # Check for health information
        if any(word in query_lower for word in ['health', 'hospital', 'doctor', 'स्वास्थ्य']):
            health = knowledge['commonTopics'].get('healthInfo', {})
            return f"Health Information:\n{health.get('ayushmanBharat', 'Contact nearest health center')}"
        
        # Check for agriculture
        if any(word in query_lower for word in ['farming', 'crop', 'agriculture', 'खेती']):
            agri = knowledge['commonTopics'].get('agriculture', {})
            schemes = ', '.join(agri.get('schemes', []))
            return f"Agricultural support schemes: {schemes}\nContact your local agriculture office for more details."
        
        # Default response
        return "I can help you with government schemes, health information, and agricultural support. Please ask specific questions."
    
    def cache_response(self, query, response, language):
        """Cache a response for offline use"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute(
            'INSERT INTO responses (query, response, language, timestamp) VALUES (?, ?, ?, ?)',
            (query.lower(), response, language, int(datetime.now().timestamp()))
        )
        
        conn.commit()
        conn.close()
    
    def sync_with_cloud(self):
        """Sync cached data with cloud when connection available"""
        # This would be implemented to sync with AWS services
        # when internet connectivity is restored
        pass

if __name__ == '__main__':
    assistant = OfflineAssistant(
        model_path='/greengrass/v2/work/models',
        cache_path='/greengrass/v2/work/cache'
    )
    
    # Example usage
    print("Offline Assistant initialized")
    print("Ready to serve tribal communities without internet")

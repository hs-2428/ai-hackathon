import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VoiceAssistant from './src/components/VoiceAssistant';
import NewsFeed from './src/components/NewsFeed';
import LanguageSelector from './src/components/LanguageSelector';
import OfflineManager from './src/services/OfflineManager';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('santali');
  const [isOffline, setIsOffline] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Load user preferences
    const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
    if (storedLanguage) setSelectedLanguage(storedLanguage);

    // Generate or retrieve user ID
    let uid = await AsyncStorage.getItem('userId');
    if (!uid) {
      uid = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('userId', uid);
    }
    setUserId(uid);

    // Initialize offline manager
    await OfflineManager.initialize();
    
    // Check connectivity
    const offline = await OfflineManager.isOffline();
    setIsOffline(offline);
  };

  const handleLanguageChange = async (language) => {
    setSelectedLanguage(language);
    await AsyncStorage.setItem('selectedLanguage', language);
  };

  return (
    <View style={styles.container}>
      <LanguageSelector 
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />
      <VoiceAssistant 
        language={selectedLanguage}
        userId={userId}
        isOffline={isOffline}
      />
      <NewsFeed 
        language={selectedLanguage}
        isOffline={isOffline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50
  }
});

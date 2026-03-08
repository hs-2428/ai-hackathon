import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const LANGUAGES = [
  { code: 'santali', name: 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)', flag: '🏔️' },
  { code: 'gondi', name: 'Gondi (गोंडी)', flag: '🌳' },
  { code: 'bhili', name: 'Bhili (भीली)', flag: '🏞️' },
  { code: 'kurukh', name: 'Kurukh (कुड़ुख)', flag: '⛰️' },
  { code: 'munda', name: 'Munda (मुंडा)', flag: '🏹' },
  { code: 'khasi', name: 'Khasi', flag: '🌄' },
  { code: 'mizo', name: 'Mizo', flag: '🏔️' },
  { code: 'bodo', name: 'Bodo (बड़ो)', flag: '🌾' },
  { code: 'hindi', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
  { code: 'english', name: 'English', flag: '🌐' }
];

export default function LanguageSelector({ selectedLanguage, onLanguageChange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Language</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              selectedLanguage === lang.code && styles.selectedButton
            ]}
            onPress={() => onLanguageChange(lang.code)}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text style={[
              styles.languageName,
              selectedLanguage === lang.code && styles.selectedText
            ]}>
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  languageButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    minWidth: 100
  },
  selectedButton: {
    backgroundColor: '#007AFF'
  },
  flag: {
    fontSize: 24,
    marginBottom: 5
  },
  languageName: {
    fontSize: 12,
    color: '#333'
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

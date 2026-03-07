import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import APIService from '../services/APIService';
import OfflineManager from '../services/OfflineManager';

export default function VoiceAssistant({ language, userId, isOffline }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => setIsListening(true);
  const onSpeechEnd = () => setIsListening(false);
  
  const onSpeechResults = async (e) => {
    const spokenText = e.value[0];
    setTranscript(spokenText);
    await processQuery(spokenText);
  };

  const onSpeechError = (e) => {
    console.error('Speech error:', e);
    setIsListening(false);
  };

  const startListening = async () => {
    try {
      await Voice.start('hi-IN');
    } catch (e) {
      console.error('Start listening error:', e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error('Stop listening error:', e);
    }
  };

  const handleTextSubmit = () => {
    if (inputText.trim()) {
      setTranscript(inputText);
      processQuery(inputText);
      setInputText('');
    }
  };

  const processQuery = async (query) => {
    setLoading(true);
    try {
      let result;
      
      if (isOffline) {
        result = await OfflineManager.getOfflineResponse(query, language);
      } else {
        const detection = await APIService.detectLanguage(query);
        result = await APIService.getCulturalResponse({
          query,
          language: detection.language,
          userId,
          sessionId: `session-${Date.now()}`
        });
        await OfflineManager.cacheResponse(query, result.response, language);
      }
      
      setResponse(result.response || result);
      await speakResponse(result.response || result);
      
    } catch (error) {
      console.error('Process query error:', error);
      setResponse('Sorry, I could not process your request. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const speakResponse = async (text) => {
    setIsSpeaking(true);
    
    if (isOffline) {
      Speech.speak(text, {
        language: language === 'english' ? 'en-IN' : 'hi-IN',
        onDone: () => setIsSpeaking(false)
      });
    } else {
      try {
        const audioUrl = await APIService.textToSpeech(text, language);
        setIsSpeaking(false);
      } catch (error) {
        Speech.speak(text, {
          language: 'hi-IN',
          onDone: () => setIsSpeaking(false)
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Assistant ({language})</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Or type your question here..."
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={handleTextSubmit}
        multiline
      />
      
      {transcript ? (
        <View style={styles.transcriptBox}>
          <Text style={styles.label}>You said:</Text>
          <Text style={styles.text}>{transcript}</Text>
        </View>
      ) : null}
      
      {response ? (
        <View style={styles.responseBox}>
          <Text style={styles.label}>Response:</Text>
          <Text style={styles.text}>{response}</Text>
        </View>
      ) : null}
      
      {loading && <ActivityIndicator size="large" color="#007AFF" />}
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary, isListening && styles.buttonActive]}
          onPress={isListening ? stopListening : startListening}
          disabled={loading || isSpeaking}
        >
          <Text style={styles.buttonText}>
            {isListening ? '🎤 Listening...' : '🎤 Voice'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleTextSubmit}
          disabled={loading || !inputText.trim()}
        >
          <Text style={styles.buttonText}>
            📝 Submit
          </Text>
        </TouchableOpacity>
      </View>
      
      {isOffline && (
        <Text style={styles.offlineIndicator}>📵 Offline Mode</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    minHeight: 60,
    textAlignVertical: 'top'
  },
  transcriptBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  responseBox: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5
  },
  text: {
    fontSize: 16,
    color: '#333'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 5
  },
  buttonPrimary: {
    backgroundColor: '#007AFF'
  },
  buttonSecondary: {
    backgroundColor: '#34C759'
  },
  buttonActive: {
    backgroundColor: '#FF3B30'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  offlineIndicator: {
    textAlign: 'center',
    color: '#FF9500',
    marginTop: 10,
    fontWeight: 'bold'
  }
});

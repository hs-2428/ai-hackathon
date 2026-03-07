import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import APIService from '../services/APIService';
import OfflineManager from '../services/OfflineManager';

export default function NewsFeed({ language, isOffline }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNews();
  }, [language]);

  const loadNews = async () => {
    setLoading(true);
    try {
      let newsData;
      
      if (isOffline) {
        newsData = await OfflineManager.getCachedNews(language);
      } else {
        newsData = await APIService.getNews(language);
        await OfflineManager.cacheNews(newsData, language);
      }
      
      setNews(newsData);
    } catch (error) {
      console.error('Load news error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  const renderNewsItem = (item, index) => (
    <View key={index} style={styles.newsItem}>
      <Text style={styles.newsTitle}>{item.adapted?.translatedTitle || item.title}</Text>
      <Text style={styles.newsContent}>
        {item.adapted?.simplifiedContent || item.content}
      </Text>
      {item.adapted?.culturalRelevance && (
        <View style={styles.culturalNote}>
          <Text style={styles.culturalNoteText}>
            📌 {item.adapted.culturalRelevance}
          </Text>
        </View>
      )}
      {item.adapted?.relatedSchemes && (
        <View style={styles.schemesBox}>
          <Text style={styles.schemesTitle}>Related Government Schemes:</Text>
          <Text style={styles.schemesText}>{item.adapted.relatedSchemes}</Text>
        </View>
      )}
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>News in {language}</Text>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && news.length === 0 ? (
          <Text style={styles.loadingText}>Loading news...</Text>
        ) : news.length > 0 ? (
          news.map(renderNewsItem)
        ) : (
          <Text style={styles.emptyText}>No news available</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 10
  },
  newsItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  newsContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 10
  },
  culturalNote: {
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 5,
    marginBottom: 8
  },
  culturalNoteText: {
    fontSize: 12,
    color: '#856404'
  },
  schemesBox: {
    backgroundColor: '#d1ecf1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8
  },
  schemesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0c5460',
    marginBottom: 4
  },
  schemesText: {
    fontSize: 12,
    color: '#0c5460'
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right'
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#666'
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#999'
  }
});

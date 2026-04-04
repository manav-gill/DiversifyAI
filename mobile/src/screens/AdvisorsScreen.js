import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';
import AdvisorCard from '../components/AdvisorCard';

const stats = [
  { id: 's1', title: 'Available Consultants', value: '24' },
  { id: 's2', title: 'Average Rating', value: '4.8/5' },
  { id: 's3', title: 'Response Time', value: '~ 18 min' },
];

const advisors = [
  {
    id: 'a1',
    name: 'Rahul Sharma',
    specialization: 'Equity Investment',
    rating: 4.9,
    experience: 12,
    clients: 340,
    languages: 'English, Hindi',
  },
  {
    id: 'a2',
    name: 'Neha Gupta',
    specialization: 'Portfolio Management',
    rating: 4.8,
    experience: 9,
    clients: 280,
    languages: 'English, Hindi',
  },
  {
    id: 'a3',
    name: 'Arjun Mehta',
    specialization: 'Risk & Asset Allocation',
    rating: 4.7,
    experience: 11,
    clients: 310,
    languages: 'English, Hindi, Gujarati',
  },
  {
    id: 'a4',
    name: 'Sneha Kapoor',
    specialization: 'Long-Term Wealth Planning',
    rating: 4.9,
    experience: 10,
    clients: 295,
    languages: 'English, Hindi, Punjabi',
  },
];

export default function AdvisorsScreen() {
  const handleBookNow = () => {
    console.log('Booking advisor');
  };

  const renderAdvisor = ({ item }) => (
    <AdvisorCard advisor={item} onBook={handleBookNow} />
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Advisor Connect</Text>
        <Text style={styles.subtitle}>
          Connect with financial experts for personalized investment guidance
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsRow}
      >
        {stats.map((item) => (
          <View key={item.id} style={styles.statCard}>
            <Text style={styles.statTitle}>{item.title}</Text>
            <Text style={styles.statValue}>{item.value}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.listSection}>
        <FlatList
          data={advisors}
          keyExtractor={(item) => item.id}
          renderItem={renderAdvisor}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 26,
  },
  headerSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: '#475569',
  },
  statsRow: {
    paddingBottom: 2,
    marginBottom: 16,
  },
  statCard: {
    width: 148,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginRight: 10,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  statTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  listSection: {
    marginBottom: 4,
  },
  listContent: {
    paddingBottom: 4,
  },
});

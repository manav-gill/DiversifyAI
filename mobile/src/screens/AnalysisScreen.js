import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AnalysisScreen() {
  const handleRunAnalysis = () => {
    console.log('Running AI Analysis...');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Diversify AI Analysis</Text>
        <Text style={styles.subtitle}>
          Trigger portfolio intelligence and get insights, scores, and
          recommendations
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="analytics" size={34} color="#00C896" />
        </View>

        <Text style={styles.cardTitle}>Ready to Analyze Your Portfolio?</Text>

        <Text style={styles.description}>
          Our AI engine scans your holdings, evaluates risk, and provides
          actionable recommendations.
        </Text>

        <Text style={styles.warningText}>
          Analysis is user-triggered and limited to one generation per day.
        </Text>

        <TouchableOpacity style={styles.runButton} onPress={handleRunAnalysis}>
          <Text style={styles.runButtonText}>Run AI Analysis</Text>
        </TouchableOpacity>
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: '#475569',
    textAlign: 'center',
    maxWidth: 360,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E6EDF3',
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E8FBF3',
    borderWidth: 1,
    borderColor: '#C8F3E2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 14,
  },
  warningText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: '#B45309',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginBottom: 14,
    textAlign: 'center',
  },
  runButton: {
    width: '100%',
    height: 50,
    borderRadius: 13,
    backgroundColor: '#00C896',
    alignItems: 'center',
    justifyContent: 'center',
  },
  runButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

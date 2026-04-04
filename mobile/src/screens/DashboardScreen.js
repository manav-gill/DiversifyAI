import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import StatsCard from '../components/StatsCard';

const statsData = [
  { id: '1', value: '+27%', label: 'Avg Returns' },
  { id: '2', value: '3.8x', label: 'Risk vs Reward' },
  { id: '3', value: '91/100', label: 'Portfolio Score' },
];

export default function DashboardScreen() {
  const renderStatItem = ({ item }) => (
    <StatsCard value={item.value} label={item.label} />
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.appName}>Diversify AI</Text>
        <View style={styles.avatarPlaceholder} />
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroText}>
          Built for investors{'\n'}
          who want returns{'\n'}
          with <Text style={styles.heroHighlight}>rhythm</Text>, not chaos.
        </Text>
      </View>

      <View style={styles.ctaRow}>
        <TouchableOpacity style={[styles.ctaButton, styles.primaryButton]}>
          <Text style={styles.primaryButtonText}>Launch Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctaButton, styles.secondaryButton]}>
          <Text style={styles.secondaryButtonText}>Watch Preview</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.healthCard}>
        <View style={styles.healthHeaderRow}>
          <Text style={styles.healthTitle}>Portfolio Health</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>Strong</Text>
          </View>
        </View>
        <Text style={styles.healthSubtext}>Loading data...</Text>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.metricsRow}>
          <View style={[styles.metricBox, styles.metricBoxSpacing]}>
            <Text style={styles.metricLabel}>Diversification Score</Text>
            <Text style={styles.metricValue}>--</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Risk Score</Text>
            <Text style={styles.metricValue}>--</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Market Snapshot</Text>
        <FlatList
          data={statsData}
          keyExtractor={(item) => item.id}
          renderItem={renderStatItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContent}
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
    paddingTop: 24,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
  },
  appName: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: '#111827',
  },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E7EDF3',
    borderWidth: 1,
    borderColor: '#DCE3EA',
  },
  heroSection: {
    marginBottom: 28,
  },
  heroText: {
    fontSize: 36,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: '#111827',
  },
  heroHighlight: {
    color: '#00C896',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  ctaButton: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#00C896',
    marginRight: 12,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: '#D5DEE7',
    backgroundColor: '#FFFFFF',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '700',
  },
  healthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  healthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#E7FBF4',
  },
  statusBadgeText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  healthSubtext: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 14,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#E8EEF3',
    overflow: 'hidden',
    marginBottom: 18,
  },
  progressFill: {
    width: '72%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#00C896',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5ECF3',
  },
  metricBoxSpacing: {
    marginRight: 12,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  statsSection: {
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  statsContent: {
    paddingRight: 8,
  },
});

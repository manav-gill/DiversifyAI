import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MetricCard from '../components/MetricCard';
import ProgressBar from '../components/ProgressBar';
import Section from '../components/Section';

const metricCards = [
  {
    id: 'm1',
    title: 'Total Investment',
    value: 'Rs 12.40L',
    subtext: '14 active holdings',
  },
  {
    id: 'm2',
    title: 'Current Value',
    value: 'Rs 13.92L',
    subtext: '+12.3% this year',
  },
  {
    id: 'm3',
    title: 'Portfolio Health',
    value: '91/100',
    subtext: 'Strong',
  },
  {
    id: 'm4',
    title: 'Diversification',
    value: '78%',
    subtext: 'Moderately balanced',
  },
  {
    id: 'm5',
    title: 'Risk Score',
    value: '42',
    subtext: 'Within target range',
  },
  {
    id: 'm6',
    title: 'Active Alerts',
    value: '3',
    subtext: 'Needs review today',
  },
];

const sectorData = [
  {
    id: 's1',
    name: 'Banking',
    percentage: '35%',
    widthKey: 'p35',
    tone: 'green',
  },
  {
    id: 's2',
    name: 'IT',
    percentage: '25%',
    widthKey: 'p25',
    tone: 'blue',
  },
  {
    id: 's3',
    name: 'Energy',
    percentage: '20%',
    widthKey: 'p20',
    tone: 'teal',
  },
  {
    id: 's4',
    name: 'Pharma',
    percentage: '12%',
    widthKey: 'p12',
    tone: 'orange',
  },
  {
    id: 's5',
    name: 'FMCG',
    percentage: '8%',
    widthKey: 'p08',
    tone: 'green',
  },
];

const stockData = [
  {
    id: 'st1',
    stock: 'HDFC Bank',
    sector: 'Banking',
    percentage: '24%',
    widthKey: 'p24',
  },
  {
    id: 'st2',
    stock: 'TCS',
    sector: 'IT',
    percentage: '18%',
    widthKey: 'p18',
  },
  {
    id: 'st3',
    stock: 'Reliance',
    sector: 'Energy',
    percentage: '15%',
    widthKey: 'p15',
  },
  {
    id: 'st4',
    stock: 'Sun Pharma',
    sector: 'Pharma',
    percentage: '12%',
    widthKey: 'p12',
  },
  {
    id: 'st5',
    stock: 'ITC',
    sector: 'FMCG',
    percentage: '10%',
    widthKey: 'p10',
  },
];

const marketCapData = [
  {
    id: 'c1',
    label: 'Large Cap',
    percentage: '58%',
    widthKey: 'p58',
    tone: 'green',
  },
  {
    id: 'c2',
    label: 'Mid Cap',
    percentage: '27%',
    widthKey: 'p27',
    tone: 'blue',
  },
  {
    id: 'c3',
    label: 'Small Cap',
    percentage: '15%',
    widthKey: 'p15',
    tone: 'orange',
  },
];

const investSegments = [
  { id: 'i1', label: 'Banking Rs 35' },
  { id: 'i2', label: 'IT Rs 25' },
  { id: 'i3', label: 'Energy Rs 20' },
  { id: 'i4', label: 'Others Rs 20' },
];

const aiRecommendations = [
  {
    id: 'a1',
    text: 'Trim Banking exposure by 5% and rotate into Pharma for better balance.',
  },
  {
    id: 'a2',
    text: 'Increase Mid Cap allocation gradually using SIP over the next 8 weeks.',
  },
  {
    id: 'a3',
    text: 'Set downside alert at -7% on top 3 holdings to protect gains.',
  },
];

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <View style={styles.refreshBar}>
        <Text style={styles.refreshText}>Last updated: 05 Apr 2026</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <Section title="Key Metrics">
        <View style={styles.metricsGrid}>
          {metricCards.map((card) => (
            <MetricCard
              key={card.id}
              title={card.title}
              value={card.value}
              subtext={card.subtext}
            />
          ))}
        </View>
      </Section>

      <Section title="Sector Allocation">
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>Sector Chart Placeholder</Text>
        </View>
        {sectorData.map((item) => (
          <View key={item.id} style={styles.progressItem}>
            <View style={styles.progressHeaderRow}>
              <Text style={styles.progressLabel}>{item.name}</Text>
              <Text style={styles.progressPercentage}>{item.percentage}</Text>
            </View>
            <ProgressBar widthKey={item.widthKey} tone={item.tone} />
          </View>
        ))}
      </Section>

      <Section title="Stock Allocation">
        {stockData.map((stock) => (
          <View key={stock.id} style={styles.stockItem}>
            <View style={styles.stockTopRow}>
              <View>
                <Text style={styles.stockName}>{stock.stock}</Text>
                <Text style={styles.stockSector}>{stock.sector}</Text>
              </View>
              <Text style={styles.stockPercentage}>{stock.percentage}</Text>
            </View>
            <ProgressBar widthKey={stock.widthKey} tone="green" />
          </View>
        ))}
      </Section>

      <Section title="Market Cap Balance">
        {marketCapData.map((item) => (
          <View key={item.id} style={styles.progressItem}>
            <View style={styles.progressHeaderRow}>
              <Text style={styles.progressLabel}>{item.label}</Text>
              <Text style={styles.progressPercentage}>{item.percentage}</Text>
            </View>
            <ProgressBar widthKey={item.widthKey} tone={item.tone} />
          </View>
        ))}

        <View style={styles.recommendationBox}>
          <Text style={styles.recommendationTitle}>Recommendation</Text>
          <Text style={styles.recommendationText}>
            Large Cap is healthy. Consider adding 5-7% Mid Cap exposure to
            improve growth potential without aggressive risk.
          </Text>
        </View>
      </Section>

      <Section title="If You Invest 100">
        <View style={styles.segmentedBar}>
          <View style={[styles.segment, styles.segmentBanking]} />
          <View style={[styles.segment, styles.segmentIT]} />
          <View style={[styles.segment, styles.segmentEnergy]} />
          <View style={[styles.segment, styles.segmentOthers]} />
        </View>
        <View style={styles.segmentLabelWrap}>
          {investSegments.map((item) => (
            <Text key={item.id} style={styles.segmentLabel}>
              {item.label}
            </Text>
          ))}
        </View>
      </Section>

      <Section title="Performance">
        <View style={styles.performanceCard}>
          <View style={styles.performanceLine} />
          <Text style={styles.performancePlaceholderText}>
            Performance Graph Placeholder
          </Text>
        </View>

        <View style={styles.performanceTabRow}>
          <View style={[styles.performanceTab, styles.performanceTabActive]}>
            <Text style={[styles.performanceTabText, styles.performanceTabTextActive]}>
              1M
            </Text>
          </View>
          <View style={styles.performanceTab}>
            <Text style={styles.performanceTabText}>3M</Text>
          </View>
          <View style={styles.performanceTab}>
            <Text style={styles.performanceTabText}>6M</Text>
          </View>
        </View>
      </Section>

      <Section title="AI Recommendations" contentStyle={styles.aiSectionCard}>
        {aiRecommendations.map((item) => (
          <View key={item.id} style={styles.aiRecommendationItem}>
            <Text style={styles.aiRecommendationText}>{item.text}</Text>
          </View>
        ))}
      </Section>
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
    paddingTop: 16,
    paddingBottom: 28,
  },
  header: {
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  refreshBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EEF4',
  },
  refreshText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  refreshButton: {
    backgroundColor: '#00C896',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  refreshButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  chartPlaceholder: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCE6EE',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#F8FBFD',
  },
  chartPlaceholderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  progressItem: {
    marginBottom: 14,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  progressPercentage: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  stockItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    marginBottom: 4,
  },
  stockTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stockName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  stockSector: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  stockPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  recommendationBox: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8FBFE',
    borderWidth: 1,
    borderColor: '#E2EAF2',
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    color: '#334155',
  },
  segmentedBar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#E7EDF3',
  },
  segment: {
    height: '100%',
  },
  segmentBanking: {
    flex: 35,
    backgroundColor: '#00C896',
  },
  segmentIT: {
    flex: 25,
    backgroundColor: '#3B82F6',
  },
  segmentEnergy: {
    flex: 20,
    backgroundColor: '#14B8A6',
  },
  segmentOthers: {
    flex: 20,
    backgroundColor: '#CBD5E1',
  },
  segmentLabelWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  segmentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  performanceCard: {
    height: 160,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCE6EE',
    borderStyle: 'dashed',
    backgroundColor: '#F8FBFD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  performanceLine: {
    width: 120,
    height: 2,
    backgroundColor: '#00C896',
    marginBottom: 12,
  },
  performancePlaceholderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  performanceTabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceTab: {
    width: '31%',
    borderRadius: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  performanceTabActive: {
    borderColor: '#00C896',
    backgroundColor: '#E7FBF4',
  },
  performanceTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  performanceTabTextActive: {
    color: '#059669',
  },
  aiSectionCard: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
    borderWidth: 1,
  },
  aiRecommendationItem: {
    borderRadius: 12,
    backgroundColor: '#111D33',
    borderWidth: 1,
    borderColor: '#23314A',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  aiRecommendationText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    color: '#E2E8F0',
  },
});

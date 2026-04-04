import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import MetricCard from '../components/MetricCard';
import Section from '../components/Section';
import apiClient from '../services/api';
import { getPortfolio, getSectorData } from '../services/portfolioService';

const CHART_COLORS = ['#00C896', '#3B82F6', '#14B8A6', '#F59E0B', '#8B5CF6', '#EF4444'];
const CHART_CONFIG = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  decimalPlaces: 0,
  color: (opacity = 1) => 'rgba(15, 23, 42, ' + opacity + ')',
  labelColor: (opacity = 1) => 'rgba(51, 65, 85, ' + opacity + ')',
};

function formatCurrency(value) {
  return '₹' + Number(value || 0).toLocaleString('en-IN');
}

function normalizePortfolio(raw) {
  const stocks = Array.isArray(raw) ? raw : raw?.stocks || raw?.holdings || [];

  const totalInvestment =
    typeof raw?.totalInvestment === 'number'
      ? raw.totalInvestment
      : stocks.reduce((sum, stock) => {
          const quantity = Number(stock?.quantity) || 0;
          const buyPrice = Number(stock?.buyPrice || stock?.purchasePrice) || 0;
          return sum + quantity * buyPrice;
        }, 0);

  return {
    totalInvestment,
    stocks,
  };
}

function normalizeSectors(raw) {
  if (Array.isArray(raw)) {
    return raw
      .map((item, index) => {
        const name = item?.sector || item?.name || 'Other';
        const value = Number(item?.percentage || item?.allocation || item?.value) || 0;

        return {
          name,
          value,
          color: CHART_COLORS[index % CHART_COLORS.length],
        };
      })
      .filter((item) => item.value > 0);
  }

  if (raw && typeof raw === 'object') {
    return Object.entries(raw)
      .map(([name, value], index) => ({
        name,
        value: Number(value) || 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .filter((item) => item.value > 0);
  }

  return [];
}

export default function DashboardScreen() {
  const [portfolioData, setPortfolioData] = useState({ totalInvestment: 0, stocks: [] });
  const [sectorData, setSectorData] = useState([]);
  const [analysisData, setAnalysisData] = useState({
    diversificationScore: null,
    riskScore: null,
    portfolioHealth: null,
    recommendations: [],
  });
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const [portfolioResponse, sectorResponse] = await Promise.all([
        getPortfolio(),
        getSectorData(),
      ]);

      setPortfolioData(normalizePortfolio(portfolioResponse));
      setSectorData(normalizeSectors(sectorResponse));
    } catch (apiError) {
      console.error(
        'Dashboard fetch failed:',
        apiError.response?.data?.message || apiError.message
      );
      setError('Unable to load dashboard data right now.');
      setPortfolioData({ totalInvestment: 0, stocks: [] });
      setSectorData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const runAnalysis = async () => {
    setAnalysisLoading(true);

    try {
      const response = await apiClient.post('/analysis/portfolio');
      const payload = response.data || {};

      setAnalysisData({
        diversificationScore:
          typeof payload.diversificationScore === 'number'
            ? payload.diversificationScore
            : null,
        riskScore: typeof payload.riskScore === 'number' ? payload.riskScore : null,
        portfolioHealth:
          typeof payload.portfolioHealth === 'number' ? payload.portfolioHealth : null,
        recommendations: Array.isArray(payload.recommendations)
          ? payload.recommendations
          : [],
      });
      setError('');
    } catch (apiError) {
      console.error(
        'Analysis request failed:',
        apiError.response?.data?.message || apiError.message
      );
      setError('Analysis failed. Please try again.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const chartWidth = Dimensions.get('window').width - 80;

  const pieChartData = useMemo(() => {
    return sectorData.map((item) => ({
      name: item.name,
      population: item.value,
      color: item.color,
      legendFontColor: '#334155',
      legendFontSize: 12,
    }));
  }, [sectorData]);

  const recommendations = analysisData.recommendations;

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#00C896" />
        <Text style={styles.loadingText}>Loading dashboard insights...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchDashboardData}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Section title="Key Metrics">
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Investment"
            value={formatCurrency(portfolioData.totalInvestment)}
            subtext={portfolioData.stocks.length + ' holdings'}
          />
          <MetricCard
            title="Portfolio Health"
            value={
              analysisData.portfolioHealth === null
                ? '--'
                : String(analysisData.portfolioHealth) + '/100'
            }
            subtext="From latest analysis"
          />
          <MetricCard
            title="Diversification"
            value={
              analysisData.diversificationScore === null
                ? '--'
                : String(analysisData.diversificationScore)
            }
            subtext="Score"
          />
          <MetricCard
            title="Risk Score"
            value={
              analysisData.riskScore === null ? '--' : String(analysisData.riskScore)
            }
            subtext="Lower is safer"
          />
        </View>
      </Section>

      <Section title="Sector Allocation">
        {pieChartData.length > 0 ? (
          <PieChart
            data={pieChartData}
            width={chartWidth}
            height={210}
            chartConfig={CHART_CONFIG}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            absolute
            hasLegend
          />
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>No sector data available yet.</Text>
          </View>
        )}
      </Section>

      <Section title="AI Portfolio Analysis">
        <TouchableOpacity
          style={[styles.analysisButton, analysisLoading && styles.analysisButtonDisabled]}
          onPress={runAnalysis}
          disabled={analysisLoading}
        >
          <Text style={styles.analysisButtonText}>
            {analysisLoading ? 'Running Analysis...' : 'Run Analysis'}
          </Text>
        </TouchableOpacity>
      </Section>

      <Section title="Recommendations">
        {recommendations.length > 0 ? (
          recommendations.map((item, index) => (
            <View key={'rec-' + index} style={styles.recommendationCard}>
              <Text style={styles.recommendationText}>{item}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>
              Run analysis to view AI recommendations.
            </Text>
          </View>
        )}
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
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  refreshButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE6EE',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  refreshButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B91C1C',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  analysisButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#00C896',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisButtonDisabled: {
    opacity: 0.65,
  },
  analysisButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EEF4',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 11,
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    color: '#334155',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EEF4',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  emptyCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});

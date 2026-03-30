import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import api from '../services/api';

export default function DashboardScreen() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [portfolioRes, analysisRes] = await Promise.all([
        api.get('/portfolio'),
        api.get('/analysis/latest')
      ]);
      setPortfolioData(portfolioRes.data);
      setAnalysisData(analysisRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 p-4"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Portfolio Summary Card */}
      <View className="bg-white rounded-xl p-5 shadow-sm mb-6">
        <Text className="text-gray-500 font-semibold mb-1">Total Investment Value</Text>
        <Text className="text-4xl font-bold text-gray-800 tracking-tight">
          ₹{portfolioData?.totalInvestment?.toLocaleString('en-IN') || '0'}
        </Text>
        
        <View className="flex-row mt-4 pt-4 border-t border-gray-100">
          <View className="flex-1">
            <Text className="text-gray-500 font-semibold">Total Stocks</Text>
            <Text className="text-lg font-bold text-gray-800">{portfolioData?.totalStocks || '0'}</Text>
          </View>
        </View>
      </View>

      {/* AI Health Snapshot */}
      <Text className="text-xl font-bold text-gray-800 mb-3">AI Health Snapshot</Text>
      <View className="flex-row justify-between mb-6">
        <View className="bg-white p-4 rounded-xl shadow-sm flex-1 mr-2 items-center">
          <Text className="text-gray-500 font-semibold text-center h-10">Diversification</Text>
          <Text className="text-3xl font-bold text-blue-600">{analysisData?.diversificationScore || '0'}</Text>
        </View>
        <View className="bg-white p-4 rounded-xl shadow-sm flex-1 mx-1 items-center">
          <Text className="text-gray-500 font-semibold text-center h-10">Risk Score</Text>
          <Text className="text-3xl font-bold text-red-500">{analysisData?.riskScore || '0'}</Text>
        </View>
        <View className="bg-white p-4 rounded-xl shadow-sm flex-1 ml-2 items-center">
          <Text className="text-gray-500 font-semibold text-center h-10">Portfolio Health</Text>
          <Text className="text-3xl font-bold text-green-500">{analysisData?.portfolioHealth || '0'}</Text>
        </View>
      </View>
      
      {/* Recent Analysis Recommendation Preview */}
      {analysisData?.recommendations?.length > 0 && (
        <View className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
          <Text className="text-blue-800 font-bold mb-2">💡 Quick Insight</Text>
          <Text className="text-blue-700">{analysisData.recommendations[0]}</Text>
        </View>
      )}

      <Text className="text-gray-400 text-center text-xs mt-2">Pull down to refresh</Text>
      <View className="h-10" />
    </ScrollView>
  );
}

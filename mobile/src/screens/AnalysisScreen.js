import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function AnalysisScreen() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Fetch the latest cached analysis on load
  const fetchLatestAnalysis = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analysis/latest');
      setAnalysisData(res.data);
    } catch (error) {
      console.error('Error fetching latest analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  // Trigger a new AI generation
  const generateAnalysis = async () => {
    try {
      setGenerating(true);
      const res = await api.post('/analysis/portfolio');
      setAnalysisData(res.data);
      Alert.alert("Success", "AI Analysis updated successfully!");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Could not generate analysis.");
    } finally {
      setGenerating(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-500 mt-4">Loading insights...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="bg-white p-6 rounded-2xl shadow-sm mb-6 items-center">
        <Ionicons name="sparkles" size={40} color="#2563eb" />
        <Text className="text-2xl font-bold text-gray-800 mt-2">PortfolioPilot AI</Text>
        <Text className="text-gray-500 text-center mt-1">
          Deep insights into your portfolio's health, risk, and diversification.
        </Text>
        
        <TouchableOpacity 
          className="mt-6 bg-blue-600 px-6 py-3 rounded-xl flex-row items-center"
          onPress={generateAnalysis}
          disabled={generating}
        >
          {generating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-white font-bold text-lg">Generate Fresh Analysis</Text>
          )}
        </TouchableOpacity>
        {analysisData?.generatedAt && (
          <Text className="text-xs text-gray-400 mt-2">
            Last updated: {new Date(analysisData.generatedAt).toLocaleString()}
          </Text>
        )}
      </View>

      <Text className="text-xl font-bold text-gray-800 mb-4 px-1">Health Scores</Text>
      
      <View className="flex-row justify-between mb-6">
        <View className="bg-white p-5 rounded-2xl shadow-sm flex-1 mr-2 items-center">
          <Text className="text-gray-500 font-semibold mb-2">Diversification</Text>
          <Text className={`text-5xl font-bold ${getScoreColor(analysisData?.diversificationScore || 0)}`}>
            {analysisData?.diversificationScore || '0'}
          </Text>
        </View>

        <View className="bg-white p-5 rounded-2xl shadow-sm flex-1 ml-2 items-center">
          <Text className="text-gray-500 font-semibold mb-2">Portfolio Health</Text>
          <Text className={`text-5xl font-bold ${getScoreColor(analysisData?.portfolioHealth || 0)}`}>
            {analysisData?.portfolioHealth || '0'}
          </Text>
        </View>
      </View>

      <View className="bg-white p-5 rounded-2xl shadow-sm mb-6 items-center flex-row justify-between">
        <Text className="text-gray-600 font-bold text-lg">Overall Risk Score</Text>
        <Text className={`text-3xl font-bold ${getScoreColor(100 - (analysisData?.riskScore || 0)) /* lower risk is better */}`}>
          {analysisData?.riskScore || '0'}
        </Text>
      </View>

      <Text className="text-xl font-bold text-gray-800 mb-4 px-1">AI Recommendations</Text>
      {analysisData?.recommendations && analysisData.recommendations.length > 0 ? (
        analysisData.recommendations.map((rec, index) => (
          <View key={index} className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-3 flex-row">
            <Text className="text-blue-600 font-bold mr-2">{index + 1}.</Text>
            <Text className="text-gray-800 flex-1 leading-6">{rec}</Text>
          </View>
        ))
      ) : (
        <View className="bg-gray-100 p-6 rounded-xl items-center border border-gray-200">
          <Text className="text-gray-500 text-center">No recommendations available yet. Ask the AI to generate a fresh analysis!</Text>
        </View>
      )}

      <View className="h-10" />
    </ScrollView>
  );
}

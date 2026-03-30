import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function EarningsScreen() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEarnings = async () => {
    try {
      const response = await api.get('/payment/advisor/earnings');
      setEarnings(response.data);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEarnings();
    setRefreshing(false);
  }, []);

  const renderPayment = ({ item }) => (
    <View className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row items-center border border-gray-100">
      <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
        <Ionicons name="checkmark" size={24} color="#16a34a" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-800">{item.user?.name || 'Client'}</Text>
        <Text className="text-gray-500 text-sm">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text className="text-lg font-bold text-green-600">
        +₹{item.amount}
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Earnings Overview Card */}
      <View className="bg-blue-600 p-6 rounded-2xl shadow-md mb-6">
        <Text className="text-blue-100 font-semibold mb-1 uppercase tracking-wider text-xs">Total Earnings</Text>
        <Text className="text-4xl font-bold text-white mb-6 tracking-tight">
          ₹{earnings?.stats?.totalEarnings?.toLocaleString('en-IN') || '0'}
        </Text>
        
        <View className="flex-row border-t border-blue-500 pt-4">
          <View className="flex-1">
            <Text className="text-blue-200 text-xs uppercase tracking-wider mb-1">Consultations</Text>
            <Text className="text-xl font-bold text-white">{earnings?.stats?.paidConsultations || '0'}</Text>
          </View>
          <View className="flex-1 items-end">
            <Text className="text-blue-200 text-xs uppercase tracking-wider mb-1">Unique Clients</Text>
            <Text className="text-xl font-bold text-white">{earnings?.stats?.uniqueClients || '0'}</Text>
          </View>
        </View>
      </View>

      <Text className="text-xl font-bold text-gray-800 mb-4 px-1">Recent Payments</Text>
      <FlatList
        data={earnings?.recentPayments || []}
        keyExtractor={(item) => item._id || item.createdAt}
        renderItem={renderPayment}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View className="items-center py-10">
            <Text className="text-gray-500">No earnings recorded yet.</Text>
          </View>
        }
      />
    </View>
  );
}

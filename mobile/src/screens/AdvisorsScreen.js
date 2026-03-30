import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function AdvisorsScreen({ navigation }) {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdvisors = async () => {
    try {
      const response = await api.get('/auth/advisors');
      setAdvisors(response.data.advisors || []);
    } catch (error) {
      console.error('Error fetching advisors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAdvisors();
    setRefreshing(false);
  }, []);

  const renderAdvisor = ({ item }) => (
    <TouchableOpacity 
      className="bg-white p-5 rounded-2xl shadow-sm mb-4 border border-gray-100 flex-row items-center"
      onPress={() => navigation.navigate('AdvisorDetail', { advisor: item })}
    >
      <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mr-4">
        <Text className="text-blue-600 text-2xl font-bold">{item.name.charAt(0)}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-xl font-bold text-gray-800">{item.name}</Text>
        <Text className="text-gray-500 text-sm mt-1">Certified Financial Advisor</Text>
        <Text className="text-blue-600 font-semibold mt-2">Consultation: ₹499</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
    </TouchableOpacity>
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
      <Text className="text-2xl font-bold text-gray-800 mb-2">Connect with Experts</Text>
      <Text className="text-gray-500 mb-6">Get personalized portfolio guidance from certified professionals.</Text>
      
      <FlatList
        data={advisors}
        keyExtractor={(item) => item._id || item.id}
        renderItem={renderAdvisor}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View className="items-center py-10">
            <Text className="text-gray-500">No advisors available at the moment.</Text>
          </View>
        }
      />
    </View>
  );
}

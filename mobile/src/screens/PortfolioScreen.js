import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchPortfolio = async () => {
    try {
      const response = await api.get('/portfolio');
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPortfolio();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPortfolio();
    setRefreshing(false);
  }, []);

  const handleRemoveStock = (symbol) => {
    Alert.alert(
      "Remove Stock",
      `Are you sure you want to remove ${symbol}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/portfolio/remove/${symbol}`);
              fetchPortfolio();
            } catch (error) {
              Alert.alert("Error", "Could not remove stock");
            }
          } 
        }
      ]
    );
  };

  const renderStockItem = ({ item }) => (
    <View className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row justify-between items-center border border-gray-100">
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-800">{item.symbol}</Text>
        <Text className="text-gray-500 text-sm">{item.sector}</Text>
        <Text className="text-gray-600 mt-1">Qty: {item.quantity}  •  Avg: ₹{item.buyPrice}</Text>
      </View>
      <View className="items-end justify-center">
        <Text className="text-lg font-bold text-gray-800">
          ₹{item.currentValue ? item.currentValue.toLocaleString('en-IN') : (item.buyPrice * item.quantity).toLocaleString('en-IN')}
        </Text>
        <TouchableOpacity 
          className="mt-2 bg-red-50 p-2 rounded-lg"
          onPress={() => handleRemoveStock(item.symbol)}
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={portfolio?.stocks || []}
        keyExtractor={(item) => item.symbol}
        renderItem={renderStockItem}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View className="items-center py-10">
            <Text className="text-gray-500">Your portfolio is empty.</Text>
          </View>
        }
      />
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('AddStock')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

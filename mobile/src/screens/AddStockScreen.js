import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import api from '../services/api';

export default function AddStockScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await api.get(`/portfolio/search?q=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleAddStock = async () => {
    if (!selectedStock || !quantity || !buyPrice) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }

    try {
      await api.post('/portfolio/add', {
        stockSymbol: selectedStock.symbol,
        quantity: Number(quantity),
        buyPrice: Number(buyPrice)
      });
      Alert.alert('Success', 'Stock added to portfolio');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Could not add stock');
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      {!selectedStock ? (
        <>
          <View className="flex-row items-center mb-4 border border-gray-300 rounded-lg pr-2">
            <TextInput
              className="flex-1 px-4 py-3 text-gray-800"
              placeholder="Search NSE/BSE stocks..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch} className="bg-blue-100 px-4 py-2 rounded-md">
              <Text className="text-blue-600 font-semibold">Search</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => `${item.symbol}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity 
                className="p-4 border-b border-gray-100 flex-row justify-between items-center"
                onPress={() => setSelectedStock(item)}
              >
                <View>
                  <Text className="font-bold text-gray-800">{item.symbol}</Text>
                  <Text className="text-gray-500 text-sm">{item.name}</Text>
                </View>
                <Text className="text-blue-500 text-xs px-2 py-1 bg-blue-50 rounded">{item.type || 'EQUITY'}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </>
      ) : (
        <View className="flex-1">
          <View className="bg-blue-50 p-4 rounded-xl mb-6 flex-row justify-between items-center border border-blue-100">
            <View>
              <Text className="font-bold text-xl text-blue-900">{selectedStock.symbol}</Text>
              <Text className="text-blue-700">{selectedStock.name}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedStock(null)} className="bg-blue-200 px-3 py-1 rounded-full">
              <Text className="text-blue-800 text-xs font-bold">Change</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-gray-700 font-semibold mb-2 ml-1">Quantity</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800 bg-gray-50"
            placeholder="e.g. 10"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
          
          <Text className="text-gray-700 font-semibold mb-2 ml-1">Buy Price (₹)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-8 text-gray-800 bg-gray-50"
            placeholder="e.g. 2500.50"
            keyboardType="numeric"
            value={buyPrice}
            onChangeText={setBuyPrice}
          />

          <TouchableOpacity 
            className="bg-green-600 rounded-lg py-4 items-center"
            onPress={handleAddStock}
          >
            <Text className="text-white font-bold text-lg">Add to Portfolio</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

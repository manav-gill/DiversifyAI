import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function ChatRoomsScreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const fetchRooms = async () => {
    try {
      // Determine the correct endpoint based on the user's role
      const endpoint = user?.role === 'advisor' ? '/chat/advisor/rooms' : '/chat/client/rooms';
      const response = await api.get(endpoint);
      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    const unsubscribe = navigation.addListener('focus', fetchRooms);
    return unsubscribe;
  }, [navigation, user?.role]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  }, [user?.role]);

  const renderRoom = ({ item }) => {
    // If user is client, the API returns the advisor nested object. 
    // If user is advisor, it returns the client.
    const counterParty = user?.role === 'advisor' ? item.client : item.advisor;
    const name = counterParty?.name || 'Unknown';
    const email = counterParty?.email || '';

    // Check session expiry strictly for clients UI hints
    let isExpired = false;
    let timeRemaining = null;
    
    if (user?.role === 'client' && item.accessExpiresAt) {
      const expiry = new Date(item.accessExpiresAt);
      const now = new Date();
      if (now > expiry) {
        isExpired = true;
      } else {
        const diffMs = expiry - now;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        timeRemaining = `${diffHrs}h left`;
      }
    }

    return (
      <TouchableOpacity 
        className={`bg-white p-4 rounded-xl shadow-sm mb-3 flex-row items-center border ${isExpired ? 'border-red-100 opacity-70' : 'border-gray-100'}`}
        onPress={() => navigation.navigate('Chat', { chatId: item.chatId, counterPartyName: name })}
      >
        <View className="w-14 h-14 bg-blue-100 rounded-full items-center justify-center mr-4">
          <Text className="text-blue-600 text-xl font-bold">{name.charAt(0)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{name}</Text>
          <Text className="text-gray-500 text-sm mt-1" numberOfLines={1} ellipsizeMode="tail">
            {item.lastMessage?.text || 'No messages yet'}
          </Text>
        </View>
        <View className="items-end justify-center pl-2">
          {user?.role === 'client' && (
            <View className={`px-2 py-1 rounded text-xs ${isExpired ? 'bg-red-100' : 'bg-green-100'}`}>
              <Text className={`text-xs font-bold ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                {isExpired ? 'Expired' : timeRemaining}
              </Text>
            </View>
          )}
          {item.lastMessage && (
            <Text className="text-gray-400 text-xs mt-2">
              {new Date(item.lastMessage.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.chatId}
        renderItem={renderRoom}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View className="items-center py-10 mt-10">
            <Ionicons name="chatbubble-outline" size={60} color="#cbd5e1" />
            <Text className="text-gray-500 text-lg mt-4 font-semibold">No Consultations Yet</Text>
            <Text className="text-gray-400 text-center mt-2 mx-6">
              {user?.role === 'advisor' 
                ? "You don't have any client consultations booked yet." 
                : "Book an advisor from the 'Advisors' tab to start a consultation."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

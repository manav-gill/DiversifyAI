import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function SettingsScreen() {
  const { logout, user } = useContext(AuthContext);

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <View className="bg-white p-6 rounded-xl shadow-sm mb-8 items-center">
        <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
          <Text className="text-blue-600 text-3xl font-bold">
            {user?.name?.charAt(0) || 'U'}
          </Text>
        </View>
        <Text className="text-xl font-bold text-gray-800">{user?.name || 'User'}</Text>
        <Text className="text-gray-500">{user?.email}</Text>
        <View className="mt-2 bg-blue-50 px-3 py-1 rounded">
          <Text className="text-blue-600 text-xs font-bold uppercase">{user?.role}</Text>
        </View>
      </View>

      <TouchableOpacity 
        className="bg-red-500 rounded-xl py-4 items-center flex-row justify-center"
        onPress={logout}
      >
        <Text className="text-white font-bold text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

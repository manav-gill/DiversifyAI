import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleRegister = async () => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      login(response.data.token, response.data.user);
    } catch (error) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-2 text-center text-gray-800">DiversifyAI</Text>
      <Text className="text-lg mb-8 text-center text-gray-500">Create a new client account</Text>
      
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800 bg-gray-50"
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800 bg-gray-50"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-800 bg-gray-50"
        placeholder="Password (min 6 chars)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity 
        className="bg-green-600 rounded-lg py-4 items-center mb-4"
        onPress={handleRegister}
      >
        <Text className="text-white font-bold text-lg">Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} className="py-2">
        <Text className="text-blue-600 text-center font-semibold">Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

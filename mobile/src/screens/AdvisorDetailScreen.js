import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AdvisorDetailScreen({ route, navigation }) {
  const { advisor } = route.params;
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleBookConsultation = async () => {
    setLoading(true);
    try {
      // 1. Create order on backend
      const orderRes = await api.post('/payment/create-order', {
        amount: 499, // Consultation fixed amount
        advisorId: advisor._id || advisor.id,
      });

      const { order, paymentId } = orderRes.data;

      // 2. Configure standard Razorpay options
      const options = {
        description: 'Portfolio Consultation',
        image: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
        currency: order.currency,
        key: 'rzp_test_YOUR_KEY_HERE', // REMINDER: Replace with your actual key / env variable
        amount: order.amount,
        name: 'DiversifyAI',
        order_id: order.id,
        prefill: {
          email: user?.email,
          contact: '',
          name: user?.name,
        },
        theme: { color: '#2563eb' },
      };

      // 3. Open Razorpay Checkout
      RazorpayCheckout.open(options)
        .then(async (data) => {
          // 4. Verify payment on backend
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: data.razorpay_order_id,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_signature: data.razorpay_signature,
              advisorId: advisor._id || advisor.id,
            });

            Alert.alert(
              'Payment Successful',
              'Your consultation session has been unlocked!',
              [
                { text: 'Go to Chat', onPress: () => navigation.navigate('ChatRooms') },
                { text: 'OK' }
              ]
            );
          } catch (verifyError) {
            Alert.alert('Verification Failed', 'Payment was successful but verification failed.');
          }
        })
        .catch((error) => {
          console.log('Payment dismissed/failed:', error);
          Alert.alert('Payment Cancelled', 'The payment flow was closed or failed.');
        });
        
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Could not initiate payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-white p-6 shadow-sm items-center border-b border-gray-100">
        <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4 mt-4">
          <Text className="text-blue-600 text-4xl font-bold">{advisor.name.charAt(0)}</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-800">{advisor.name}</Text>
        <Text className="text-blue-600 font-semibold mb-1">Expert Financial Advisor</Text>
        <Text className="text-gray-500 mb-4">{advisor.email}</Text>
      </View>

      <View className="p-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">About Consultation</Text>
        
        <View className="flex-row items-start mb-4">
          <Ionicons name="time-outline" size={24} color="#4b5563" className="mr-3" />
          <View className="flex-1 ml-3">
            <Text className="font-bold text-gray-800">24-Hour Access</Text>
            <Text className="text-gray-500">You will have full access to chat with the advisor for 24 hours after booking.</Text>
          </View>
        </View>

        <View className="flex-row items-start mb-4">
          <Ionicons name="bar-chart-outline" size={24} color="#4b5563" className="mr-3" />
          <View className="flex-1 ml-3">
            <Text className="font-bold text-gray-800">Auto-Shared Portfolio</Text>
            <Text className="text-gray-500">Your current portfolio snapshot will be securely shared with the advisor automatically to jumpstart the conversation.</Text>
          </View>
        </View>

        <View className="flex-row items-start mb-6">
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#4b5563" className="mr-3" />
          <View className="flex-1 ml-3">
            <Text className="font-bold text-gray-800">Expert Insights</Text>
            <Text className="text-gray-500">Ask questions, request rebalancing strategies, and get professional tailored advice.</Text>
          </View>
        </View>

        <View className="bg-blue-50 p-4 rounded-xl mb-8 flex-row justify-between items-center border border-blue-100">
          <Text className="text-gray-800 font-bold">Consultation Fee</Text>
          <Text className="text-2xl font-bold text-blue-600">₹499</Text>
        </View>

        <TouchableOpacity 
          className="bg-blue-600 rounded-xl py-4 flex-row items-center justify-center shadow-sm"
          onPress={handleBookConsultation}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="card-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text className="text-white font-bold text-lg">Pay & Book Now</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

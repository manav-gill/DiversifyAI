import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function ChatScreen({ route }) {
  const { chatId } = route.params;
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chat/messages/${chatId}`);
      
      // Transform backend format to gifted-chat format
      const formattedMessages = response.data.map((msg) => ({
        _id: msg._id,
        text: msg.message,
        createdAt: new Date(msg.createdAt),
        user: {
          _id: msg.sender._id,
          name: msg.sender.name,
        },
        // Preserve custom payloads for our custom bubble renderer
        messageType: msg.messageType,
        portfolioPayload: msg.payload,
      })).reverse(); // GiftedChat expects latest message at index 0
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // In a real prod app, you might want to wire up Socket.io or polling here.
    // For this prototype, polling every 5s is fine if you expect live replies.
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);
    return () => clearInterval(interval);
  }, [chatId]);

  const onSend = useCallback(async (newMessages = []) => {
    const text = newMessages[0].text;
    
    // Optimistically update UI
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

    try {
      await api.post('/chat/send', {
        chatId: chatId,
        message: text
      });
    } catch (error) {
      // Revert if expired/failed
      fetchMessages(); 
      alert(error.response?.data?.message || 'Failed to send message.');
    }
  }, [chatId]);

  // Render Custom Portfolio Snapshot Bubble
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.messageType === 'portfolio_snapshot' && currentMessage.portfolioPayload) {
      const p = currentMessage.portfolioPayload;
      return (
        <View className="bg-white p-3 m-2 rounded-lg mt-0 mx-2 shadow-sm border border-gray-100 min-w-[200px]">
          <Text className="font-bold text-gray-800 text-base mb-1 border-b border-gray-100 pb-1">📊 Portfolio Snapshot</Text>
          <Text className="text-gray-600 mt-1">Total Value: ₹{p.totalCurrentValue?.toLocaleString('en-IN') || 0}</Text>
          <Text className="text-gray-600">Holdings: {p.holdingsCount || 0}</Text>
          {p.sectors && p.sectors.length > 0 && (
            <View className="mt-2">
              <Text className="text-xs font-bold text-gray-500 mb-1 uppercase">Top Sectors</Text>
              {p.sectors.slice(0, 3).map((sec, i) => (
                <Text key={i} className="text-xs text-gray-700">• {sec.name}: {sec.allocation}%</Text>
              ))}
            </View>
          )}
        </View>
      );
    }
    return null;
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: '#2563eb' },
          left: { backgroundColor: '#f3f4f6' }
        }}
        textStyle={{
          right: { color: '#fff' },
          left: { color: '#1f2937' }
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View className="mr-4 mb-2">
          <Ionicons name="send" size={28} color="#2563eb" />
        </View>
      </Send>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: user?.id,
          name: user?.name,
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderCustomView={renderCustomView}
        alwaysShowSend
        scrollToBottom
      />
    </View>
  );
}

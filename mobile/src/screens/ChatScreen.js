import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChatMessages, sendChatMessage } from '../services/api';

export default function ChatScreen({ route }) {
  const { chatId } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem('@diversify_ai_user').then((str) => {
      if (str) setUser(JSON.parse(str));
    });
  }, []);

  const loadMessages = async () => {
    if (!chatId) {
      setLoading(false);
      return;
    }
    
    try {
      const data = await getChatMessages(chatId);
      setMessages(data.messages || []);
    } catch (e) {
      console.log('Error fetching messages:', e);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;
    try {
      setSending(true);
      await sendChatMessage(chatId, inputText.trim());
      setInputText('');
      loadMessages();
    } catch (e) {
      console.log('Error sending message:', e);
    } finally {
      setSending(false);
    }
  };

  const isMyMessage = (msg) => {
    const senderId = msg?.sender?._id || msg?.sender?.id;
    const currentUserId = user?._id || user?.id;
    if (senderId && currentUserId) {
      return String(senderId) === String(currentUserId);
    }
    return msg?.sender?.name === 'You' || msg?.sender?.name === user?.name;
  };

  const renderMessage = ({ item }) => {
    const mine = isMyMessage(item);
    
    // Simplistic Portfolio Snippet parse logic for Mobile Fallback
    const isPortfolio = item?.messageType === 'portfolio_snapshot' || (item?.message && item.message.toLowerCase().includes('portfolio snapshot'));

    if (isPortfolio) {
      return (
        <View style={styles.portfolioCard}>
          <Text style={styles.portfolioTag}>PORTFOLIO SNAPSHOT</Text>
          <Text style={styles.portfolioDesc} numberOfLines={2}>Details shared in consultation.</Text>
        </View>
      );
    }

    return (
      <View style={[styles.messageRow, mine ? styles.messageRowMine : styles.messageRowOther]}>
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
          <Text style={[styles.messageText, mine ? styles.messageTextMine : styles.messageTextOther]}>
            {item.message || ''}
          </Text>
        </View>
        <Text style={styles.senderSubtext}>
          {item?.sender?.name || 'Unknown'} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#00C896" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => String(item._id || Math.random())}
            renderItem={renderMessage}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Start your consultation...</Text>
            }
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          editable={!sending && !!chatId}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!inputText.trim() || sending) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || sending}
        >
          <Text style={styles.sendBtnText}>{sending ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 40,
  },
  messageRow: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  messageRowMine: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  messageRowOther: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 4,
  },
  bubbleMine: {
    backgroundColor: '#00C896',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EEF4',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTextMine: {
    color: '#FFFFFF',
  },
  messageTextOther: {
    color: '#0F172A',
  },
  senderSubtext: {
    fontSize: 11,
    color: '#94A3B8',
  },
  portfolioCard: {
    backgroundColor: '#E6F4FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    alignSelf: 'center',
    width: '90%',
  },
  portfolioTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
    marginBottom: 4,
  },
  portfolioDesc: {
    fontSize: 13,
    color: '#0F172A',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EEF4',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#F5F7FA',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0F172A',
  },
  sendBtn: {
    marginLeft: 12,
    backgroundColor: '#00C896',
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#A7F3D0',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

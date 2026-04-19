import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import apiClient from '../services/api';

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      const token = response.data?.token;
      const user = response.data?.user;

      if (!token) {
        throw new Error('Token not received from server');
      }

      if (typeof onLoginSuccess === 'function') {
        await onLoginSuccess(token, user);
      }
    } catch (apiError) {
      const message =
        apiError.response?.data?.message || apiError.message || 'Login failed';
      console.error('Login failed:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue to Diversify AI</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>Do not have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    paddingVertical: 22,
    paddingHorizontal: 18,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B91C1C',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCE5EE',
    backgroundColor: '#FBFDFF',
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 10,
  },
  primaryButton: {
    marginTop: 6,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#00C896',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  linkButton: {
    marginTop: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
});

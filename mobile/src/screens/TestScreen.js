import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TestScreen() {
  const handleTestAPI = () => {
    console.log('API Working');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>PortfolioPilot Mobile Running ✅</Text>
      <TouchableOpacity style={styles.button} onPress={handleTestAPI}>
        <Text style={styles.buttonText}>Test API</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  mainText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

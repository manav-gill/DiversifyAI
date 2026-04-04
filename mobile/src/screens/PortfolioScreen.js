import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PortfolioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portfolio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
});

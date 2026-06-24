/**
 * Simple Test Screen
 * Minimal setup to test if app loads
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>✅ App is working!</Text>
      <Text style={styles.small}>If you see this, the basic setup is correct.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  small: {
    fontSize: 14,
    color: '#666',
  },
});

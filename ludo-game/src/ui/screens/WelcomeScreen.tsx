/**
 * Welcome Screen
 * Initial screen shown when app launches
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME_COLORS } from '@utils/colors';

export default function WelcomeScreen() {
  const handleContinue = () => {
    // Navigation will be added in future features
    console.log('Continue pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ludo Game</Text>
        <Text style={styles.subtitle}>Welcome to the classic board game</Text>

        <TouchableOpacity style={styles.button} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: THEME_COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: THEME_COLORS.text.secondary,
    marginBottom: 48,
  },
  button: {
    backgroundColor: THEME_COLORS.primary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: THEME_COLORS.text.inverse,
    fontSize: 18,
    fontWeight: '600',
  },
  version: {
    position: 'absolute',
    bottom: 16,
    fontSize: 12,
    color: THEME_COLORS.text.disabled,
  },
});

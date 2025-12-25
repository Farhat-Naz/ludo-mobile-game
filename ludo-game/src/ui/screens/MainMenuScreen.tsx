/**
 * MainMenuScreen
 * Main menu with game options
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { THEME_COLORS } from '@utils/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/contracts/navigation.contract.simple';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function MainMenuScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ludo</Text>
          <Text style={styles.subtitle}>Classic Board Game</Text>
        </View>

        {/* Menu Buttons */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('ModeSelection')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonText}>New Game</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.menuButtonSecondary]}
            onPress={() => {
              // TODO: Navigate to resume game
              console.log('Resume game');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.menuButtonText, styles.menuButtonTextSecondary]}>
              Resume Game
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.menuButtonSecondary]}
            onPress={() => {
              // TODO: Navigate to settings
              console.log('Settings');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.menuButtonText, styles.menuButtonTextSecondary]}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.menuButtonSecondary]}
            onPress={() => {
              // TODO: Navigate to how to play
              console.log('How to play');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.menuButtonText, styles.menuButtonTextSecondary]}>
              How to Play
            </Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: THEME_COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: THEME_COLORS.text.secondary,
  },
  menuContainer: {
    gap: 16,
    marginBottom: 32,
  },
  menuButton: {
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButtonSecondary: {
    backgroundColor: THEME_COLORS.surface,
    elevation: 0,
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_COLORS.text.inverse,
  },
  menuButtonTextSecondary: {
    color: THEME_COLORS.text.primary,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: THEME_COLORS.text.disabled,
  },
});

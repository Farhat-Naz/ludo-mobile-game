/**
 * ModeSelectionScreen
 * Select game mode (1P, 2P, 3P, 4P)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { THEME_COLORS } from '@utils/colors';
import { useGameStore } from '@state/gameStore';
import type { GameMode } from '@state/gameStore';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/contracts/navigation.contract.simple';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ModeSelection'>;
};

export default function ModeSelectionScreen({ navigation }: Props) {
  const startGame = useGameStore((state) => state.startGame);

  const handleModeSelect = (mode: GameMode) => {
    startGame(mode);
    navigation.navigate('Game');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Select Game Mode</Text>
          <Text style={styles.subtitle}>Choose number of players</Text>
        </View>

        {/* Mode Options */}
        <View style={styles.modesContainer}>
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => handleModeSelect('1p')}
            activeOpacity={0.8}
          >
            <Text style={styles.modeTitle}>1 Player</Text>
            <Text style={styles.modeDescription}>Play against AI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => handleModeSelect('2p')}
            activeOpacity={0.8}
          >
            <Text style={styles.modeTitle}>2 Players</Text>
            <Text style={styles.modeDescription}>Local multiplayer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => handleModeSelect('3p')}
            activeOpacity={0.8}
          >
            <Text style={styles.modeTitle}>3 Players</Text>
            <Text style={styles.modeDescription}>Local multiplayer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => handleModeSelect('4p')}
            activeOpacity={0.8}
          >
            <Text style={styles.modeTitle}>4 Players</Text>
            <Text style={styles.modeDescription}>Local multiplayer</Text>
          </TouchableOpacity>
        </View>
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
  },
  header: {
    paddingVertical: 16,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: THEME_COLORS.primary,
    fontWeight: '600',
  },
  titleContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME_COLORS.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: THEME_COLORS.text.secondary,
  },
  modesContainer: {
    flex: 1,
    gap: 16,
    paddingBottom: 32,
  },
  modeCard: {
    backgroundColor: THEME_COLORS.surface,
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME_COLORS.divider,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  modeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_COLORS.primary,
    marginBottom: 8,
  },
  modeDescription: {
    fontSize: 14,
    color: THEME_COLORS.text.secondary,
  },
});

/**
 * WinScreen
 * Displays game results and winner
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { THEME_COLORS } from '@utils/colors';
import { useGameStore } from '@state/gameStore';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/contracts/navigation.contract.simple';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Win'>;
};

export default function WinScreen({ navigation }: Props) {
  const winState = useGameStore((state) => state.winState);
  const resetGame = useGameStore((state) => state.resetGame);
  const startGame = useGameStore((state) => state.startGame);
  const mode = useGameStore((state) => state.mode);

  const handleNewGame = () => {
    if (mode) {
      startGame(mode);
      navigation.replace('Game');
    }
  };

  const handleMainMenu = () => {
    resetGame();
    navigation.navigate('Home');
  };

  if (!winState) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>No game results available</Text>
          <TouchableOpacity style={styles.button} onPress={handleMainMenu}>
            <Text style={styles.buttonText}>Return to Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getPlayerColor = (player: string) => {
    switch (player) {
      case 'red':
        return THEME_COLORS.players.red;
      case 'blue':
        return THEME_COLORS.players.blue;
      case 'green':
        return THEME_COLORS.players.green;
      case 'yellow':
        return THEME_COLORS.players.yellow;
      default:
        return THEME_COLORS.text.secondary;
    }
  };

  const getPositionEmoji = (position: number) => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      case 4:
        return '4️⃣';
      default:
        return '';
    }
  };

  const winner = winState.rankings.find((r) => r.position === 1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Celebration Header */}
        <View style={styles.celebrationContainer}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.winnerTitle}>Winner!</Text>
          <Text style={styles.celebrationEmoji}>🎉</Text>
        </View>

        {/* Winner Display */}
        {winner && (
          <View style={[styles.winnerCard, { borderColor: getPlayerColor(winner.player) }]}>
            <Text style={styles.winnerEmoji}>{getPositionEmoji(1)}</Text>
            <Text style={[styles.winnerName, { color: getPlayerColor(winner.player) }]}>
              {winner.player.toUpperCase()}
            </Text>
            <Text style={styles.winnerStats}>
              {winner.finishedTokens} tokens finished
            </Text>
          </View>
        )}

        {/* Rankings */}
        <View style={styles.rankingsContainer}>
          <Text style={styles.rankingsTitle}>Final Rankings</Text>

          {winState.rankings.map((ranking) => (
            <View
              key={ranking.player}
              style={[
                styles.rankingCard,
                ranking.position === 1 && styles.rankingCardFirst,
              ]}
            >
              <View style={styles.rankingLeft}>
                <Text style={styles.rankingPosition}>{getPositionEmoji(ranking.position)}</Text>
                <Text style={[styles.rankingPlayer, { color: getPlayerColor(ranking.player) }]}>
                  {ranking.player.toUpperCase()}
                </Text>
              </View>
              <View style={styles.rankingRight}>
                <Text style={styles.rankingTokens}>{ranking.finishedTokens}/4 tokens</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleNewGame} activeOpacity={0.8}>
            <Text style={styles.buttonText}>New Game</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleMainMenu}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Main Menu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  celebrationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 12,
  },
  celebrationEmoji: {
    fontSize: 48,
  },
  winnerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: THEME_COLORS.primary,
  },
  winnerCard: {
    backgroundColor: THEME_COLORS.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  winnerEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  winnerName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  winnerStats: {
    fontSize: 16,
    color: THEME_COLORS.text.secondary,
  },
  rankingsContainer: {
    marginBottom: 32,
  },
  rankingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_COLORS.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  rankingCard: {
    backgroundColor: THEME_COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: THEME_COLORS.divider,
  },
  rankingCardFirst: {
    borderColor: THEME_COLORS.secondary,
    backgroundColor: THEME_COLORS.secondary + '10',
  },
  rankingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankingPosition: {
    fontSize: 32,
    width: 40,
  },
  rankingPlayer: {
    fontSize: 20,
    fontWeight: '600',
  },
  rankingRight: {
    alignItems: 'flex-end',
  },
  rankingTokens: {
    fontSize: 16,
    color: THEME_COLORS.text.secondary,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 16,
    marginTop: 'auto',
  },
  button: {
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
  buttonSecondary: {
    backgroundColor: THEME_COLORS.surface,
    elevation: 0,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_COLORS.text.inverse,
  },
  buttonTextSecondary: {
    color: THEME_COLORS.text.primary,
  },
  errorText: {
    fontSize: 18,
    color: THEME_COLORS.text.secondary,
    textAlign: 'center',
  },
});

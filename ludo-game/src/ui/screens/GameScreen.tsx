/**
 * GameScreen
 * Main game screen with board, dice, and game controls
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { THEME_COLORS } from '@utils/colors';
import GameBoard from '@ui/components/GameBoard';
import DiceButton from '@ui/components/DiceButton';
import TurnIndicator from '@ui/components/TurnIndicator';
import { useGameStore } from '@state/gameStore';
import { triggerHaptic, HapticFeedback } from '@services/hapticService';
import { playSoundEffect, SoundEffect } from '@services/audioService';
import {
  isAIPlayer,
  selectAIMove,
  getAIDifficulty,
  getAIThinkingDelay,
} from '@services/aiService';
import type { PlayerColor } from '@utils/constants';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/contracts/navigation.contract.simple';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
};

export default function GameScreen({ navigation }: Props) {
  const [isRolling, setIsRolling] = useState(false);
  const [isAITurn, setIsAITurn] = useState(false);

  const {
    mode,
    turnState,
    lastDiceRoll,
    isActive,
    isPaused,
    selectedTokenId,
    moveableTokenIds,
    tokens,
    winState,
    rollDice,
    selectToken,
    moveSelectedToken,
    endCurrentTurn,
    pauseGame,
  } = useGameStore();

  // Check for game completion and navigate to win screen
  useEffect(() => {
    if (winState?.isGameOver && isActive) {
      // Small delay to show final move before navigating
      const timer = setTimeout(() => {
        navigation.replace('Win');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [winState?.isGameOver, isActive, navigation]);

  // AI Turn Handler
  useEffect(() => {
    if (!isActive || isPaused || !turnState || !mode) return;

    const currentPlayer = turnState.currentPlayer as PlayerColor;
    const isAI = isAIPlayer(currentPlayer, mode);

    if (isAI && !isAITurn && !isRolling) {
      setIsAITurn(true);

      // AI rolls dice automatically after a short delay
      if (!lastDiceRoll) {
        const rollDelay = 800 + Math.random() * 400; // 800-1200ms
        setTimeout(() => {
          handleRoll();
        }, rollDelay);
      } else if (moveableTokenIds.length > 0) {
        // AI selects and moves a token
        const playerTokens = tokens.filter((t) => t.player === currentPlayer);
        const difficulty = getAIDifficulty(currentPlayer);
        const selectedAIToken = selectAIMove(playerTokens, lastDiceRoll, tokens, difficulty);

        if (selectedAIToken) {
          const thinkingDelay = getAIThinkingDelay(difficulty);
          setTimeout(() => {
            selectToken(selectedAIToken.id);
            // Move after brief pause
            setTimeout(() => {
              moveSelectedToken();
              setIsAITurn(false);
            }, 300);
          }, thinkingDelay);
        }
      } else {
        // No moves available, end turn
        setTimeout(() => {
          setIsAITurn(false);
        }, 1500);
      }
    } else if (!isAI && isAITurn) {
      setIsAITurn(false);
    }
  }, [
    isActive,
    isPaused,
    turnState,
    mode,
    lastDiceRoll,
    moveableTokenIds,
    tokens,
    isAITurn,
    isRolling,
    selectToken,
    moveSelectedToken,
  ]);

  const handleRoll = () => {
    if (isRolling || !isActive || isPaused) return;

    setIsRolling(true);
    triggerHaptic(HapticFeedback.MEDIUM);
    playSoundEffect(SoundEffect.DICE_ROLL);

    // Simulate dice roll animation
    setTimeout(() => {
      const roll = rollDice();
      setIsRolling(false);

      // Haptic feedback based on roll
      if (roll === 6) {
        triggerHaptic(HapticFeedback.SUCCESS);
      } else {
        triggerHaptic(HapticFeedback.LIGHT);
      }

      // If no tokens can move, auto-advance turn after a delay
      if (moveableTokenIds.length === 0) {
        triggerHaptic(HapticFeedback.WARNING);
        setTimeout(() => {
          endCurrentTurn();
        }, 1500);
      }
    }, 800);
  };

  const handleMove = () => {
    triggerHaptic(HapticFeedback.MEDIUM);
    playSoundEffect(SoundEffect.TOKEN_MOVE);
    moveSelectedToken();
  };

  const handlePause = () => {
    pauseGame();
  };

  if (!isActive || !turnState) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>No Active Game</Text>
          <Text style={styles.subtitle}>Start a new game from the menu</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TurnIndicator currentPlayer={turnState.currentPlayer as PlayerColor} isYourTurn={true} />

        <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
          <Text style={styles.pauseText}>⏸</Text>
        </TouchableOpacity>
      </View>

      {/* Game Board */}
      <View style={styles.boardContainer}>
        <GameBoard />
      </View>

      {/* Game Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Turn: {turnState.turnNumber}</Text>
        {turnState.consecutiveSixes > 0 && (
          <Text style={styles.infoText}>
            Consecutive 6s: {turnState.consecutiveSixes}
          </Text>
        )}
      </View>

      {/* Dice and Move Controls */}
      <View style={styles.controlsContainer}>
        {isAITurn ? (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>AI is thinking...</Text>
          </View>
        ) : (
          <>
            <View style={styles.diceContainer}>
              <DiceButton
                value={lastDiceRoll}
                enabled={!isRolling && !isPaused && !lastDiceRoll}
                onRoll={handleRoll}
                isRolling={isRolling}
              />
            </View>

            {/* Move Button - shown when token is selected */}
            {selectedTokenId && lastDiceRoll && (
              <View style={styles.moveButtonContainer}>
                <TouchableOpacity style={styles.moveButton} onPress={handleMove} activeOpacity={0.8}>
                  <Text style={styles.moveButtonText}>Move Token</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* No moves feedback */}
            {lastDiceRoll && moveableTokenIds.length === 0 && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>No moves available</Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Pause Overlay */}
      {isPaused && (
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseCard}>
            <Text style={styles.pauseTitle}>Game Paused</Text>
            <TouchableOpacity
              style={styles.resumeButton}
              onPress={() => useGameStore.getState().resumeGame()}
            >
              <Text style={styles.resumeButtonText}>Resume</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pauseButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME_COLORS.surface,
    borderRadius: 22,
  },
  pauseText: {
    fontSize: 20,
  },
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: THEME_COLORS.text.secondary,
    marginVertical: 2,
  },
  controlsContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    gap: 12,
  },
  diceContainer: {
    alignItems: 'center',
  },
  moveButtonContainer: {
    width: '80%',
  },
  moveButton: {
    backgroundColor: THEME_COLORS.success,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  moveButtonText: {
    color: THEME_COLORS.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: THEME_COLORS.warning + '20',
    borderRadius: 8,
  },
  feedbackText: {
    color: THEME_COLORS.warning,
    fontSize: 14,
    fontWeight: '500',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_COLORS.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: THEME_COLORS.text.secondary,
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseCard: {
    backgroundColor: THEME_COLORS.background,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 250,
  },
  pauseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_COLORS.text.primary,
    marginBottom: 24,
  },
  resumeButton: {
    backgroundColor: THEME_COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resumeButtonText: {
    color: THEME_COLORS.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});

/**
 * TurnIndicator Component
 * Shows which player's turn it is
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME_COLORS } from '@utils/colors';
import type { PlayerColor } from '@utils/constants';

interface TurnIndicatorProps {
  /**
   * Current player color
   */
  currentPlayer: PlayerColor;

  /**
   * Whether it's the local player's turn (for highlighting)
   */
  isYourTurn?: boolean;
}

export default function TurnIndicator({ currentPlayer, isYourTurn = false }: TurnIndicatorProps) {
  const getPlayerColorStyle = (color: PlayerColor) => {
    switch (color) {
      case 'red':
        return { backgroundColor: THEME_COLORS.players.red };
      case 'blue':
        return { backgroundColor: THEME_COLORS.players.blue };
      case 'green':
        return { backgroundColor: THEME_COLORS.players.green };
      case 'yellow':
        return { backgroundColor: THEME_COLORS.players.yellow };
      default:
        return { backgroundColor: THEME_COLORS.text.disabled };
    }
  };

  const getPlayerName = (color: PlayerColor) => {
    return color.charAt(0).toUpperCase() + color.slice(1);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, getPlayerColorStyle(currentPlayer)]} />
      <Text style={styles.text}>
        {isYourTurn ? 'Your Turn' : `${getPlayerName(currentPlayer)}'s Turn`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: THEME_COLORS.surface,
    borderRadius: 8,
  },
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
});

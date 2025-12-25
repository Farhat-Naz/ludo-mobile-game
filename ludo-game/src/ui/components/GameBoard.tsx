/**
 * GameBoard Component
 * Visual representation of the Ludo board
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { THEME_COLORS } from '@utils/colors';
import { UI_CONSTANTS } from '@utils/constants';
import { useGameStore } from '@state/gameStore';
import Token from './Token';
import { getTokenScreenPosition } from '@utils/boardPositions';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BOARD_SIZE = SCREEN_WIDTH - (UI_CONSTANTS.BOARD_PADDING * 2);

/**
 * Animated Token Container
 * Handles smooth position transitions for tokens
 */
function AnimatedTokenContainer({
  tokenId,
  position,
  isMoveable,
  isSelected,
  isCut,
  onPress,
  playerColor,
}: {
  tokenId: string;
  position: { x: number; y: number };
  isMoveable: boolean;
  isSelected: boolean;
  isCut: boolean;
  onPress: () => void;
  playerColor: string;
}) {
  const tokenSize = UI_CONSTANTS.TOKEN_SIZE;

  const animatedStyle = useAnimatedStyle(() => ({
    left: withTiming(position.x - tokenSize / 2, { duration: 300 }),
    top: withTiming(position.y - tokenSize / 2, { duration: 300 }),
  }));

  return (
    <Animated.View style={[styles.tokenContainer, animatedStyle]}>
      <Token
        playerColor={playerColor as any}
        selected={isSelected}
        enabled={isMoveable}
        isCut={isCut}
        onPress={onPress}
      />
    </Animated.View>
  );
}

export default function GameBoard() {
  const tokens = useGameStore((state) => state.tokens);
  const selectedTokenId = useGameStore((state) => state.selectedTokenId);
  const moveableTokenIds = useGameStore((state) => state.moveableTokenIds);
  const lastDiceRoll = useGameStore((state) => state.lastDiceRoll);
  const cutTokenId = useGameStore((state) => state.cutTokenId);
  const selectToken = useGameStore((state) => state.selectToken);
  const moveSelectedToken = useGameStore((state) => state.moveSelectedToken);

  const handleTokenPress = (tokenId: string) => {
    // If token is already selected, move it
    if (selectedTokenId === tokenId) {
      moveSelectedToken();
    } else {
      // Otherwise, select it
      selectToken(tokenId);
    }
  };

  // Calculate target position for selected token
  const getTargetPosition = () => {
    if (!selectedTokenId || !lastDiceRoll) return null;

    const selectedToken = tokens.find((t) => t.id === selectedTokenId);
    if (!selectedToken) return null;

    // Create a simulated moved token to get target position
    const targetToken = {
      ...selectedToken,
      distanceTraveled: selectedToken.distanceTraveled + lastDiceRoll,
      position:
        selectedToken.status === 'home'
          ? 0 // Opening position
          : (selectedToken.position + lastDiceRoll) % 72,
      status: selectedToken.status === 'home' ? ('active' as const) : selectedToken.status,
    };

    return getTokenScreenPosition(targetToken, BOARD_SIZE);
  };

  const targetPosition = getTargetPosition();

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {/* Red Home (Top Left) */}
        <View style={[styles.homeArea, styles.homeTopLeft, { backgroundColor: THEME_COLORS.players.red }]} />

        {/* Blue Home (Top Right) */}
        <View style={[styles.homeArea, styles.homeTopRight, { backgroundColor: THEME_COLORS.players.blue }]} />

        {/* Center Cross (Main playing area) */}
        <View style={styles.centerCross}>
          {/* Vertical strip */}
          <View style={styles.verticalStrip} />
          {/* Horizontal strip */}
          <View style={styles.horizontalStrip} />
          {/* Center square */}
          <View style={styles.centerSquare} />
        </View>

        {/* Green Home (Bottom Left) */}
        <View style={[styles.homeArea, styles.homeBottomLeft, { backgroundColor: THEME_COLORS.players.green }]} />

        {/* Yellow Home (Bottom Right) */}
        <View style={[styles.homeArea, styles.homeBottomRight, { backgroundColor: THEME_COLORS.players.yellow }]} />

        {/* Target Position Indicator */}
        {targetPosition && (
          <View
            style={[
              styles.targetIndicator,
              {
                left: targetPosition.x - UI_CONSTANTS.TOKEN_SIZE / 2,
                top: targetPosition.y - UI_CONSTANTS.TOKEN_SIZE / 2,
              },
            ]}
          >
            <View style={styles.targetInner} />
          </View>
        )}

        {/* Render all tokens */}
        {tokens.map((token) => {
          const position = getTokenScreenPosition(token, BOARD_SIZE);
          const isMoveable = moveableTokenIds.includes(token.id);
          const isCut = cutTokenId === token.id;

          return (
            <AnimatedTokenContainer
              key={token.id}
              tokenId={token.id}
              position={position}
              isMoveable={isMoveable}
              isSelected={selectedTokenId === token.id}
              isCut={isCut}
              onPress={() => handleTokenPress(token.id)}
              playerColor={token.player}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: UI_CONSTANTS.BOARD_PADDING,
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: THEME_COLORS.board.background,
    position: 'relative',
    borderWidth: 2,
    borderColor: THEME_COLORS.board.border,
  },
  homeArea: {
    position: 'absolute',
    width: '40%',
    height: '40%',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: THEME_COLORS.board.border,
  },
  homeTopLeft: {
    top: '5%',
    left: '5%',
  },
  homeTopRight: {
    top: '5%',
    right: '5%',
  },
  homeBottomLeft: {
    bottom: '5%',
    left: '5%',
  },
  homeBottomRight: {
    bottom: '5%',
    right: '5%',
  },
  centerCross: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalStrip: {
    position: 'absolute',
    width: '20%',
    height: '100%',
    backgroundColor: THEME_COLORS.board.path,
  },
  horizontalStrip: {
    position: 'absolute',
    width: '100%',
    height: '20%',
    backgroundColor: THEME_COLORS.board.path,
  },
  centerSquare: {
    position: 'absolute',
    width: '20%',
    height: '20%',
    backgroundColor: THEME_COLORS.board.center,
    borderRadius: 4,
  },
  tokenContainer: {
    position: 'absolute',
  },
  targetIndicator: {
    position: 'absolute',
    width: UI_CONSTANTS.TOKEN_SIZE,
    height: UI_CONSTANTS.TOKEN_SIZE,
    borderRadius: UI_CONSTANTS.TOKEN_SIZE / 2,
    backgroundColor: THEME_COLORS.success + '30',
    borderWidth: 3,
    borderColor: THEME_COLORS.success,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetInner: {
    width: UI_CONSTANTS.TOKEN_SIZE * 0.3,
    height: UI_CONSTANTS.TOKEN_SIZE * 0.3,
    borderRadius: (UI_CONSTANTS.TOKEN_SIZE * 0.3) / 2,
    backgroundColor: THEME_COLORS.success,
  },
});

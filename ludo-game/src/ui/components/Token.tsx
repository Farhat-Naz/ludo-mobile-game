/**
 * Token Component
 * Visual representation of a player's game piece
 */

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { THEME_COLORS } from '@utils/colors';
import { UI_CONSTANTS } from '@utils/constants';
import type { PlayerColor } from '@utils/constants';

interface TokenProps {
  /**
   * Player color who owns this token
   */
  playerColor: PlayerColor;

  /**
   * Whether token is selected
   */
  selected?: boolean;

  /**
   * Whether token can be selected/moved
   */
  enabled?: boolean;

  /**
   * Whether token was just cut (for animation)
   */
  isCut?: boolean;

  /**
   * Callback when token is tapped
   */
  onPress?: () => void;

  /**
   * Token position (for animations)
   */
  position?: { x: number; y: number };
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function Token({
  playerColor,
  selected = false,
  enabled = true,
  isCut = false,
  onPress,
  position,
}: TokenProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  // Shake animation when token is cut
  React.useEffect(() => {
    if (isCut) {
      // Shake left and right
      rotation.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 50 })
      );
      // Pulse scale
      scale.value = withSequence(
        withSpring(1.3, { damping: 5, stiffness: 150 }),
        withSpring(0.8, { damping: 5, stiffness: 150 }),
        withSpring(1, { damping: 8, stiffness: 100 })
      );
    }
  }, [isCut]);

  const handlePress = () => {
    if (!enabled || !onPress) return;

    // Pulse animation on press
    scale.value = withSpring(1.2, { damping: 10, stiffness: 100 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    });

    onPress();
  };

  const getTokenColor = (color: PlayerColor) => {
    switch (color) {
      case 'red':
        return THEME_COLORS.players.red;
      case 'blue':
        return THEME_COLORS.players.blue;
      case 'green':
        return THEME_COLORS.players.green;
      case 'yellow':
        return THEME_COLORS.players.yellow;
      default:
        return THEME_COLORS.text.disabled;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <AnimatedTouchable
      style={[
        styles.token,
        { backgroundColor: getTokenColor(playerColor) },
        selected && styles.tokenSelected,
        !enabled && styles.tokenDisabled,
        animatedStyle,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={!enabled}
    >
      {/* Inner circle for depth */}
      <Animated.View style={[styles.innerCircle, { borderColor: getTokenColor(playerColor) }]} />
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  token: {
    width: UI_CONSTANTS.TOKEN_SIZE,
    height: UI_CONSTANTS.TOKEN_SIZE,
    borderRadius: UI_CONSTANTS.TOKEN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tokenSelected: {
    elevation: 8,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: '#FFD700', // Gold border when selected
  },
  tokenDisabled: {
    opacity: 0.6,
    elevation: 2,
  },
  innerCircle: {
    width: UI_CONSTANTS.TOKEN_SIZE * 0.6,
    height: UI_CONSTANTS.TOKEN_SIZE * 0.6,
    borderRadius: (UI_CONSTANTS.TOKEN_SIZE * 0.6) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
  },
});

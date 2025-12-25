/**
 * DiceButton Component
 * Interactive dice button with roll animation
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { THEME_COLORS } from '@utils/colors';
import { UI_CONSTANTS, ANIMATION_TIMINGS } from '@utils/constants';

interface DiceButtonProps {
  /**
   * Current dice value (1-6) or null if not rolled
   */
  value: number | null;

  /**
   * Whether the button is enabled
   */
  enabled: boolean;

  /**
   * Callback when dice is rolled
   */
  onRoll: () => void;

  /**
   * Whether dice is currently rolling (animating)
   */
  isRolling?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function DiceButton({ value, enabled, onRoll, isRolling = false }: DiceButtonProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const handlePress = () => {
    if (!enabled || isRolling) return;

    // Rotation animation
    rotation.value = withSequence(
      withTiming(360, { duration: ANIMATION_TIMINGS.DICE_ROLL }),
      withTiming(0, { duration: 0 })
    );

    // Scale animation (bounce effect)
    scale.value = withSequence(
      withSpring(1.2, { damping: 2, stiffness: 80 }),
      withSpring(1, { damping: 2, stiffness: 80 })
    );

    onRoll();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  const getDiceDots = (val: number | null) => {
    if (val === null) return '?';
    return val.toString();
  };

  return (
    <View style={styles.container}>
      <AnimatedTouchable
        style={[
          styles.button,
          animatedStyle,
          !enabled && styles.buttonDisabled,
          isRolling && styles.buttonRolling,
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={!enabled || isRolling}
      >
        <Text style={[styles.diceValue, !enabled && styles.diceValueDisabled]}>
          {getDiceDots(value)}
        </Text>
      </AnimatedTouchable>

      <Text style={styles.label}>{isRolling ? 'Rolling...' : enabled ? 'Roll Dice' : 'Wait...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: UI_CONSTANTS.DICE_SIZE,
    height: UI_CONSTANTS.DICE_SIZE,
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    backgroundColor: THEME_COLORS.text.disabled,
    elevation: 0,
  },
  buttonRolling: {
    backgroundColor: THEME_COLORS.secondary,
  },
  diceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME_COLORS.text.inverse,
  },
  diceValueDisabled: {
    color: THEME_COLORS.text.secondary,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
});

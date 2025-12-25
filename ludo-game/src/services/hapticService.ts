/**
 * Haptic Service
 * Manages haptic feedback for game events
 */

import * as Haptics from 'expo-haptics';

let hapticsEnabled = true;

/**
 * Haptic feedback types
 */
export enum HapticFeedback {
  LIGHT = 'LIGHT',
  MEDIUM = 'MEDIUM',
  HEAVY = 'HEAVY',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

/**
 * Trigger haptic feedback
 * @param feedback - Type of haptic feedback
 */
export async function triggerHaptic(feedback: HapticFeedback): Promise<void> {
  if (!hapticsEnabled) return;

  try {
    switch (feedback) {
      case HapticFeedback.LIGHT:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case HapticFeedback.MEDIUM:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case HapticFeedback.HEAVY:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case HapticFeedback.SUCCESS:
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case HapticFeedback.WARNING:
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case HapticFeedback.ERROR:
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  } catch (error) {
    console.error(`Failed to trigger haptic feedback ${feedback}:`, error);
  }
}

/**
 * Enable haptic feedback
 */
export function enableHaptics(): void {
  hapticsEnabled = true;
}

/**
 * Disable haptic feedback
 */
export function disableHaptics(): void {
  hapticsEnabled = false;
}

/**
 * Check if haptics are enabled
 */
export function areHapticsEnabled(): boolean {
  return hapticsEnabled;
}

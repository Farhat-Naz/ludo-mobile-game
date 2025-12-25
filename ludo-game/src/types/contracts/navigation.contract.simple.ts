/**
 * Navigation Contract (Simplified)
 * Type-safe navigation for current implementation
 */

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * Root Stack Parameter List
 */
export type RootStackParamList = {
  Home: undefined;
  ModeSelection: undefined;
  Game: undefined;
  Win: undefined;
  Settings: undefined;
  HowToPlay: undefined;
};

/**
 * Navigation prop type
 */
export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

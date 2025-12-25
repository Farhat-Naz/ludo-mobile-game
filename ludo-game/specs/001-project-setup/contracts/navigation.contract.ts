/**
 * Navigation Contract
 *
 * Defines the type-safe navigation structure for React Navigation.
 * Ensures all screen routes and parameters are correctly typed.
 *
 * @feature 001-project-setup
 * @library @react-navigation/native, @react-navigation/native-stack
 * @reference https://reactnavigation.org/docs/typescript/
 */

/**
 * Game mode type
 */
export type GameMode = 'single' | 'multi';

/**
 * Player count for multiplayer games
 */
export type PlayerCount = 2 | 3 | 4;

/**
 * Player color options
 */
export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow';

/**
 * Root stack navigator parameter list
 *
 * Defines all screens in the app and their required parameters.
 * Use with React Navigation's typed hooks:
 *
 * @example
 * ```tsx
 * import { NativeStackNavigationProp } from '@react-navigation/native-stack';
 * import { RootStackParamList } from '@/types/contracts/navigation.contract';
 *
 * type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
 * ```
 */
export type RootStackParamList = {
  /**
   * Home screen (main menu)
   * No parameters required
   */
  Home: undefined;

  /**
   * Game mode selection screen
   * User chooses single-player (AI) or local multiplayer
   */
  GameModeSelection: undefined;

  /**
   * Player count selection screen (for multiplayer)
   * User chooses 2, 3, or 4 players
   */
  PlayerCountSelection: {
    /**
     * Selected game mode
     */
    mode: GameMode;
  };

  /**
   * Game board screen (active game)
   */
  GameBoard: {
    /**
     * Game mode (single or multi)
     */
    mode: GameMode;

    /**
     * Number of players (2-4)
     */
    playerCount: PlayerCount;

    /**
     * Player configurations (name, color, isAI)
     */
    players: PlayerConfig[];
  };

  /**
   * Settings screen
   * User configures audio, haptics, and profile
   */
  Settings: undefined;

  /**
   * Game over screen (results)
   */
  GameOver: {
    /**
     * Winner player ID
     */
    winnerId: string;

    /**
     * Winner player name
     */
    winnerName: string;

    /**
     * Winner player color
     */
    winnerColor: PlayerColor;

    /**
     * Game duration in seconds
     */
    durationSeconds: number;

    /**
     * Total turns played
     */
    totalTurns: number;
  };

  /**
   * About screen (game rules, credits)
   */
  About: undefined;

  /**
   * Saved games screen (future feature)
   * List of saved games for resumption
   */
  SavedGames?: undefined;
};

/**
 * Player configuration for game initialization
 */
export interface PlayerConfig {
  /**
   * Player unique identifier (UUID v4)
   */
  id: string;

  /**
   * Player display name
   */
  name: string;

  /**
   * Player color (token color)
   */
  color: PlayerColor;

  /**
   * Whether this player is AI-controlled
   */
  isAI: boolean;
}

/**
 * Navigation helper types
 *
 * Use these types in components for type-safe navigation:
 *
 * @example
 * ```tsx
 * import { useNavigation } from '@react-navigation/native';
 * import type { NavigationProp } from '@/types/contracts/navigation.contract';
 *
 * function HomeScreen() {
 *   const navigation = useNavigation<NavigationProp>();
 *
 *   const startGame = () => {
 *     navigation.navigate('GameBoard', {
 *       mode: 'single',
 *       playerCount: 2,
 *       players: [...],
 *     });
 *   };
 * }
 * ```
 */
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

/**
 * Generic navigation prop for any screen
 */
export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Screen-specific navigation props
 */
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type GameModeSelectionNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'GameModeSelection'
>;
export type PlayerCountSelectionNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlayerCountSelection'
>;
export type GameBoardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameBoard'>;
export type SettingsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;
export type GameOverNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameOver'>;

/**
 * Screen-specific route props
 */
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type GameModeSelectionRouteProp = RouteProp<RootStackParamList, 'GameModeSelection'>;
export type PlayerCountSelectionRouteProp = RouteProp<RootStackParamList, 'PlayerCountSelection'>;
export type GameBoardRouteProp = RouteProp<RootStackParamList, 'GameBoard'>;
export type SettingsRouteProp = RouteProp<RootStackParamList, 'Settings'>;
export type GameOverRouteProp = RouteProp<RootStackParamList, 'GameOver'>;

/**
 * Navigation configuration constants
 */
export const NAVIGATION_CONFIG = {
  /**
   * Screen names (use instead of hardcoded strings)
   */
  SCREENS: {
    HOME: 'Home' as const,
    GAME_MODE_SELECTION: 'GameModeSelection' as const,
    PLAYER_COUNT_SELECTION: 'PlayerCountSelection' as const,
    GAME_BOARD: 'GameBoard' as const,
    SETTINGS: 'Settings' as const,
    GAME_OVER: 'GameOver' as const,
    ABOUT: 'About' as const,
    SAVED_GAMES: 'SavedGames' as const,
  },

  /**
   * Default screen options
   */
  DEFAULT_OPTIONS: {
    headerShown: false, // Custom header in each screen
    gestureEnabled: false, // Prevent accidental back navigation during game
    animation: 'slide_from_right' as const,
  },

  /**
   * Animation durations (milliseconds)
   */
  ANIMATION_DURATION: {
    SCREEN_TRANSITION: 300,
    MODAL_SLIDE: 250,
  },
} as const;

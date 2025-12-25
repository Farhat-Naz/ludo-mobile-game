/**
 * State Store Contract
 *
 * Defines the global state management interface using Zustand.
 * Separates concerns into multiple stores (settings, profile, game).
 *
 * @feature 001-project-setup
 * @library zustand, zustand/middleware (persist)
 * @reference research.md (State Management Decision)
 */

import type { AppSettings } from './settings-store.contract';
import type { UserProfile } from './profile-store.contract';

/**
 * Settings store (Zustand)
 *
 * Manages app settings with persistence via zustand/middleware.
 * Syncs with AsyncStorage automatically.
 */
export interface SettingsStore {
  /**
   * Current settings state
   */
  settings: AppSettings;

  /**
   * Update settings (partial)
   */
  updateSettings: (updates: Partial<AppSettings>) => void;

  /**
   * Reset settings to defaults
   */
  resetSettings: () => void;

  /**
   * Toggle audio on/off
   */
  toggleAudio: () => void;

  /**
   * Toggle haptics on/off
   */
  toggleHaptics: () => void;
}

/**
 * Profile store (Zustand)
 *
 * Manages user profile with persistence via zustand/middleware.
 * Syncs with AsyncStorage automatically.
 */
export interface ProfileStore {
  /**
   * Current profile state
   */
  profile: UserProfile;

  /**
   * Update player name
   */
  updatePlayerName: (name: string) => void;

  /**
   * Increment game statistic
   */
  incrementStat: (stat: 'gamesPlayed' | 'gamesWon' | 'gamesLost' | 'gamesAbandoned') => void;

  /**
   * Reset statistics (keep name and ID)
   */
  resetStatistics: () => void;

  /**
   * Get win rate percentage (computed)
   */
  getWinRate: () => number;
}

/**
 * Game store (Zustand)
 *
 * Manages active game state (NOT persisted).
 * Recreated on each game start.
 *
 * Note: This is a placeholder for the game engine state.
 * Full definition will be added in Feature 002 (Game Engine).
 */
export interface GameStore {
  /**
   * Current game mode
   */
  mode: 'single' | 'multi' | null;

  /**
   * Number of players (2-4)
   */
  playerCount: 2 | 3 | 4 | null;

  /**
   * Current turn index (0-based)
   */
  currentTurn: number;

  /**
   * Game started flag
   */
  isGameActive: boolean;

  /**
   * Game paused flag
   */
  isGamePaused: boolean;

  /**
   * Start new game
   */
  startGame: (mode: 'single' | 'multi', playerCount: 2 | 3 | 4) => void;

  /**
   * End current game
   */
  endGame: () => void;

  /**
   * Pause/resume game
   */
  togglePause: () => void;

  /**
   * Reset game state
   */
  resetGame: () => void;
}

/**
 * Zustand store creation helpers
 *
 * @example Creating a persisted settings store
 * ```ts
 * import create from 'zustand';
 * import { persist } from 'zustand/middleware';
 * import { DEFAULT_SETTINGS } from '@/types/contracts/settings-store.contract';
 *
 * export const useSettingsStore = create<SettingsStore>()(
 *   persist(
 *     (set) => ({
 *       settings: DEFAULT_SETTINGS,
 *
 *       updateSettings: (updates) =>
 *         set((state) => ({
 *           settings: { ...state.settings, ...updates },
 *         })),
 *
 *       resetSettings: () =>
 *         set({ settings: DEFAULT_SETTINGS }),
 *
 *       toggleAudio: () =>
 *         set((state) => ({
 *           settings: {
 *             ...state.settings,
 *             audioEnabled: !state.settings.audioEnabled,
 *           },
 *         })),
 *
 *       toggleHaptics: () =>
 *         set((state) => ({
 *           settings: {
 *             ...state.settings,
 *             hapticsEnabled: !state.settings.hapticsEnabled,
 *           },
 *         })),
 *     }),
 *     {
 *       name: 'app-settings', // AsyncStorage key
 *       version: 1,
 *     }
 *   )
 * );
 * ```
 */

/**
 * Zustand persist configuration
 */
export interface ZustandPersistConfig {
  /**
   * AsyncStorage key
   */
  name: string;

  /**
   * Schema version for migrations
   */
  version: number;

  /**
   * Migrate function (optional)
   * Called when stored version < current version
   */
  migrate?: (persistedState: unknown, version: number) => any;
}

/**
 * Store persistence keys (AsyncStorage)
 */
export const STORE_KEYS = {
  SETTINGS: 'app-settings',
  PROFILE: 'user-profile',
  // GAME: Not persisted (ephemeral state)
} as const;

/**
 * Store selectors (for performance optimization)
 *
 * Use selectors to subscribe to specific slices of state:
 *
 * @example
 * ```tsx
 * // Subscribe only to audioEnabled (component won't re-render on haptics change)
 * const audioEnabled = useSettingsStore((state) => state.settings.audioEnabled);
 *
 * // Subscribe to entire settings (re-renders on any settings change)
 * const settings = useSettingsStore((state) => state.settings);
 * ```
 */

/**
 * Settings store selectors
 */
export const settingsSelectors = {
  /**
   * Select audio enabled flag
   */
  audioEnabled: (state: SettingsStore) => state.settings.audioEnabled,

  /**
   * Select haptics enabled flag
   */
  hapticsEnabled: (state: SettingsStore) => state.settings.hapticsEnabled,

  /**
   * Select theme
   */
  theme: (state: SettingsStore) => state.settings.theme,
};

/**
 * Profile store selectors
 */
export const profileSelectors = {
  /**
   * Select player name
   */
  playerName: (state: ProfileStore) => state.profile.playerName,

  /**
   * Select statistics
   */
  statistics: (state: ProfileStore) => state.profile.statistics,

  /**
   * Select win rate (computed)
   */
  winRate: (state: ProfileStore) => state.getWinRate(),
};

/**
 * Game store selectors
 */
export const gameSelectors = {
  /**
   * Select game active flag
   */
  isGameActive: (state: GameStore) => state.isGameActive,

  /**
   * Select game paused flag
   */
  isGamePaused: (state: GameStore) => state.isGamePaused,

  /**
   * Select current turn
   */
  currentTurn: (state: GameStore) => state.currentTurn,
};

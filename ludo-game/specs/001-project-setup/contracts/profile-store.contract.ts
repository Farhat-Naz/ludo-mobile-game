/**
 * Profile Store Contract
 *
 * Defines the interface for persisting and retrieving user profile data (player name, statistics).
 * Implementation uses AsyncStorage for key-value persistence.
 *
 * @feature 001-project-setup
 * @storage AsyncStorage (key: 'user-profile')
 * @validation Zod schema (runtime type checking)
 */

/**
 * User statistics entity
 */
export interface UserStatistics {
  /**
   * Total games started
   * Increments on game start (includes abandoned games)
   */
  gamesPlayed: number;

  /**
   * Total games won
   * Increments when player achieves win condition
   */
  gamesWon: number;

  /**
   * Total games lost
   * Increments when opponent achieves win condition
   */
  gamesLost: number;

  /**
   * Total games abandoned (quit before completion)
   * Future feature for analytics
   */
  gamesAbandoned?: number;
}

/**
 * User profile entity
 */
export interface UserProfile {
  /**
   * Unique identifier (UUID v4)
   * Generated on first app launch
   */
  id: string;

  /**
   * Player display name
   * @default "Player"
   * @constraints 1-20 characters, alphanumeric + spaces
   */
  playerName: string;

  /**
   * Game statistics
   */
  statistics: UserStatistics;

  /**
   * Profile creation timestamp (ISO 8601)
   */
  createdAt: string;

  /**
   * Last updated timestamp (ISO 8601)
   */
  updatedAt: string;

  /**
   * Schema version for migration
   */
  version: number;
}

/**
 * Profile store interface
 *
 * Implementations MUST:
 * - Generate UUID v4 for new profiles
 * - Validate playerName constraints (1-20 chars, alphanumeric)
 * - Update `updatedAt` timestamp on every change
 * - Validate profile with Zod schema before persisting
 */
export interface IProfileStore {
  /**
   * Load user profile from AsyncStorage
   *
   * @returns Stored profile, or default profile if none exists
   * @throws Never (errors logged, defaults returned)
   */
  loadProfile(): Promise<UserProfile>;

  /**
   * Update user profile (name, statistics)
   *
   * @param updates - Partial profile to merge with existing
   * @throws ZodError if updates are invalid
   * @throws Error if AsyncStorage write fails
   */
  updateProfile(updates: Partial<UserProfile>): Promise<void>;

  /**
   * Increment game statistics counter
   *
   * @param stat - Statistic to increment
   * @example
   * ```ts
   * await profileStore.incrementStat('gamesWon');
   * ```
   */
  incrementStat(
    stat: 'gamesPlayed' | 'gamesWon' | 'gamesLost' | 'gamesAbandoned'
  ): Promise<void>;

  /**
   * Reset statistics (keep name and ID)
   *
   * @returns Profile with reset statistics
   */
  resetStatistics(): Promise<UserProfile>;

  /**
   * Update player name
   *
   * @param name - New player name (1-20 chars, alphanumeric + spaces)
   * @throws Error if name violates constraints
   */
  updatePlayerName(name: string): Promise<void>;
}

/**
 * Default profile (used when no stored profile exists)
 *
 * Note: `id` is generated dynamically (UUID v4)
 */
export const createDefaultProfile = (): UserProfile => ({
  id: generateUUID(), // Replaced with actual UUID generator in implementation
  playerName: 'Player',
  statistics: {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesAbandoned: 0,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1,
});

/**
 * Placeholder UUID generator (replace with actual implementation)
 * Implementation should use: import { v4 as uuidv4 } from 'uuid';
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Calculate win rate percentage
 *
 * @param profile - User profile
 * @returns Win rate (0-100)
 */
export function calculateWinRate(profile: UserProfile): number {
  const { gamesWon, gamesLost } = profile.statistics;
  const totalDecided = gamesWon + gamesLost;

  if (totalDecided === 0) return 0;

  return Math.round((gamesWon / totalDecided) * 100);
}

/**
 * Zod validation schema (for runtime type checking)
 *
 * Import this in the implementation:
 * ```ts
 * import { z } from 'zod';
 *
 * const UserStatisticsSchema = z.object({
 *   gamesPlayed: z.number().int().min(0),
 *   gamesWon: z.number().int().min(0),
 *   gamesLost: z.number().int().min(0),
 *   gamesAbandoned: z.number().int().min(0).optional(),
 * });
 *
 * export const UserProfileSchema = z.object({
 *   id: z.string().uuid(),
 *   playerName: z.string().min(1).max(20).regex(/^[a-zA-Z0-9 ]+$/),
 *   statistics: UserStatisticsSchema,
 *   createdAt: z.string().datetime(),
 *   updatedAt: z.string().datetime(),
 *   version: z.number().int().positive(),
 * });
 * ```
 */
export type UserProfileSchema = UserProfile; // Placeholder for Zod schema

/**
 * AsyncStorage key for profile persistence
 */
export const PROFILE_STORAGE_KEY = 'user-profile';

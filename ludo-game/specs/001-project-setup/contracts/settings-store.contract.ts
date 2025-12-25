/**
 * Settings Store Contract
 *
 * Defines the interface for persisting and retrieving app settings (audio, haptics, theme).
 * Implementation uses AsyncStorage for key-value persistence.
 *
 * @feature 001-project-setup
 * @storage AsyncStorage (key: 'app-settings')
 * @validation Zod schema (runtime type checking)
 */

/**
 * App settings entity
 */
export interface AppSettings {
  /**
   * Global audio toggle (all sound effects)
   * @default true
   */
  audioEnabled: boolean;

  /**
   * Global haptic feedback toggle (vibrations)
   * @default true (if device supports)
   */
  hapticsEnabled: boolean;

  /**
   * Theme preference (future enhancement)
   * @default 'light'
   */
  theme?: 'light' | 'dark';

  /**
   * Schema version for migration compatibility
   * @default 1
   */
  version: number;
}

/**
 * Settings store interface
 *
 * Implementations MUST:
 * - Validate settings with Zod schema before persisting
 * - Return default settings if none exist
 * - Handle AsyncStorage errors gracefully (log + return defaults)
 */
export interface ISettingsStore {
  /**
   * Load settings from AsyncStorage
   *
   * @returns Stored settings, or default settings if none exist
   * @throws Never (errors logged, defaults returned)
   */
  loadSettings(): Promise<AppSettings>;

  /**
   * Save settings to AsyncStorage
   *
   * @param settings - Settings to persist (must pass Zod validation)
   * @throws ZodError if settings are invalid
   * @throws Error if AsyncStorage write fails
   */
  saveSettings(settings: AppSettings): Promise<void>;

  /**
   * Reset settings to defaults
   *
   * @returns Default settings after reset
   */
  resetSettings(): Promise<AppSettings>;

  /**
   * Update specific settings fields (partial update)
   *
   * @param updates - Partial settings to merge with existing
   * @example
   * ```ts
   * await settingsStore.updateSettings({ audioEnabled: false });
   * ```
   */
  updateSettings(updates: Partial<AppSettings>): Promise<void>;
}

/**
 * Default settings (used when no stored settings exist)
 */
export const DEFAULT_SETTINGS: AppSettings = {
  audioEnabled: true,
  hapticsEnabled: true,
  theme: 'light',
  version: 1,
};

/**
 * Zod validation schema (for runtime type checking)
 *
 * Import this in the implementation:
 * ```ts
 * import { z } from 'zod';
 *
 * export const AppSettingsSchema = z.object({
 *   audioEnabled: z.boolean(),
 *   hapticsEnabled: z.boolean(),
 *   theme: z.enum(['light', 'dark']).optional(),
 *   version: z.number().int().positive(),
 * });
 * ```
 */
export type AppSettingsSchema = AppSettings; // Placeholder for Zod schema

/**
 * AsyncStorage key for settings persistence
 */
export const SETTINGS_STORAGE_KEY = 'app-settings';

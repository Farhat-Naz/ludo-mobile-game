/**
 * Color Palette & Colorblind-Accessible Patterns
 * Ensures game is accessible to users with color vision deficiency
 */

import { PLAYER_COLORS } from './constants';

// Player Colors (Colorblind-Safe Palette)
export const COLORS = {
  // Red Player - Bright red with high contrast
  RED: {
    primary: '#E53935', // Red 600
    light: '#FF6F60',
    dark: '#AB000D',
    pattern: 'solid', // Solid fill
  },

  // Blue Player - Bright blue, distinct from red
  BLUE: {
    primary: '#1E88E5', // Blue 600
    light: '#6AB7FF',
    dark: '#005CB2',
    pattern: 'diagonal-lines', // Diagonal stripes
  },

  // Green Player - Yellow-green to avoid red-green confusion
  GREEN: {
    primary: '#7CB342', // Light Green 600
    light: '#AEE571',
    dark: '#4B830D',
    pattern: 'dots', // Dotted pattern
  },

  // Yellow Player - Bright yellow-orange
  YELLOW: {
    primary: '#FDD835', // Yellow 600
    light: '#FFFF6B',
    dark: '#C6A700',
    pattern: 'cross-hatch', // Cross-hatch pattern
  },
} as const;

// Board Colors
export const BOARD_COLORS = {
  background: '#FAFAFA', // Light grey background
  path: '#FFFFFF', // White path
  safeZone: '#E8F5E9', // Light green safe zones
  homeZone: '#FFF9C4', // Light yellow home zones
  border: '#BDBDBD', // Grey borders
} as const;

// UI Theme Colors
export const THEME_COLORS = {
  primary: '#1976D2', // Blue 700
  secondary: '#FBC02D', // Yellow 700
  background: '#FFFFFF',
  surface: '#F5F5F5',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#F57C00', // Orange 700
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },
  divider: '#E0E0E0',
  players: {
    red: COLORS.RED.primary,
    blue: COLORS.BLUE.primary,
    green: COLORS.GREEN.primary,
    yellow: COLORS.YELLOW.primary,
  },
  board: {
    background: BOARD_COLORS.background,
    path: BOARD_COLORS.path,
    safeZone: BOARD_COLORS.safeZone,
    homeZone: BOARD_COLORS.homeZone,
    border: BOARD_COLORS.border,
    center: '#FBC02D',
  },
} as const;

// Pattern Identifiers (for colorblind accessibility)
export const PATTERNS = {
  [PLAYER_COLORS.RED]: 'solid',
  [PLAYER_COLORS.BLUE]: 'diagonal-lines',
  [PLAYER_COLORS.GREEN]: 'dots',
  [PLAYER_COLORS.YELLOW]: 'cross-hatch',
} as const;

// Contrast Ratios (WCAG AA Compliance)
export const CONTRAST_RATIOS = {
  MIN_NORMAL_TEXT: 4.5, // WCAG AA for normal text
  MIN_LARGE_TEXT: 3.0, // WCAG AA for large text (18pt+)
  MIN_UI_COMPONENTS: 3.0, // WCAG AA for UI components
} as const;

/**
 * Get player color configuration by color name
 */
export const getPlayerColor = (color: keyof typeof PLAYER_COLORS) => {
  switch (color) {
    case 'RED':
      return COLORS.RED;
    case 'BLUE':
      return COLORS.BLUE;
    case 'GREEN':
      return COLORS.GREEN;
    case 'YELLOW':
      return COLORS.YELLOW;
    default:
      return COLORS.RED;
  }
};

/**
 * Get pattern identifier for player color (colorblind support)
 */
export const getPlayerPattern = (color: keyof typeof PLAYER_COLORS): string => {
  return PATTERNS[PLAYER_COLORS[color]];
};

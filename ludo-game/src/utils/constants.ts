/**
 * Game Constants
 * Central location for all game configuration values
 */

// Player Colors
export const PLAYER_COLORS = {
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green',
  YELLOW: 'yellow',
} as const;

export type PlayerColor = (typeof PLAYER_COLORS)[keyof typeof PLAYER_COLORS];

// Board Configuration
export const BOARD_CONFIG = {
  TOTAL_POSITIONS: 72, // Total positions on the board path
  POSITIONS_PER_PLAYER: 18, // Positions each player travels before home
  TOKENS_PER_PLAYER: 4,
  SAFE_ZONE_POSITIONS: 6, // Positions in each player's safe zone (home stretch)
} as const;

// Player Configuration
export const PLAYER_CONFIG = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 4,
  STARTING_POSITION: {
    [PLAYER_COLORS.RED]: 0,
    [PLAYER_COLORS.BLUE]: 18,
    [PLAYER_COLORS.GREEN]: 36,
    [PLAYER_COLORS.YELLOW]: 54,
  },
} as const;

// Dice Configuration
export const DICE_CONFIG = {
  MIN_VALUE: 1,
  MAX_VALUE: 6,
  EXTRA_TURN_VALUE: 6, // Rolling 6 grants extra turn
  OPEN_TOKEN_VALUE: 6, // Requires 6 to move token from home
} as const;

// Game Rules
export const GAME_RULES = {
  EXACT_FINISH_REQUIRED: true, // Must roll exact number to finish
  CUT_RETURNS_TO_HOME: true, // Cutting opponent token sends it back to home
  MAX_CONSECUTIVE_SIXES: 3, // After 3 sixes in a row, turn ends
} as const;

// Animation Timings (milliseconds)
export const ANIMATION_TIMINGS = {
  DICE_ROLL: 800, // Dice roll animation duration
  TOKEN_MOVE_PER_POSITION: 200, // Time to move token one position
  CUT_ANIMATION: 500, // Token cut animation
  WIN_CELEBRATION: 2000, // Win screen celebration
} as const;

// UI Constants
export const UI_CONSTANTS = {
  MIN_TOUCH_TARGET_SIZE: 44, // Minimum touch target (accessibility)
  BOARD_PADDING: 16,
  TOKEN_SIZE: 40,
  DICE_SIZE: 60,
} as const;

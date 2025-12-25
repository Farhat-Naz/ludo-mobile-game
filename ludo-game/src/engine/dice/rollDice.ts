/**
 * Dice Rolling Logic
 * Framework-agnostic dice mechanics for Ludo game
 */

import { DICE_CONFIG } from '@utils/constants';

/**
 * Roll a single six-sided dice
 * @returns Random number between 1-6
 */
export function rollDice(): number {
  return Math.floor(Math.random() * DICE_CONFIG.MAX_VALUE) + DICE_CONFIG.MIN_VALUE;
}

/**
 * Check if a dice roll grants an extra turn
 * @param roll - The dice roll value
 * @returns True if player gets another turn (rolled a 6)
 */
export function grantsExtraTurn(roll: number): boolean {
  return roll === DICE_CONFIG.EXTRA_TURN_VALUE;
}

/**
 * Check if a dice roll can open a token from home
 * @param roll - The dice roll value
 * @returns True if roll allows moving token from home to board (rolled a 6)
 */
export function canOpenToken(roll: number): boolean {
  return roll === DICE_CONFIG.OPEN_TOKEN_VALUE;
}

/**
 * Validate a dice roll value
 * @param roll - The value to validate
 * @returns True if valid dice value (1-6)
 */
export function isValidDiceRoll(roll: number): boolean {
  return Number.isInteger(roll) && roll >= DICE_CONFIG.MIN_VALUE && roll <= DICE_CONFIG.MAX_VALUE;
}

/**
 * Check if consecutive sixes should end the turn
 * @param consecutiveSixes - Number of consecutive 6s rolled
 * @returns True if turn should end (reached max consecutive sixes)
 */
export function shouldEndTurnAfterSixes(consecutiveSixes: number): boolean {
  return consecutiveSixes >= 3;
}

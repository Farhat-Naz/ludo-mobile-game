/**
 * Board Model
 * Framework-agnostic board state and position management for Ludo
 */

import { BOARD_CONFIG, PLAYER_CONFIG, type PlayerColor } from '@utils/constants';

/**
 * Calculate new position after moving by dice roll
 * @param currentPosition - Current position on the board (0-71)
 * @param diceRoll - Number of spaces to move (1-6)
 * @returns New position after move
 */
export function calculateNewPosition(currentPosition: number, diceRoll: number): number {
  return (currentPosition + diceRoll) % BOARD_CONFIG.TOTAL_POSITIONS;
}

/**
 * Get starting position for a specific player color
 * @param color - Player color
 * @returns Starting position on the board for that player
 */
export function getStartingPosition(color: PlayerColor): number {
  return PLAYER_CONFIG.STARTING_POSITION[color];
}

/**
 * Check if a position is a safe zone
 * Safe zones are: starting positions + positions every 13 spaces
 * @param position - Position to check (0-71)
 * @returns True if position is a safe zone
 */
export function isSafeZone(position: number): boolean {
  const safeZonePositions = [0, 13, 18, 31, 36, 49, 54, 67]; // Adjust based on actual Ludo board
  return safeZonePositions.includes(position % BOARD_CONFIG.TOTAL_POSITIONS);
}

/**
 * Check if a player has reached their finish zone entry
 * @param position - Current position on board
 * @param playerColor - Player's color
 * @param distanceTraveled - Total distance traveled from start
 * @returns True if player is at finish zone entry
 */
export function isFinishZoneEntry(
  position: number,
  playerColor: PlayerColor,
  distanceTraveled: number
): boolean {
  const startPos = getStartingPosition(playerColor);
  // Player reaches finish zone after traveling around the board
  return distanceTraveled >= 51 && position === startPos;
}

/**
 * Calculate finish zone position (0-5 in the finish lane)
 * @param distanceTraveled - Total distance traveled from start
 * @returns Position in finish zone (0-5) or -1 if not in finish zone
 */
export function getFinishZonePosition(distanceTraveled: number): number {
  if (distanceTraveled < 52) return -1;
  const finishPos = distanceTraveled - 52;
  return finishPos <= BOARD_CONFIG.SAFE_ZONE_POSITIONS ? finishPos : -1;
}

/**
 * Check if a token has completed the game (reached final position)
 * @param distanceTraveled - Total distance traveled from start
 * @returns True if token is at finish position
 */
export function isAtFinish(distanceTraveled: number): boolean {
  return distanceTraveled === 52 + BOARD_CONFIG.SAFE_ZONE_POSITIONS;
}

/**
 * Validate if a move is legal based on current position and dice roll
 * @param distanceTraveled - Current distance traveled
 * @param diceRoll - Dice roll value
 * @returns True if move is valid
 */
export function isValidMove(distanceTraveled: number, diceRoll: number): boolean {
  const newDistance = distanceTraveled + diceRoll;

  // Can't move if already finished
  if (distanceTraveled >= 52 + BOARD_CONFIG.SAFE_ZONE_POSITIONS) {
    return false;
  }

  // In finish zone, must roll exact number to finish
  if (distanceTraveled >= 52) {
    return newDistance <= 52 + BOARD_CONFIG.SAFE_ZONE_POSITIONS;
  }

  return true;
}

/**
 * Calculate distance traveled for a token
 * @param currentPosition - Current board position
 * @param startingPosition - Player's starting position
 * @param lapsCompleted - Number of full laps around the board
 * @returns Total distance traveled
 */
export function calculateDistanceTraveled(
  currentPosition: number,
  startingPosition: number,
  lapsCompleted: number = 0
): number {
  if (currentPosition >= startingPosition) {
    return currentPosition - startingPosition + (lapsCompleted * BOARD_CONFIG.TOTAL_POSITIONS);
  } else {
    return (BOARD_CONFIG.TOTAL_POSITIONS - startingPosition) + currentPosition +
           (lapsCompleted * BOARD_CONFIG.TOTAL_POSITIONS);
  }
}

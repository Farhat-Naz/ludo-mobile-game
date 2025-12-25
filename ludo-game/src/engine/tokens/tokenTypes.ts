/**
 * Token Type Definitions
 * Framework-agnostic token data structures
 */

import type { PlayerColor } from '@utils/constants';

/**
 * Token status
 */
export type TokenStatus = 'home' | 'active' | 'finish';

/**
 * Token data structure
 */
export interface Token {
  /**
   * Unique token identifier
   */
  id: string;

  /**
   * Owner player color
   */
  player: PlayerColor;

  /**
   * Token index (0-3 for each player)
   */
  index: number;

  /**
   * Current status
   */
  status: TokenStatus;

  /**
   * Current board position (0-71, or -1 if in home/finish)
   */
  position: number;

  /**
   * Total distance traveled from start
   */
  distanceTraveled: number;
}

/**
 * Token movement result
 */
export interface MoveResult {
  /**
   * Updated token after move
   */
  token: Token;

  /**
   * Whether the move resulted in cutting an opponent
   */
  didCut: boolean;

  /**
   * Token that was cut (if any)
   */
  cutToken?: Token;
}

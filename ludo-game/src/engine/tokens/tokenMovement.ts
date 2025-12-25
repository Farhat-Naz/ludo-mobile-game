/**
 * Token Movement Logic
 * Framework-agnostic token movement and collision rules
 */

import type { Token, MoveResult } from './tokenTypes';
import { DICE_CONFIG, GAME_RULES, type PlayerColor } from '@utils/constants';
import {
  calculateNewPosition,
  getStartingPosition,
  isSafeZone,
  isValidMove,
  isAtFinish,
} from '../board/boardModel';

/**
 * Check if a token can move based on dice roll and current status
 * @param token - Token to check
 * @param diceRoll - Dice roll value
 * @returns True if token can move
 */
export function canMoveToken(token: Token, diceRoll: number): boolean {
  // Token in home requires 6 to open
  if (token.status === 'home') {
    return diceRoll === DICE_CONFIG.OPEN_TOKEN_VALUE;
  }

  // Token finished cannot move
  if (token.status === 'finish') {
    return false;
  }

  // Check if move is valid (doesn't overshoot finish)
  return isValidMove(token.distanceTraveled, diceRoll);
}

/**
 * Open a token from home to starting position
 * @param token - Token to open
 * @returns Updated token at starting position
 */
export function openToken(token: Token): Token {
  if (token.status !== 'home') {
    throw new Error('Can only open tokens that are in home');
  }

  const startingPos = getStartingPosition(token.player);

  return {
    ...token,
    status: 'active',
    position: startingPos,
    distanceTraveled: 0,
  };
}

/**
 * Move a token by the specified number of spaces
 * @param token - Token to move
 * @param diceRoll - Number of spaces to move
 * @param allTokens - All tokens on the board (for collision detection)
 * @returns Move result with updated token and collision information
 */
export function moveToken(token: Token, diceRoll: number, allTokens: Token[]): MoveResult {
  if (!canMoveToken(token, diceRoll)) {
    throw new Error('Invalid move');
  }

  // Handle opening token from home
  if (token.status === 'home') {
    const openedToken = openToken(token);
    const collision = checkCollision(openedToken, allTokens);

    if (collision) {
      const cutToken = sendTokenHome(collision);
      return {
        token: openedToken,
        didCut: true,
        cutToken,
      };
    }

    return {
      token: openedToken,
      didCut: false,
    };
  }

  // Move active token
  const newDistance = token.distanceTraveled + diceRoll;

  // Check if token finishes
  if (isAtFinish(newDistance)) {
    return {
      token: {
        ...token,
        status: 'finish',
        position: -1,
        distanceTraveled: newDistance,
      },
      didCut: false,
    };
  }

  // Calculate new position
  const startPos = getStartingPosition(token.player);
  let newPosition: number;

  if (newDistance >= 52) {
    // Token is in finish zone, position doesn't matter
    newPosition = -1;
  } else {
    newPosition = calculateNewPosition(startPos, newDistance);
  }

  const movedToken: Token = {
    ...token,
    position: newPosition,
    distanceTraveled: newDistance,
  };

  // Check for collision
  const collision = checkCollision(movedToken, allTokens);

  if (collision && !isSafeZone(movedToken.position)) {
    const cutToken = sendTokenHome(collision);
    return {
      token: movedToken,
      didCut: true,
      cutToken,
    };
  }

  return {
    token: movedToken,
    didCut: false,
  };
}

/**
 * Check if a token collides with another token at its position
 * @param token - Token to check
 * @param allTokens - All tokens on board
 * @returns Colliding token or undefined
 */
export function checkCollision(token: Token, allTokens: Token[]): Token | undefined {
  return allTokens.find(
    (other) =>
      other.id !== token.id && // Different token
      other.player !== token.player && // Opponent's token
      other.status === 'active' && // Token is on board
      other.position === token.position && // Same position
      token.position !== -1 // Not in home or finish
  );
}

/**
 * Send a token back to home position
 * @param token - Token to send home
 * @returns Updated token in home status
 */
export function sendTokenHome(token: Token): Token {
  return {
    ...token,
    status: 'home',
    position: -1,
    distanceTraveled: 0,
  };
}

/**
 * Get all moveable tokens for a player
 * @param playerTokens - All tokens belonging to the player
 * @param diceRoll - Current dice roll
 * @returns Array of tokens that can be moved
 */
export function getMoveableTokens(playerTokens: Token[], diceRoll: number): Token[] {
  return playerTokens.filter((token) => canMoveToken(token, diceRoll));
}

/**
 * Check if a player has any tokens in home
 * @param playerTokens - All tokens belonging to the player
 * @returns True if player has tokens in home
 */
export function hasTokensInHome(playerTokens: Token[]): boolean {
  return playerTokens.some((token) => token.status === 'home');
}

/**
 * Count finished tokens for a player
 * @param playerTokens - All tokens belonging to the player
 * @returns Number of finished tokens
 */
export function countFinishedTokens(playerTokens: Token[]): number {
  return playerTokens.filter((token) => token.status === 'finish').length;
}

/**
 * Create initial token for a player
 * @param player - Player color
 * @param index - Token index (0-3)
 * @returns New token in home status
 */
export function createToken(player: PlayerColor, index: number): Token {
  return {
    id: `${player}-${index}`,
    player,
    index,
    status: 'home',
    position: -1,
    distanceTraveled: 0,
  };
}

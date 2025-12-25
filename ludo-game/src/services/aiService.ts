/**
 * AI Service
 * Implements AI logic for computer opponents
 */

import type { Token } from '@engine/tokens';
import { getMoveableTokens, canMoveToken } from '@engine/tokens';
import type { PlayerColor } from '@utils/constants';

/**
 * AI Difficulty Levels
 */
export enum AIDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

/**
 * Calculate token priority for AI decision making
 * Higher score = higher priority to move
 */
function calculateTokenPriority(token: Token, diceRoll: number, allTokens: Token[]): number {
  let priority = 0;

  // Priority 1: Tokens in home (need to get out)
  if (token.status === 'home') {
    priority += 10;
  }

  // Priority 2: Tokens close to finish
  if (token.status === 'active' && token.distanceTraveled >= 45) {
    priority += 20 + (token.distanceTraveled - 45); // Higher priority as closer to finish
  }

  // Priority 3: Can cut opponent
  const targetPosition = (token.position + diceRoll) % 72;
  const wouldCutOpponent = allTokens.some(
    (t) =>
      t.id !== token.id &&
      t.player !== token.player &&
      t.status === 'active' &&
      t.position === targetPosition
  );
  if (wouldCutOpponent) {
    priority += 30; // High priority for cutting
  }

  // Priority 4: Getting token that is behind
  if (token.status === 'active' && token.distanceTraveled < 20) {
    priority += 5; // Slight priority to advance behind tokens
  }

  // Priority 5: Tokens in danger (opponents nearby)
  if (token.status === 'active') {
    const opponentsNearby = allTokens.some(
      (t) =>
        t.player !== token.player &&
        t.status === 'active' &&
        Math.abs(t.position - token.position) <= 6 &&
        t.position < token.position // Opponent behind, could catch up
    );
    if (opponentsNearby) {
      priority += 8; // Priority to move away from danger
    }
  }

  return priority;
}

/**
 * Select best token to move for AI
 * @param playerTokens - All tokens belonging to the AI player
 * @param diceRoll - Current dice roll
 * @param allTokens - All tokens in the game
 * @param difficulty - AI difficulty level
 * @returns Token to move, or null if no valid moves
 */
export function selectAIMove(
  playerTokens: Token[],
  diceRoll: number,
  allTokens: Token[],
  difficulty: AIDifficulty = AIDifficulty.MEDIUM
): Token | null {
  // Get all moveable tokens
  const moveableTokens = getMoveableTokens(playerTokens, diceRoll);

  if (moveableTokens.length === 0) {
    return null;
  }

  // If only one option, return it
  if (moveableTokens.length === 1) {
    return moveableTokens[0];
  }

  // Easy AI: Random selection
  if (difficulty === AIDifficulty.EASY) {
    return moveableTokens[Math.floor(Math.random() * moveableTokens.length)];
  }

  // Medium/Hard AI: Strategic selection
  const tokenPriorities = moveableTokens.map((token) => ({
    token,
    priority: calculateTokenPriority(token, diceRoll, allTokens),
  }));

  // Sort by priority (highest first)
  tokenPriorities.sort((a, b) => b.priority - a.priority);

  // Hard AI: Always pick best move
  if (difficulty === AIDifficulty.HARD) {
    return tokenPriorities[0].token;
  }

  // Medium AI: Pick from top 2 options (some randomness)
  const topOptions = tokenPriorities.slice(0, 2);
  return topOptions[Math.floor(Math.random() * topOptions.length)].token;
}

/**
 * Check if a player is an AI opponent
 * @param player - Player color
 * @param gameMode - Current game mode
 * @returns True if player is AI controlled
 */
export function isAIPlayer(player: PlayerColor, gameMode: string): boolean {
  // In 1P mode, all players except RED are AI
  if (gameMode === '1p') {
    return player !== 'red';
  }
  return false;
}

/**
 * Get AI difficulty for a player
 * Can be customized based on player or game settings
 */
export function getAIDifficulty(player: PlayerColor): AIDifficulty {
  // For now, all AI uses medium difficulty
  // Could be enhanced to vary by player or allow user selection
  return AIDifficulty.MEDIUM;
}

/**
 * Calculate delay before AI makes a move (for realism)
 * @param difficulty - AI difficulty level
 * @returns Delay in milliseconds
 */
export function getAIThinkingDelay(difficulty: AIDifficulty): number {
  switch (difficulty) {
    case AIDifficulty.EASY:
      return 800 + Math.random() * 400; // 800-1200ms
    case AIDifficulty.MEDIUM:
      return 1000 + Math.random() * 600; // 1000-1600ms
    case AIDifficulty.HARD:
      return 1200 + Math.random() * 800; // 1200-2000ms
    default:
      return 1000;
  }
}

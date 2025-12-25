/**
 * Win Condition Detection
 * Framework-agnostic logic for detecting game winners
 */

import type { Token } from '../tokens/tokenTypes';
import { BOARD_CONFIG, type PlayerColor } from '@utils/constants';
import { countFinishedTokens } from '../tokens/tokenMovement';

/**
 * Game result for a player
 */
export interface PlayerResult {
  /**
   * Player color
   */
  player: PlayerColor;

  /**
   * Finishing position (1st, 2nd, 3rd, 4th)
   */
  position: number;

  /**
   * Number of finished tokens
   */
  finishedTokens: number;

  /**
   * Whether player has won
   */
  hasWon: boolean;
}

/**
 * Game state regarding winners
 */
export interface GameWinState {
  /**
   * Whether game is over
   */
  isGameOver: boolean;

  /**
   * Winner (first player to finish all tokens)
   */
  winner: PlayerColor | null;

  /**
   * Final rankings of all players
   */
  rankings: PlayerResult[];
}

/**
 * Check if a player has won (all tokens finished)
 * @param playerTokens - All tokens belonging to the player
 * @returns True if player has won
 */
export function hasPlayerWon(playerTokens: Token[]): boolean {
  return countFinishedTokens(playerTokens) === BOARD_CONFIG.TOKENS_PER_PLAYER;
}

/**
 * Get player result information
 * @param player - Player color
 * @param allTokens - All tokens in the game
 * @param position - Finishing position (1-4)
 * @returns Player result
 */
export function getPlayerResult(
  player: PlayerColor,
  allTokens: Token[],
  position: number = 0
): PlayerResult {
  const playerTokens = allTokens.filter((t) => t.player === player);
  const finishedTokens = countFinishedTokens(playerTokens);
  const hasWon = finishedTokens === BOARD_CONFIG.TOKENS_PER_PLAYER;

  return {
    player,
    position,
    finishedTokens,
    hasWon,
  };
}

/**
 * Calculate game win state
 * @param allTokens - All tokens in the game
 * @param players - Array of active players
 * @returns Game win state with rankings
 */
export function calculateWinState(allTokens: Token[], players: PlayerColor[]): GameWinState {
  // Get results for all players
  const results = players.map((player) => getPlayerResult(player, allTokens));

  // Sort by number of finished tokens (descending)
  const sortedResults = [...results].sort((a, b) => b.finishedTokens - a.finishedTokens);

  // Assign positions
  const rankings: PlayerResult[] = [];
  let currentPosition = 1;

  sortedResults.forEach((result, index) => {
    // Players with same number of finished tokens share position
    if (index > 0 && result.finishedTokens < sortedResults[index - 1].finishedTokens) {
      currentPosition = index + 1;
    }

    rankings.push({
      ...result,
      position: currentPosition,
    });
  });

  // Find winner (first player to finish all tokens)
  const winner = rankings.find((r) => r.hasWon)?.player || null;

  return {
    isGameOver: winner !== null,
    winner,
    rankings,
  };
}

/**
 * Check if game should continue (multiple players still competing)
 * @param winState - Current win state
 * @param continueAfterWinner - Whether to continue for 2nd/3rd/4th place
 * @returns True if game should continue
 */
export function shouldContinueGame(winState: GameWinState, continueAfterWinner: boolean = true): boolean {
  // If no winner yet, continue
  if (!winState.winner) {
    return true;
  }

  // If continue after winner is disabled, end game
  if (!continueAfterWinner) {
    return false;
  }

  // Continue if players are still competing for rankings
  const playersStillPlaying = winState.rankings.filter((r) => !r.hasWon).length;
  return playersStillPlaying > 1;
}

/**
 * Get winners in order (1st, 2nd, 3rd, 4th)
 * @param winState - Current win state
 * @returns Array of players in finishing order
 */
export function getWinnersInOrder(winState: GameWinState): PlayerColor[] {
  return winState.rankings
    .sort((a, b) => a.position - b.position)
    .map((r) => r.player);
}

/**
 * Check if player is eligible to win (can finish on this turn)
 * @param playerTokens - Player's tokens
 * @param diceRoll - Current dice roll
 * @returns True if player can win this turn
 */
export function canWinThisTurn(playerTokens: Token[], diceRoll: number): boolean {
  const finishedCount = countFinishedTokens(playerTokens);

  // Need exactly 3 tokens finished and 1 token that can finish with this roll
  if (finishedCount !== BOARD_CONFIG.TOKENS_PER_PLAYER - 1) {
    return false;
  }

  // Check if the active token can finish with this roll
  const activeToken = playerTokens.find((t) => t.status === 'active');
  if (!activeToken) {
    return false;
  }

  const requiredDistance = 58; // Total distance to finish
  const distanceNeeded = requiredDistance - activeToken.distanceTraveled;

  return distanceNeeded === diceRoll;
}

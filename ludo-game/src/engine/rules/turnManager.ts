/**
 * Turn Management System
 * Framework-agnostic turn rotation and game flow logic
 */

import { DICE_CONFIG, GAME_RULES, type PlayerColor } from '@utils/constants';

/**
 * Turn state
 */
export interface TurnState {
  /**
   * Current player whose turn it is
   */
  currentPlayer: PlayerColor;

  /**
   * Number of consecutive sixes rolled this turn
   */
  consecutiveSixes: number;

  /**
   * Whether current player gets another roll
   */
  hasExtraTurn: boolean;

  /**
   * Turn number (increments each time all players have had a turn)
   */
  turnNumber: number;
}

/**
 * Initialize turn state for a new game
 * @param startingPlayer - Player who goes first
 * @returns Initial turn state
 */
export function initializeTurnState(startingPlayer: PlayerColor): TurnState {
  return {
    currentPlayer: startingPlayer,
    consecutiveSixes: 0,
    hasExtraTurn: false,
    turnNumber: 1,
  };
}

/**
 * Process dice roll and update turn state
 * @param currentState - Current turn state
 * @param diceRoll - Dice roll value
 * @returns Updated turn state
 */
export function processDiceRoll(currentState: TurnState, diceRoll: number): TurnState {
  const rolledSix = diceRoll === DICE_CONFIG.EXTRA_TURN_VALUE;
  const newConsecutiveSixes = rolledSix ? currentState.consecutiveSixes + 1 : 0;

  // Check if player hit max consecutive sixes (turn ends)
  if (newConsecutiveSixes >= GAME_RULES.MAX_CONSECUTIVE_SIXES) {
    return {
      ...currentState,
      consecutiveSixes: 0,
      hasExtraTurn: false,
    };
  }

  // Player gets extra turn if they rolled a 6
  return {
    ...currentState,
    consecutiveSixes: newConsecutiveSixes,
    hasExtraTurn: rolledSix,
  };
}

/**
 * Advance to next player's turn
 * @param currentState - Current turn state
 * @param players - Array of active players in turn order
 * @returns Updated turn state with next player
 */
export function advanceToNextPlayer(currentState: TurnState, players: PlayerColor[]): TurnState {
  const currentIndex = players.indexOf(currentState.currentPlayer);
  const nextIndex = (currentIndex + 1) % players.length;
  const nextPlayer = players[nextIndex];

  // Increment turn number when returning to first player
  const turnNumber = nextIndex === 0 ? currentState.turnNumber + 1 : currentState.turnNumber;

  return {
    currentPlayer: nextPlayer,
    consecutiveSixes: 0,
    hasExtraTurn: false,
    turnNumber,
  };
}

/**
 * End current player's turn and move to next player if no extra turn
 * @param currentState - Current turn state
 * @param players - Array of active players
 * @returns Updated turn state
 */
export function endTurn(currentState: TurnState, players: PlayerColor[]): TurnState {
  // If player has extra turn, stay with same player
  if (currentState.hasExtraTurn) {
    return {
      ...currentState,
      hasExtraTurn: false,
    };
  }

  // Otherwise advance to next player
  return advanceToNextPlayer(currentState, players);
}

/**
 * Check if current player can roll dice
 * @param currentState - Current turn state
 * @returns True if player can roll
 */
export function canRollDice(currentState: TurnState): boolean {
  // Can't roll if already hit max consecutive sixes
  return currentState.consecutiveSixes < GAME_RULES.MAX_CONSECUTIVE_SIXES;
}

/**
 * Get next player in turn order (without advancing the state)
 * @param currentPlayer - Current player
 * @param players - Array of active players
 * @returns Next player color
 */
export function getNextPlayer(currentPlayer: PlayerColor, players: PlayerColor[]): PlayerColor {
  const currentIndex = players.indexOf(currentPlayer);
  const nextIndex = (currentIndex + 1) % players.length;
  return players[nextIndex];
}

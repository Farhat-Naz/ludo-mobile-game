/**
 * Game State Store
 * Zustand store for active game state management
 */

import { create } from 'zustand';
import { PLAYER_COLORS, BOARD_CONFIG, type PlayerColor } from '@utils/constants';
import { createToken, moveToken as moveTokenEngine, canMoveToken, getMoveableTokens } from '@engine/tokens';
import type { Token } from '@engine/tokens';
import type { TurnState, GameWinState } from '@engine/rules';
import { initializeTurnState, processDiceRoll, endTurn } from '@engine/rules/turnManager';
import { calculateWinState } from '@engine/rules/winConditions';
import { triggerHaptic, HapticFeedback } from '@services/hapticService';
import { playSoundEffect, SoundEffect } from '@services/audioService';

/**
 * Game mode type
 */
export type GameMode = '1p' | '2p' | '3p' | '4p' | null;

/**
 * Game state interface
 */
export interface GameState {
  // Game configuration
  mode: GameMode;
  players: PlayerColor[];

  // Game data
  tokens: Token[];
  turnState: TurnState | null;
  winState: GameWinState | null;
  lastDiceRoll: number | null;
  selectedTokenId: string | null;
  moveableTokenIds: string[];
  cutTokenId: string | null; // Token that was just cut (for animation)

  // Game status
  isActive: boolean;
  isPaused: boolean;

  // Actions
  startGame: (mode: GameMode) => void;
  rollDice: () => number;
  selectToken: (tokenId: string) => void;
  moveSelectedToken: () => void;
  endCurrentTurn: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
}

/**
 * Get player array for game mode
 */
function getPlayersForMode(mode: GameMode): PlayerColor[] {
  switch (mode) {
    case '1p':
      return [PLAYER_COLORS.RED, PLAYER_COLORS.BLUE]; // Player vs AI
    case '2p':
      return [PLAYER_COLORS.RED, PLAYER_COLORS.BLUE];
    case '3p':
      return [PLAYER_COLORS.RED, PLAYER_COLORS.BLUE, PLAYER_COLORS.GREEN];
    case '4p':
      return [PLAYER_COLORS.RED, PLAYER_COLORS.BLUE, PLAYER_COLORS.GREEN, PLAYER_COLORS.YELLOW];
    default:
      return [];
  }
}

/**
 * Initialize tokens for all players
 */
function initializeTokens(players: PlayerColor[]): Token[] {
  const tokens: Token[] = [];

  players.forEach((player) => {
    for (let i = 0; i < BOARD_CONFIG.TOKENS_PER_PLAYER; i++) {
      tokens.push(createToken(player, i));
    }
  });

  return tokens;
}

/**
 * Game store (ephemeral - not persisted)
 */
export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  mode: null,
  players: [],
  tokens: [],
  turnState: null,
  winState: null,
  lastDiceRoll: null,
  selectedTokenId: null,
  moveableTokenIds: [],
  cutTokenId: null,
  isActive: false,
  isPaused: false,

  // Start new game
  startGame: (mode: GameMode) => {
    const players = getPlayersForMode(mode);
    const tokens = initializeTokens(players);
    const turnState = initializeTurnState(players[0]);
    const winState = calculateWinState(tokens, players);

    set({
      mode,
      players,
      tokens,
      turnState,
      winState,
      lastDiceRoll: null,
      selectedTokenId: null,
      moveableTokenIds: [],
      cutTokenId: null,
      isActive: true,
      isPaused: false,
    });
  },

  // Roll dice and update turn state
  rollDice: () => {
    const state = get();
    if (!state.isActive || state.isPaused || !state.turnState) {
      return 0;
    }

    // Generate dice roll (1-6)
    const roll = Math.floor(Math.random() * 6) + 1;

    // Update turn state with dice roll
    const updatedTurnState = processDiceRoll(state.turnState, roll);

    // Get current player's tokens
    const currentPlayer = state.turnState.currentPlayer;
    const playerTokens = state.tokens.filter((t) => t.player === currentPlayer);

    // Find moveable tokens
    const moveableTokens = getMoveableTokens(playerTokens, roll);
    const moveableTokenIds = moveableTokens.map((t) => t.id);

    // Auto-select if only one token can move
    const selectedTokenId = moveableTokenIds.length === 1 ? moveableTokenIds[0] : null;

    set({
      lastDiceRoll: roll,
      turnState: updatedTurnState,
      moveableTokenIds,
      selectedTokenId,
    });

    return roll;
  },

  // Select a token for movement
  selectToken: (tokenId: string) => {
    const state = get();
    if (!state.isActive || state.isPaused) {
      return;
    }

    // Can only select moveable tokens
    if (state.moveableTokenIds.includes(tokenId)) {
      set({ selectedTokenId: tokenId });
    }
  },

  // Move the selected token
  moveSelectedToken: () => {
    const state = get();
    if (!state.isActive || state.isPaused || !state.selectedTokenId || !state.lastDiceRoll) {
      return;
    }

    // Find the token to move
    const tokenToMove = state.tokens.find((t) => t.id === state.selectedTokenId);
    if (!tokenToMove) {
      return;
    }

    // Verify token can move
    if (!canMoveToken(tokenToMove, state.lastDiceRoll)) {
      return;
    }

    try {
      // Move the token using engine logic
      const moveResult = moveTokenEngine(tokenToMove, state.lastDiceRoll, state.tokens);

      // Update tokens array
      let updatedTokens = state.tokens.map((t) => (t.id === moveResult.token.id ? moveResult.token : t));

      // If a token was cut, update it too
      let cutToken: string | null = null;
      if (moveResult.didCut && moveResult.cutToken) {
        updatedTokens = updatedTokens.map((t) =>
          t.id === moveResult.cutToken!.id ? moveResult.cutToken! : t
        );
        cutToken = moveResult.cutToken.id;
        // Trigger cutting feedback
        triggerHaptic(HapticFeedback.HEAVY);
        playSoundEffect(SoundEffect.TOKEN_CUT);
      }

      // Calculate new win state
      const winState = calculateWinState(updatedTokens, state.players);

      // Check if player just won
      if (winState.isGameOver && !state.winState?.isGameOver) {
        triggerHaptic(HapticFeedback.SUCCESS);
        playSoundEffect(SoundEffect.WIN);
      }

      // Clear selection and moveable tokens
      set({
        tokens: updatedTokens,
        winState,
        selectedTokenId: null,
        moveableTokenIds: [],
        cutTokenId: cutToken,
      });

      // Clear cutTokenId after animation
      if (cutToken) {
        setTimeout(() => {
          set({ cutTokenId: null });
        }, 600);
      }

      // Auto-advance turn if no extra turn granted
      if (!state.turnState?.hasExtraTurn) {
        setTimeout(() => {
          get().endCurrentTurn();
        }, 500);
      }
    } catch (error) {
      console.error('Failed to move token:', error);
    }
  },

  // End current player's turn
  endCurrentTurn: () => {
    const state = get();
    if (!state.turnState) {
      return;
    }

    const updatedTurnState = endTurn(state.turnState, state.players);

    set({
      turnState: updatedTurnState,
      lastDiceRoll: null,
      selectedTokenId: null,
      moveableTokenIds: [],
    });
  },

  // Pause game
  pauseGame: () => {
    set({ isPaused: true });
  },

  // Resume game
  resumeGame: () => {
    set({ isPaused: false });
  },

  // End game
  endGame: () => {
    set({
      isActive: false,
      isPaused: false,
    });
  },

  // Reset game to initial state
  resetGame: () => {
    set({
      mode: null,
      players: [],
      tokens: [],
      turnState: null,
      winState: null,
      lastDiceRoll: null,
      selectedTokenId: null,
      moveableTokenIds: [],
      cutTokenId: null,
      isActive: false,
      isPaused: false,
    });
  },
}));

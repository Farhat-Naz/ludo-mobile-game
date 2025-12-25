/**
 * Turn Manager Tests
 * Unit tests for turn rotation and game flow
 */

import {
  initializeTurnState,
  processDiceRoll,
  advanceToNextPlayer,
  endTurn,
  canRollDice,
  getNextPlayer,
} from '../turnManager';
import { PLAYER_COLORS } from '../../../utils/constants';

const players = [PLAYER_COLORS.RED, PLAYER_COLORS.BLUE, PLAYER_COLORS.GREEN, PLAYER_COLORS.YELLOW];

describe('initializeTurnState', () => {
  it('should create initial turn state', () => {
    const state = initializeTurnState(PLAYER_COLORS.RED);

    expect(state.currentPlayer).toBe(PLAYER_COLORS.RED);
    expect(state.consecutiveSixes).toBe(0);
    expect(state.hasExtraTurn).toBe(false);
    expect(state.turnNumber).toBe(1);
  });
});

describe('processDiceRoll', () => {
  it('should grant extra turn when rolling 6', () => {
    const state = initializeTurnState(PLAYER_COLORS.RED);
    const updated = processDiceRoll(state, 6);

    expect(updated.hasExtraTurn).toBe(true);
    expect(updated.consecutiveSixes).toBe(1);
  });

  it('should not grant extra turn for rolls 1-5', () => {
    const state = initializeTurnState(PLAYER_COLORS.RED);
    const updated = processDiceRoll(state, 3);

    expect(updated.hasExtraTurn).toBe(false);
    expect(updated.consecutiveSixes).toBe(0);
  });

  it('should track consecutive sixes', () => {
    let state = initializeTurnState(PLAYER_COLORS.RED);

    state = processDiceRoll(state, 6);
    expect(state.consecutiveSixes).toBe(1);

    state = processDiceRoll(state, 6);
    expect(state.consecutiveSixes).toBe(2);
  });

  it('should end turn after 3 consecutive sixes', () => {
    let state = initializeTurnState(PLAYER_COLORS.RED);

    state = processDiceRoll(state, 6);
    state = processDiceRoll(state, 6);
    state = processDiceRoll(state, 6);

    expect(state.consecutiveSixes).toBe(0);
    expect(state.hasExtraTurn).toBe(false);
  });

  it('should reset consecutive sixes on non-six roll', () => {
    let state = initializeTurnState(PLAYER_COLORS.RED);

    state = processDiceRoll(state, 6);
    expect(state.consecutiveSixes).toBe(1);

    state = processDiceRoll(state, 3);
    expect(state.consecutiveSixes).toBe(0);
  });
});

describe('advanceToNextPlayer', () => {
  it('should advance to next player in order', () => {
    const state = initializeTurnState(PLAYER_COLORS.RED);
    const updated = advanceToNextPlayer(state, players);

    expect(updated.currentPlayer).toBe(PLAYER_COLORS.BLUE);
    expect(updated.consecutiveSixes).toBe(0);
    expect(updated.hasExtraTurn).toBe(false);
  });

  it('should wrap around to first player', () => {
    const state = initializeTurnState(PLAYER_COLORS.YELLOW);
    const updated = advanceToNextPlayer(state, players);

    expect(updated.currentPlayer).toBe(PLAYER_COLORS.RED);
  });

  it('should increment turn number when returning to first player', () => {
    const state = {
      ...initializeTurnState(PLAYER_COLORS.YELLOW),
      turnNumber: 5,
    };

    const updated = advanceToNextPlayer(state, players);

    expect(updated.currentPlayer).toBe(PLAYER_COLORS.RED);
    expect(updated.turnNumber).toBe(6);
  });

  it('should not increment turn number for mid-round advancement', () => {
    const state = {
      ...initializeTurnState(PLAYER_COLORS.BLUE),
      turnNumber: 5,
    };

    const updated = advanceToNextPlayer(state, players);

    expect(updated.currentPlayer).toBe(PLAYER_COLORS.GREEN);
    expect(updated.turnNumber).toBe(5);
  });

  it('should work with 2 players', () => {
    const twoPlayers = [PLAYER_COLORS.RED, PLAYER_COLORS.BLUE];
    const state = initializeTurnState(PLAYER_COLORS.RED);
    const updated = advanceToNextPlayer(state, twoPlayers);

    expect(updated.currentPlayer).toBe(PLAYER_COLORS.BLUE);
  });
});

describe('endTurn', () => {
  it('should stay with current player if extra turn', () => {
    const state = {
      ...initializeTurnState(PLAYER_COLORS.RED),
      hasExtraTurn: true,
    };

    const updated = endTurn(state, players);

    expect(updated.currentPlayer).toBe(PLAYER_COLORS.RED);
    expect(updated.hasExtraTurn).toBe(false);
  });

  it('should advance to next player if no extra turn', () => {
    const state = initializeTurnState(PLAYER_COLORS.RED);
    const updated = endTurn(state, players);

    expect(updated.currentPlayer).toBe(PLAYER_COLORS.BLUE);
  });
});

describe('canRollDice', () => {
  it('should allow rolling dice normally', () => {
    const state = initializeTurnState(PLAYER_COLORS.RED);
    expect(canRollDice(state)).toBe(true);
  });

  it('should allow rolling after 1 or 2 consecutive sixes', () => {
    const state1 = {
      ...initializeTurnState(PLAYER_COLORS.RED),
      consecutiveSixes: 1,
    };
    expect(canRollDice(state1)).toBe(true);

    const state2 = {
      ...initializeTurnState(PLAYER_COLORS.RED),
      consecutiveSixes: 2,
    };
    expect(canRollDice(state2)).toBe(true);
  });

  it('should not allow rolling after 3 consecutive sixes', () => {
    const state = {
      ...initializeTurnState(PLAYER_COLORS.RED),
      consecutiveSixes: 3,
    };
    expect(canRollDice(state)).toBe(false);
  });
});

describe('getNextPlayer', () => {
  it('should return next player without modifying state', () => {
    const next = getNextPlayer(PLAYER_COLORS.RED, players);
    expect(next).toBe(PLAYER_COLORS.BLUE);
  });

  it('should wrap around to first player', () => {
    const next = getNextPlayer(PLAYER_COLORS.YELLOW, players);
    expect(next).toBe(PLAYER_COLORS.RED);
  });
});

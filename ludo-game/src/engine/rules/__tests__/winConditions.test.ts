/**
 * Win Conditions Tests
 * Unit tests for win detection and game completion
 */

import {
  hasPlayerWon,
  getPlayerResult,
  calculateWinState,
  shouldContinueGame,
  getWinnersInOrder,
  canWinThisTurn,
} from '../winConditions';
import { createToken } from '../../tokens/tokenMovement';
import type { Token } from '../../tokens/tokenTypes';
import { PLAYER_COLORS } from '../../../utils/constants';

describe('hasPlayerWon', () => {
  it('should return true when all 4 tokens are finished', () => {
    const tokens: Token[] = [
      { ...createToken(PLAYER_COLORS.RED, 0), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 2), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 3), status: 'finish', distanceTraveled: 58 },
    ];

    expect(hasPlayerWon(tokens)).toBe(true);
  });

  it('should return false when less than 4 tokens finished', () => {
    const tokens: Token[] = [
      { ...createToken(PLAYER_COLORS.RED, 0), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 2), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 3), status: 'active', position: 50, distanceTraveled: 50 },
    ];

    expect(hasPlayerWon(tokens)).toBe(false);
  });

  it('should return false when no tokens finished', () => {
    const tokens: Token[] = [
      createToken(PLAYER_COLORS.RED, 0),
      createToken(PLAYER_COLORS.RED, 1),
      createToken(PLAYER_COLORS.RED, 2),
      createToken(PLAYER_COLORS.RED, 3),
    ];

    expect(hasPlayerWon(tokens)).toBe(false);
  });
});

describe('getPlayerResult', () => {
  it('should calculate player result correctly', () => {
    const allTokens: Token[] = [
      { ...createToken(PLAYER_COLORS.RED, 0), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 2), status: 'active', position: 30, distanceTraveled: 30 },
      { ...createToken(PLAYER_COLORS.RED, 3), status: 'home' },
    ];

    const result = getPlayerResult(PLAYER_COLORS.RED, allTokens, 2);

    expect(result.player).toBe(PLAYER_COLORS.RED);
    expect(result.position).toBe(2);
    expect(result.finishedTokens).toBe(2);
    expect(result.hasWon).toBe(false);
  });

  it('should mark player as won when all tokens finished', () => {
    const allTokens: Token[] = [
      { ...createToken(PLAYER_COLORS.RED, 0), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 2), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 3), status: 'finish', distanceTraveled: 58 },
    ];

    const result = getPlayerResult(PLAYER_COLORS.RED, allTokens, 1);

    expect(result.hasWon).toBe(true);
    expect(result.finishedTokens).toBe(4);
  });
});

describe('calculateWinState', () => {
  it('should return no winner when game in progress', () => {
    const allTokens: Token[] = [
      { ...createToken(PLAYER_COLORS.RED, 0), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'active', position: 20, distanceTraveled: 20 },
      createToken(PLAYER_COLORS.BLUE, 0),
      createToken(PLAYER_COLORS.BLUE, 1),
    ];

    const players = [PLAYER_COLORS.RED, PLAYER_COLORS.BLUE];
    const winState = calculateWinState(allTokens, players);

    expect(winState.isGameOver).toBe(false);
    expect(winState.winner).toBeNull();
    expect(winState.rankings.length).toBe(2);
  });

  it('should detect winner when all tokens finished', () => {
    const allTokens: Token[] = [
      { ...createToken(PLAYER_COLORS.RED, 0), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 2), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 3), status: 'finish', distanceTraveled: 58 },
      createToken(PLAYER_COLORS.BLUE, 0),
      createToken(PLAYER_COLORS.BLUE, 1),
    ];

    const players = [PLAYER_COLORS.RED, PLAYER_COLORS.BLUE];
    const winState = calculateWinState(allTokens, players);

    expect(winState.isGameOver).toBe(true);
    expect(winState.winner).toBe(PLAYER_COLORS.RED);
  });

  it('should rank players by finished tokens', () => {
    const allTokens: Token[] = [
      // Red: 3 finished
      { ...createToken(PLAYER_COLORS.RED, 0), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 2), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 3), status: 'active', position: 50, distanceTraveled: 50 },
      // Blue: 1 finished
      { ...createToken(PLAYER_COLORS.BLUE, 0), status: 'finish', distanceTraveled: 58 },
      createToken(PLAYER_COLORS.BLUE, 1),
      // Green: 0 finished
      createToken(PLAYER_COLORS.GREEN, 0),
    ];

    const players = [PLAYER_COLORS.RED, PLAYER_COLORS.BLUE, PLAYER_COLORS.GREEN];
    const winState = calculateWinState(allTokens, players);

    expect(winState.rankings[0].player).toBe(PLAYER_COLORS.RED);
    expect(winState.rankings[0].position).toBe(1);
    expect(winState.rankings[1].player).toBe(PLAYER_COLORS.BLUE);
    expect(winState.rankings[1].position).toBe(2);
    expect(winState.rankings[2].player).toBe(PLAYER_COLORS.GREEN);
    expect(winState.rankings[2].position).toBe(3);
  });
});

describe('shouldContinueGame', () => {
  it('should continue when no winner', () => {
    const winState = {
      isGameOver: false,
      winner: null,
      rankings: [],
    };

    expect(shouldContinueGame(winState, true)).toBe(true);
  });

  it('should end game immediately when continue disabled', () => {
    const winState = {
      isGameOver: true,
      winner: PLAYER_COLORS.RED,
      rankings: [
        { player: PLAYER_COLORS.RED, position: 1, finishedTokens: 4, hasWon: true },
        { player: PLAYER_COLORS.BLUE, position: 2, finishedTokens: 2, hasWon: false },
      ],
    };

    expect(shouldContinueGame(winState, false)).toBe(false);
  });

  it('should continue for rankings when enabled', () => {
    const winState = {
      isGameOver: true,
      winner: PLAYER_COLORS.RED,
      rankings: [
        { player: PLAYER_COLORS.RED, position: 1, finishedTokens: 4, hasWon: true },
        { player: PLAYER_COLORS.BLUE, position: 2, finishedTokens: 2, hasWon: false },
        { player: PLAYER_COLORS.GREEN, position: 2, finishedTokens: 1, hasWon: false },
      ],
    };

    expect(shouldContinueGame(winState, true)).toBe(true);
  });

  it('should end when only one player left competing', () => {
    const winState = {
      isGameOver: true,
      winner: PLAYER_COLORS.RED,
      rankings: [
        { player: PLAYER_COLORS.RED, position: 1, finishedTokens: 4, hasWon: true },
        { player: PLAYER_COLORS.BLUE, position: 2, finishedTokens: 4, hasWon: true },
        { player: PLAYER_COLORS.GREEN, position: 3, finishedTokens: 1, hasWon: false },
      ],
    };

    expect(shouldContinueGame(winState, true)).toBe(false);
  });
});

describe('getWinnersInOrder', () => {
  it('should return players in finishing order', () => {
    const winState = {
      isGameOver: true,
      winner: PLAYER_COLORS.RED,
      rankings: [
        { player: PLAYER_COLORS.BLUE, position: 2, finishedTokens: 3, hasWon: false },
        { player: PLAYER_COLORS.RED, position: 1, finishedTokens: 4, hasWon: true },
        { player: PLAYER_COLORS.GREEN, position: 3, finishedTokens: 1, hasWon: false },
      ],
    };

    const order = getWinnersInOrder(winState);

    expect(order).toEqual([PLAYER_COLORS.RED, PLAYER_COLORS.BLUE, PLAYER_COLORS.GREEN]);
  });
});

describe('canWinThisTurn', () => {
  it('should return true when player can finish last token', () => {
    const tokens: Token[] = [
      { ...createToken(PLAYER_COLORS.RED, 0), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 2), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 3), status: 'active', position: -1, distanceTraveled: 56 },
    ];

    expect(canWinThisTurn(tokens, 2)).toBe(true); // 56 + 2 = 58
  });

  it('should return false when roll does not finish token', () => {
    const tokens: Token[] = [
      { ...createToken(PLAYER_COLORS.RED, 0), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 2), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 3), status: 'active', position: -1, distanceTraveled: 56 },
    ];

    expect(canWinThisTurn(tokens, 1)).toBe(false); // 56 + 1 = 57 (not finished)
    expect(canWinThisTurn(tokens, 3)).toBe(false); // 56 + 3 = 59 (overshoots)
  });

  it('should return false when less than 3 tokens finished', () => {
    const tokens: Token[] = [
      { ...createToken(PLAYER_COLORS.RED, 0), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 2), status: 'active', position: 30, distanceTraveled: 30 },
      { ...createToken(PLAYER_COLORS.RED, 3), status: 'active', position: 40, distanceTraveled: 40 },
    ];

    expect(canWinThisTurn(tokens, 2)).toBe(false);
  });

  it('should return false when no active token', () => {
    const tokens: Token[] = [
      { ...createToken(PLAYER_COLORS.RED, 0), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 2), status: 'finish', distanceTraveled: 58 },
      createToken(PLAYER_COLORS.RED, 3), // still in home
    ];

    expect(canWinThisTurn(tokens, 6)).toBe(false);
  });
});

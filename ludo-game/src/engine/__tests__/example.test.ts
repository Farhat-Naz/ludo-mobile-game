/**
 * Example Test File
 * Demonstrates Jest and fast-check (property-based testing) usage
 */

import * as fc from 'fast-check';
import { DICE_CONFIG, BOARD_CONFIG, PLAYER_CONFIG } from '@utils/constants';

describe('Example Tests - Jest + fast-check', () => {
  describe('Basic Jest Tests', () => {
    test('constants are defined', () => {
      expect(DICE_CONFIG.MIN_VALUE).toBe(1);
      expect(DICE_CONFIG.MAX_VALUE).toBe(6);
      expect(BOARD_CONFIG.TOTAL_POSITIONS).toBe(72);
      expect(PLAYER_CONFIG.MIN_PLAYERS).toBe(2);
      expect(PLAYER_CONFIG.MAX_PLAYERS).toBe(4);
    });

    test('dice config values are valid', () => {
      expect(DICE_CONFIG.MIN_VALUE).toBeLessThan(DICE_CONFIG.MAX_VALUE);
      expect(DICE_CONFIG.EXTRA_TURN_VALUE).toBe(6);
      expect(DICE_CONFIG.OPEN_TOKEN_VALUE).toBe(6);
    });
  });

  describe('Property-Based Tests with fast-check', () => {
    test('dice roll always returns value between 1 and 6', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 1 }), (randomSeed) => {
          // Simulate dice roll using Math.random
          const roll = Math.floor(Math.random() * 6) + 1;
          return roll >= DICE_CONFIG.MIN_VALUE && roll <= DICE_CONFIG.MAX_VALUE;
        }),
        { numRuns: 1000 } // Run property test 1000 times
      );
    });

    test('player count is always within valid range', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: PLAYER_CONFIG.MIN_PLAYERS, max: PLAYER_CONFIG.MAX_PLAYERS }),
          (playerCount) => {
            return (
              playerCount >= PLAYER_CONFIG.MIN_PLAYERS && playerCount <= PLAYER_CONFIG.MAX_PLAYERS
            );
          }
        )
      );
    });

    test('board position calculations never overflow', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: BOARD_CONFIG.TOTAL_POSITIONS - 1 }),
          fc.integer({ min: 1, max: 6 }),
          (position, diceRoll) => {
            const newPosition = (position + diceRoll) % BOARD_CONFIG.TOTAL_POSITIONS;
            return newPosition >= 0 && newPosition < BOARD_CONFIG.TOTAL_POSITIONS;
          }
        )
      );
    });

    test('token count per player is always 4', () => {
      expect(BOARD_CONFIG.TOKENS_PER_PLAYER).toBe(4);

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: BOARD_CONFIG.TOKENS_PER_PLAYER - 1 }),
          (tokenIndex) => {
            return tokenIndex >= 0 && tokenIndex < BOARD_CONFIG.TOKENS_PER_PLAYER;
          }
        )
      );
    });
  });

  describe('Example Snapshot Tests', () => {
    test('dice config snapshot', () => {
      expect(DICE_CONFIG).toMatchSnapshot();
    });

    test('board config snapshot', () => {
      expect(BOARD_CONFIG).toMatchSnapshot();
    });

    test('player config snapshot', () => {
      expect(PLAYER_CONFIG).toMatchSnapshot();
    });
  });
});

/**
 * Board Model Tests
 * Unit and property-based tests for board position calculations
 */

import * as fc from 'fast-check';
import {
  calculateNewPosition,
  getStartingPosition,
  isSafeZone,
  isFinishZoneEntry,
  getFinishZonePosition,
  isAtFinish,
  isValidMove,
  calculateDistanceTraveled,
} from '../boardModel';
import { BOARD_CONFIG, PLAYER_COLORS } from '../../../utils/constants';

describe('calculateNewPosition', () => {
  it('should add dice roll to current position', () => {
    expect(calculateNewPosition(0, 3)).toBe(3);
    expect(calculateNewPosition(10, 5)).toBe(15);
  });

  it('should wrap around after reaching max position', () => {
    expect(calculateNewPosition(70, 5)).toBe(3); // (70 + 5) % 72 = 3
    expect(calculateNewPosition(71, 1)).toBe(0); // (71 + 1) % 72 = 0
  });

  // Property-based test
  it('always returns position within board bounds (property-based)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: BOARD_CONFIG.TOTAL_POSITIONS - 1 }),
        fc.integer({ min: 1, max: 6 }),
        (pos, roll) => {
          const newPos = calculateNewPosition(pos, roll);
          return newPos >= 0 && newPos < BOARD_CONFIG.TOTAL_POSITIONS;
        }
      )
    );
  });
});

describe('getStartingPosition', () => {
  it('should return correct starting positions for each color', () => {
    expect(getStartingPosition(PLAYER_COLORS.RED)).toBe(0);
    expect(getStartingPosition(PLAYER_COLORS.BLUE)).toBe(18);
    expect(getStartingPosition(PLAYER_COLORS.GREEN)).toBe(36);
    expect(getStartingPosition(PLAYER_COLORS.YELLOW)).toBe(54);
  });

  it('starting positions should be evenly distributed', () => {
    const positions = [
      getStartingPosition(PLAYER_COLORS.RED),
      getStartingPosition(PLAYER_COLORS.BLUE),
      getStartingPosition(PLAYER_COLORS.GREEN),
      getStartingPosition(PLAYER_COLORS.YELLOW),
    ];

    // Each player should be 18 positions apart (72 / 4)
    expect(positions[1] - positions[0]).toBe(18);
    expect(positions[2] - positions[1]).toBe(18);
    expect(positions[3] - positions[2]).toBe(18);
  });
});

describe('isSafeZone', () => {
  it('should return true for known safe zone positions', () => {
    expect(isSafeZone(0)).toBe(true);
    expect(isSafeZone(13)).toBe(true);
    expect(isSafeZone(18)).toBe(true);
    expect(isSafeZone(31)).toBe(true);
    expect(isSafeZone(36)).toBe(true);
    expect(isSafeZone(49)).toBe(true);
    expect(isSafeZone(54)).toBe(true);
    expect(isSafeZone(67)).toBe(true);
  });

  it('should return false for non-safe zone positions', () => {
    expect(isSafeZone(5)).toBe(false);
    expect(isSafeZone(10)).toBe(false);
    expect(isSafeZone(25)).toBe(false);
  });
});

describe('isFinishZoneEntry', () => {
  it('should return true when player completes circuit and reaches start', () => {
    expect(isFinishZoneEntry(0, PLAYER_COLORS.RED, 52)).toBe(true);
    expect(isFinishZoneEntry(18, PLAYER_COLORS.BLUE, 52)).toBe(true);
  });

  it('should return false if distance traveled is less than 51', () => {
    expect(isFinishZoneEntry(0, PLAYER_COLORS.RED, 20)).toBe(false);
    expect(isFinishZoneEntry(0, PLAYER_COLORS.RED, 50)).toBe(false);
  });

  it('should return false if not at starting position', () => {
    expect(isFinishZoneEntry(10, PLAYER_COLORS.RED, 52)).toBe(false);
  });
});

describe('getFinishZonePosition', () => {
  it('should return -1 if not in finish zone', () => {
    expect(getFinishZonePosition(0)).toBe(-1);
    expect(getFinishZonePosition(51)).toBe(-1);
  });

  it('should return correct position in finish zone', () => {
    expect(getFinishZonePosition(52)).toBe(0);
    expect(getFinishZonePosition(53)).toBe(1);
    expect(getFinishZonePosition(57)).toBe(5);
  });

  it('should return -1 if beyond finish zone', () => {
    expect(getFinishZonePosition(59)).toBe(-1);
  });
});

describe('isAtFinish', () => {
  it('should return true when token completes game', () => {
    expect(isAtFinish(58)).toBe(true); // 52 + 6
  });

  it('should return false when token is not finished', () => {
    expect(isAtFinish(0)).toBe(false);
    expect(isAtFinish(52)).toBe(false);
    expect(isAtFinish(57)).toBe(false);
  });
});

describe('isValidMove', () => {
  it('should return true for valid moves on main board', () => {
    expect(isValidMove(10, 3)).toBe(true);
    expect(isValidMove(0, 6)).toBe(true);
    expect(isValidMove(51, 1)).toBe(true);
  });

  it('should return false if already finished', () => {
    expect(isValidMove(58, 1)).toBe(false);
    expect(isValidMove(59, 3)).toBe(false);
  });

  it('should require exact roll to finish from finish zone', () => {
    expect(isValidMove(57, 1)).toBe(true); // Exactly finishes at 58
    expect(isValidMove(57, 2)).toBe(false); // Overshoots
    expect(isValidMove(55, 3)).toBe(true); // Exactly finishes at 58
    expect(isValidMove(55, 4)).toBe(false); // Overshoots
  });

  // Property-based test
  it('valid moves never exceed finish position (property-based)', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 57 }), fc.integer({ min: 1, max: 6 }), (distance, roll) => {
        const isValid = isValidMove(distance, roll);
        const newDistance = distance + roll;
        if (isValid && distance >= 52) {
          return newDistance <= 58;
        }
        return true;
      })
    );
  });
});

describe('calculateDistanceTraveled', () => {
  it('should calculate distance from starting position', () => {
    expect(calculateDistanceTraveled(5, 0)).toBe(5);
    expect(calculateDistanceTraveled(25, 18)).toBe(7);
  });

  it('should handle wrap-around correctly', () => {
    expect(calculateDistanceTraveled(5, 54)).toBe(23); // (72 - 54) + 5 = 23
  });

  it('should account for completed laps', () => {
    expect(calculateDistanceTraveled(10, 0, 1)).toBe(82); // 10 + 72
  });

  // Property-based test
  it('distance traveled is always non-negative (property-based)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 71 }),
        fc.integer({ min: 0, max: 71 }),
        fc.integer({ min: 0, max: 2 }),
        (current, start, laps) => {
          const distance = calculateDistanceTraveled(current, start, laps);
          return distance >= 0;
        }
      )
    );
  });
});

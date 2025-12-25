/**
 * Dice Rolling Logic Tests
 * Unit and property-based tests for dice mechanics
 */

import * as fc from 'fast-check';
import { rollDice, grantsExtraTurn, canOpenToken, isValidDiceRoll, shouldEndTurnAfterSixes } from '../rollDice';
import { DICE_CONFIG } from '../../../utils/constants';

describe('rollDice', () => {
  it('should return a number between 1 and 6', () => {
    const roll = rollDice();
    expect(roll).toBeGreaterThanOrEqual(DICE_CONFIG.MIN_VALUE);
    expect(roll).toBeLessThanOrEqual(DICE_CONFIG.MAX_VALUE);
  });

  it('should return an integer', () => {
    const roll = rollDice();
    expect(Number.isInteger(roll)).toBe(true);
  });

  // Property-based test: dice always returns valid values
  it('always returns value between 1 and 6 (property-based)', () => {
    fc.assert(
      fc.property(fc.integer(), () => {
        const roll = rollDice();
        return roll >= 1 && roll <= 6 && Number.isInteger(roll);
      }),
      { numRuns: 1000 }
    );
  });

  // Statistical test: all values should appear with reasonable distribution
  it('generates all values 1-6 over many rolls', () => {
    const rolls = new Set<number>();
    const numRolls = 1000;

    for (let i = 0; i < numRolls; i++) {
      rolls.add(rollDice());
    }

    // Over 1000 rolls, we should see all 6 values at least once
    expect(rolls.size).toBe(6);
    expect(rolls).toEqual(new Set([1, 2, 3, 4, 5, 6]));
  });
});

describe('grantsExtraTurn', () => {
  it('should return true for roll of 6', () => {
    expect(grantsExtraTurn(6)).toBe(true);
  });

  it('should return false for rolls 1-5', () => {
    expect(grantsExtraTurn(1)).toBe(false);
    expect(grantsExtraTurn(2)).toBe(false);
    expect(grantsExtraTurn(3)).toBe(false);
    expect(grantsExtraTurn(4)).toBe(false);
    expect(grantsExtraTurn(5)).toBe(false);
  });

  it('should return false for invalid values', () => {
    expect(grantsExtraTurn(0)).toBe(false);
    expect(grantsExtraTurn(7)).toBe(false);
    expect(grantsExtraTurn(-1)).toBe(false);
  });

  // Property-based test
  it('only grants extra turn for value 6 (property-based)', () => {
    fc.assert(
      fc.property(fc.integer(), (roll) => {
        const result = grantsExtraTurn(roll);
        return roll === 6 ? result === true : result === false;
      })
    );
  });
});

describe('canOpenToken', () => {
  it('should return true for roll of 6', () => {
    expect(canOpenToken(6)).toBe(true);
  });

  it('should return false for rolls 1-5', () => {
    expect(canOpenToken(1)).toBe(false);
    expect(canOpenToken(2)).toBe(false);
    expect(canOpenToken(3)).toBe(false);
    expect(canOpenToken(4)).toBe(false);
    expect(canOpenToken(5)).toBe(false);
  });

  it('should return false for invalid values', () => {
    expect(canOpenToken(0)).toBe(false);
    expect(canOpenToken(7)).toBe(false);
  });

  // Property-based test
  it('only allows opening token with value 6 (property-based)', () => {
    fc.assert(
      fc.property(fc.integer(), (roll) => {
        const result = canOpenToken(roll);
        return roll === 6 ? result === true : result === false;
      })
    );
  });
});

describe('isValidDiceRoll', () => {
  it('should return true for valid rolls 1-6', () => {
    expect(isValidDiceRoll(1)).toBe(true);
    expect(isValidDiceRoll(2)).toBe(true);
    expect(isValidDiceRoll(3)).toBe(true);
    expect(isValidDiceRoll(4)).toBe(true);
    expect(isValidDiceRoll(5)).toBe(true);
    expect(isValidDiceRoll(6)).toBe(true);
  });

  it('should return false for invalid values', () => {
    expect(isValidDiceRoll(0)).toBe(false);
    expect(isValidDiceRoll(7)).toBe(false);
    expect(isValidDiceRoll(-1)).toBe(false);
    expect(isValidDiceRoll(100)).toBe(false);
  });

  it('should return false for non-integers', () => {
    expect(isValidDiceRoll(1.5)).toBe(false);
    expect(isValidDiceRoll(3.14)).toBe(false);
    expect(isValidDiceRoll(NaN)).toBe(false);
    expect(isValidDiceRoll(Infinity)).toBe(false);
  });

  // Property-based test
  it('validates dice rolls correctly (property-based)', () => {
    fc.assert(
      fc.property(fc.integer(), (value) => {
        const isValid = isValidDiceRoll(value);
        const shouldBeValid = Number.isInteger(value) && value >= 1 && value <= 6;
        return isValid === shouldBeValid;
      })
    );
  });
});

describe('shouldEndTurnAfterSixes', () => {
  it('should return false for less than 3 consecutive sixes', () => {
    expect(shouldEndTurnAfterSixes(0)).toBe(false);
    expect(shouldEndTurnAfterSixes(1)).toBe(false);
    expect(shouldEndTurnAfterSixes(2)).toBe(false);
  });

  it('should return true for 3 or more consecutive sixes', () => {
    expect(shouldEndTurnAfterSixes(3)).toBe(true);
    expect(shouldEndTurnAfterSixes(4)).toBe(true);
    expect(shouldEndTurnAfterSixes(10)).toBe(true);
  });

  // Property-based test
  it('ends turn only after 3+ consecutive sixes (property-based)', () => {
    fc.assert(
      fc.property(fc.nat(), (count) => {
        const shouldEnd = shouldEndTurnAfterSixes(count);
        return count >= 3 ? shouldEnd === true : shouldEnd === false;
      })
    );
  });
});

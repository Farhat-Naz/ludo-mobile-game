# Testing

Comprehensive testing strategy for the Ludo mobile game using Jest, React Native Testing Library, fast-check, and Detox.

## Testing Philosophy

- **Test-Driven Development (TDD)**: Write tests before implementation
- **Property-Based Testing**: Use fast-check for game rules validation
- **80% Coverage Requirement**: Engine code must have 80% coverage
- **Integration > Unit**: Test behavior, not implementation details

## Test Types

### 1. Unit Tests

Test individual functions and modules in isolation:

```
src/engine/**/__tests__/*.test.ts
src/utils/__tests__/*.test.ts
src/services/**/__tests__/*.test.ts
```

### 2. Component Tests

Test React components using React Native Testing Library:

```
src/ui/**/__tests__/*.test.tsx
```

### 3. Property-Based Tests

Test game rules with random inputs using fast-check:

```
src/engine/**/__tests__/*.property.test.ts
```

### 4. Integration Tests

Test full user flows combining multiple modules:

```
tests/integration/**/*.test.ts
```

### 5. End-to-End Tests

Test complete app flows using Detox:

```
e2e/**/*.e2e.ts
```

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests (requires emulator)
npm run test:e2e:android
npm run test:e2e:ios
```

## Test Setup

Global test configuration in `tests/setup.js`:

```javascript
// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execAsync: jest.fn(),
    getAllAsync: jest.fn(),
    runAsync: jest.fn(),
  })),
}));

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-av (audio)
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() => Promise.resolve({ sound: {}, status: {} })),
    },
    setAudioModeAsync: jest.fn(),
  },
}));

// Set test timeout
jest.setTimeout(10000);
```

## Unit Test Examples

```typescript
// src/engine/dice/__tests__/rollDice.test.ts
import { rollDice } from '../rollDice';
import { DICE_CONFIG } from '@utils/constants';

describe('rollDice', () => {
  it('returns value between 1 and 6', () => {
    const result = rollDice();
    expect(result).toBeGreaterThanOrEqual(DICE_CONFIG.MIN_VALUE);
    expect(result).toBeLessThanOrEqual(DICE_CONFIG.MAX_VALUE);
  });

  it('returns integer value', () => {
    const result = rollDice();
    expect(Number.isInteger(result)).toBe(true);
  });
});
```

## Property-Based Test Examples

```typescript
// src/engine/board/__tests__/calculatePosition.property.test.ts
import * as fc from 'fast-check';
import { calculatePosition } from '../calculatePosition';
import { BOARD_CONFIG } from '@utils/constants';

describe('calculatePosition - property tests', () => {
  test('result is always valid board position', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: BOARD_CONFIG.TOTAL_POSITIONS - 1 }),
        fc.integer({ min: 1, max: 6 }),
        (position, roll) => {
          const result = calculatePosition(position, roll);
          return result >= 0 && result < BOARD_CONFIG.TOTAL_POSITIONS;
        }
      )
    );
  });

  test('wraps around board correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 60, max: 71 }),
        fc.integer({ min: 1, max: 6 }),
        (position, roll) => {
          const result = calculatePosition(position, roll);
          const expected = (position + roll) % BOARD_CONFIG.TOTAL_POSITIONS;
          return result === expected;
        }
      )
    );
  });
});
```

## Component Test Examples

```typescript
// src/ui/components/__tests__/DiceButton.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import DiceButton from '../DiceButton';

describe('DiceButton', () => {
  it('displays initial state', () => {
    const { getByText } = render(<DiceButton />);
    expect(getByText('Roll Dice')).toBeTruthy();
  });

  it('shows dice value after roll', () => {
    const { getByText, getByTestId } = render(<DiceButton />);

    const button = getByTestId('dice-button');
    fireEvent.press(button);

    // Should show a value between 1 and 6
    const text = getByTestId('dice-value').props.children;
    expect(text).toMatch(/^[1-6]$/);
  });

  it('calls onRoll callback when pressed', () => {
    const onRoll = jest.fn();
    const { getByTestId } = render(<DiceButton onRoll={onRoll} />);

    const button = getByTestId('dice-button');
    fireEvent.press(button);

    expect(onRoll).toHaveBeenCalledTimes(1);
  });
});
```

## Coverage Requirements

From `jest.config.js`:

```javascript
coverageThreshold: {
  'src/engine/**/*.{ts,tsx}': {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

Engine code must have **80% coverage** (per constitutional requirement).

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ✅ Good - Tests behavior
it('allows token to move when dice shows 6', () => {
  const token = { status: 'home', position: -1 };
  const canMove = canMoveToken(token, 6);
  expect(canMove).toBe(true);
});

// ❌ Bad - Tests implementation
it('calls checkDiceValue internally', () => {
  const spy = jest.spyOn(module, 'checkDiceValue');
  canMoveToken(token, 6);
  expect(spy).toHaveBeenCalled();
});
```

### 2. Use Property-Based Tests for Game Rules

```typescript
// Validate rule with thousands of random inputs
test('token position never exceeds board size', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 71 }),
      fc.integer({ min: 1, max: 6 }),
      (position, roll) => {
        const newPos = moveToken(position, roll);
        return newPos >= 0 && newPos < 72;
      }
    ),
    { numRuns: 10000 }
  );
});
```

### 3. Test Edge Cases

```typescript
describe('edge cases', () => {
  it('handles token at last position', () => {
    expect(calculatePosition(71, 1)).toBe(0);
  });

  it('handles max dice roll from last position', () => {
    expect(calculatePosition(71, 6)).toBe(5);
  });

  it('handles zero position', () => {
    expect(calculatePosition(0, 1)).toBe(1);
  });
});
```

### 4. Arrange-Act-Assert Pattern

```typescript
it('increments score when player wins', () => {
  // Arrange
  const player = { id: '1', score: 0 };

  // Act
  const result = recordWin(player);

  // Assert
  expect(result.score).toBe(1);
});
```

## Detox E2E Tests

```typescript
// e2e/game-flow.e2e.ts
describe('Game Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should complete a full game', async () => {
    // Start game
    await element(by.id('start-game-button')).tap();

    // Select 2 players
    await element(by.id('player-count-2')).tap();
    await element(by.id('confirm-button')).tap();

    // Roll dice
    await element(by.id('dice-button')).tap();

    // Should show dice value
    await expect(element(by.id('dice-value'))).toBeVisible();

    // Select token if available
    const token = element(by.id('token-0'));
    if (await token.isVisible()) {
      await token.tap();
    }
  });
});
```

## Snapshot Tests

Use sparingly for config objects:

```typescript
test('dice config snapshot', () => {
  expect(DICE_CONFIG).toMatchSnapshot();
});

test('board config snapshot', () => {
  expect(BOARD_CONFIG).toMatchSnapshot();
});
```

## Testing Anti-Patterns

### ❌ Avoid

```typescript
// Testing private methods
it('_calculateInternalValue works', () => {
  // Don't test private methods
});

// Over-mocking
it('calls every internal function', () => {
  // Don't verify implementation details
});

// Brittle selectors
await element(by.text('Exact Text')).tap(); // Breaks with text changes
```

### ✅ Prefer

```typescript
// Testing public API
it('returns correct result', () => {
  // Test behavior through public interface
});

// Minimal mocking
it('integrates with real modules', () => {
  // Only mock external dependencies
});

// Stable selectors
await element(by.id('start-button')).tap(); // Uses testID
```

## Coverage Reports

View coverage reports:

```bash
npm run test:coverage

# Open HTML report
open coverage/lcov-report/index.html
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [fast-check Documentation](https://fast-check.dev/)
- [Detox Documentation](https://wix.github.io/Detox/)

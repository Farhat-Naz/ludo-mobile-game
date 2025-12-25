# Game Engine

Framework-agnostic game logic for Ludo. This module contains all core game rules, mechanics, and state management logic.

## Purpose

The engine module is designed to be **completely independent** of any UI framework (React Native, React, Vue, etc.). This separation ensures:

- Game logic can be tested independently
- Logic can be reused across different platforms
- Engine can be ported to other frameworks easily
- Clear separation of concerns

## Constitutional Rules

### No Framework Dependencies

**ESLint enforces these rules automatically:**

```javascript
// ❌ NOT ALLOWED in src/engine/**
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

// ✅ ALLOWED in src/engine/**
import { DICE_CONFIG } from '@utils/constants';
import type { BoardState } from '@types/contracts/state-store.contract';
```

### Testing Requirements

- **80% code coverage** required for all engine code (branches, functions, lines, statements)
- Property-based testing with `fast-check` for game rules
- Unit tests for all game mechanics

## Directory Structure

```
src/engine/
├── dice/           # Dice rolling logic and validation
├── board/          # Board state management and path calculations
├── tokens/         # Token movement and collision rules
├── rules/          # Game rules engine (turn logic, winning conditions)
├── ai/             # AI opponent strategies
└── __tests__/      # Unit and property-based tests
```

## Examples

### Dice Logic

```typescript
// src/engine/dice/rollDice.ts
import { DICE_CONFIG } from '@utils/constants';

export function rollDice(): number {
  return Math.floor(Math.random() * DICE_CONFIG.MAX_VALUE) + DICE_CONFIG.MIN_VALUE;
}

export function requiresExtraTurn(roll: number): boolean {
  return roll === DICE_CONFIG.EXTRA_TURN_VALUE;
}

export function canOpenToken(roll: number): boolean {
  return roll === DICE_CONFIG.OPEN_TOKEN_VALUE;
}
```

### Board State

```typescript
// src/engine/board/calculatePosition.ts
import { BOARD_CONFIG } from '@utils/constants';

export function calculateNewPosition(
  currentPosition: number,
  diceRoll: number
): number {
  return (currentPosition + diceRoll) % BOARD_CONFIG.TOTAL_POSITIONS;
}

export function isValidMove(
  currentPosition: number,
  diceRoll: number,
  targetPosition: number
): boolean {
  const calculatedPosition = calculateNewPosition(currentPosition, diceRoll);
  return calculatedPosition === targetPosition;
}
```

### Token Rules

```typescript
// src/engine/tokens/tokenMovement.ts
import type { Token } from '@types/contracts/state-store.contract';

export function canMoveToken(token: Token, diceRoll: number): boolean {
  // Token in home? Needs 6 to open
  if (token.status === 'home') {
    return diceRoll === 6;
  }

  // Token on board? Can always move
  if (token.status === 'active') {
    return true;
  }

  // Token finished? Cannot move
  return false;
}

export function handleTokenCollision(
  movingToken: Token,
  targetPosition: number,
  allTokens: Token[]
): Token[] {
  // Implementation of cutting logic
  // ...
}
```

## Best Practices

### 1. Pure Functions

Prefer pure functions that don't mutate state:

```typescript
// ✅ Good - Pure function
export function calculateNewPosition(current: number, roll: number): number {
  return (current + roll) % BOARD_CONFIG.TOTAL_POSITIONS;
}

// ❌ Bad - Mutates input
export function moveToken(token: Token, roll: number): void {
  token.position += roll; // Mutation!
}
```

### 2. Immutable State Updates

Return new objects instead of modifying existing ones:

```typescript
// ✅ Good - Returns new object
export function updateTokenPosition(token: Token, newPosition: number): Token {
  return {
    ...token,
    position: newPosition,
  };
}
```

### 3. Property-Based Testing

Use `fast-check` for comprehensive rule validation:

```typescript
import * as fc from 'fast-check';

test('dice roll always returns value between 1 and 6', () => {
  fc.assert(
    fc.property(fc.integer(), () => {
      const roll = rollDice();
      return roll >= 1 && roll <= 6;
    }),
    { numRuns: 1000 }
  );
});
```

### 4. Type Safety

Leverage TypeScript's type system:

```typescript
// Define strict types in contracts
import type { PlayerColor, GamePhase } from '@types/contracts/state-store.contract';

export function isPlayerTurn(
  currentPlayer: PlayerColor,
  activePlayer: PlayerColor
): boolean {
  return currentPlayer === activePlayer;
}
```

## Testing

Run engine tests:

```bash
# All tests
npm test

# Watch mode
npm test:watch

# Coverage (must hit 80% threshold)
npm run test:coverage
```

## Integration with UI

The UI layer calls engine functions but never vice versa:

```typescript
// ✅ Good - UI calls engine
// src/ui/components/DiceButton.tsx
import { rollDice } from '@engine/dice/rollDice';

function DiceButton() {
  const handleRoll = () => {
    const result = rollDice(); // Engine function
    updateGameState(result); // UI state update
  };
}

// ❌ Bad - Engine should never import from UI
// src/engine/dice/rollDice.ts
import { showToast } from '@ui/components/Toast'; // NEVER!
```

## Dependencies

Engine code can import from:

- `@utils/*` - Shared utilities and constants
- `@types/*` - Type definitions
- Other `@engine/*` modules
- Standard JavaScript/TypeScript libraries
- Testing libraries (in `__tests__` only)

Engine code **cannot** import from:

- `@ui/*` - UI components
- `@navigation/*` - Navigation
- `@services/*` - Platform services
- `react-native` - Framework
- `expo-*` - Expo modules
- `@react-navigation/*` - Navigation

ESLint will enforce these rules automatically.

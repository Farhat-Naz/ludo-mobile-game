# Utilities

Shared utility functions, constants, and helper modules used across the application.

## Purpose

The utils module contains:

- **Constants**: Game configuration values (board size, dice range, colors, etc.)
- **Helper Functions**: Pure utility functions (formatters, validators, math helpers)
- **Color System**: Colorblind-accessible palette and pattern utilities
- **Type Guards**: Runtime type checking utilities

## Directory Structure

```
src/utils/
├── constants.ts        # Game constants and configuration
├── colors.ts           # Color palette and accessibility utilities
├── formatters.ts       # String and number formatting
├── validators.ts       # Input validation functions
├── helpers.ts          # General-purpose utilities
└── __tests__/          # Unit tests for utilities
```

## Constants

Central location for all magic numbers and configuration:

```typescript
// src/utils/constants.ts

// Player Colors (keys match type PlayerColor)
export const PLAYER_COLORS = {
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green',
  YELLOW: 'yellow',
} as const;

export type PlayerColor = (typeof PLAYER_COLORS)[keyof typeof PLAYER_COLORS];

// Board Configuration
export const BOARD_CONFIG = {
  TOTAL_POSITIONS: 72,
  POSITIONS_PER_PLAYER: 18,
  TOKENS_PER_PLAYER: 4,
  SAFE_ZONE_POSITIONS: 6,
} as const;

// Dice Configuration
export const DICE_CONFIG = {
  MIN_VALUE: 1,
  MAX_VALUE: 6,
  EXTRA_TURN_VALUE: 6,
  OPEN_TOKEN_VALUE: 6,
} as const;

// Game Rules
export const GAME_RULES = {
  MAX_CONSECUTIVE_ROLLS: 3, // Max extra turns from rolling 6
  CAPTURE_SENDS_HOME: true,
  EXACT_FINISH_REQUIRED: true,
} as const;

// Animation Timings (milliseconds)
export const ANIMATION_TIMINGS = {
  TOKEN_MOVE: 500,
  DICE_ROLL: 800,
  SCREEN_TRANSITION: 300,
  TOAST_DURATION: 2000,
} as const;

// Player Configuration
export const PLAYER_CONFIG = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 4,
  STARTING_POSITION: {
    [PLAYER_COLORS.RED]: 0,
    [PLAYER_COLORS.BLUE]: 18,
    [PLAYER_COLORS.GREEN]: 36,
    [PLAYER_COLORS.YELLOW]: 54,
  },
} as const;
```

## Color System

Colorblind-accessible palette with WCAG AA compliance:

```typescript
// src/utils/colors.ts

// Player Colors (Colorblind-Safe Palette)
export const COLORS = {
  RED: {
    primary: '#E53935', // Bright red
    light: '#FF6F60',
    dark: '#AB000D',
    pattern: 'solid',
  },
  BLUE: {
    primary: '#1E88E5', // Bright blue
    light: '#6AB7FF',
    dark: '#005CB2',
    pattern: 'diagonal-lines',
  },
  GREEN: {
    primary: '#7CB342', // Yellow-green (avoids red-green confusion)
    light: '#AEE571',
    dark: '#4B830D',
    pattern: 'dots',
  },
  YELLOW: {
    primary: '#FDD835', // Bright yellow-orange
    light: '#FFFF6B',
    dark: '#C6A700',
    pattern: 'cross-hatch',
  },
} as const;

// UI Theme Colors
export const THEME_COLORS = {
  primary: '#1976D2',
  secondary: '#FBC02D',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  error: '#D32F2F',
  success: '#388E3C',
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },
  divider: '#E0E0E0',
} as const;

// Pattern Identifiers (for colorblind accessibility)
export const PATTERNS = {
  [PLAYER_COLORS.RED]: 'solid',
  [PLAYER_COLORS.BLUE]: 'diagonal-lines',
  [PLAYER_COLORS.GREEN]: 'dots',
  [PLAYER_COLORS.YELLOW]: 'cross-hatch',
} as const;

// Helper functions
export const getPlayerColor = (color: keyof typeof PLAYER_COLORS) => {
  return COLORS[color];
};

export const getPlayerPattern = (color: keyof typeof PLAYER_COLORS): string => {
  return PATTERNS[PLAYER_COLORS[color]];
};
```

## Formatters

String and number formatting utilities:

```typescript
// src/utils/formatters.ts

/**
 * Format duration in milliseconds to human-readable string
 * @example formatDuration(65000) => "1m 5s"
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Format date to relative time string
 * @example formatRelativeTime(yesterday) => "1 day ago"
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMinutes > 0)
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Format win percentage
 * @example formatWinRate(15, 20) => "75%"
 */
export function formatWinRate(wins: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((wins / total) * 100)}%`;
}

/**
 * Format large numbers with abbreviations
 * @example formatNumber(1500) => "1.5K"
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}
```

## Validators

Input validation functions:

```typescript
// src/utils/validators.ts

/**
 * Validate player name (2-20 characters, alphanumeric + spaces)
 */
export function isValidPlayerName(name: string): boolean {
  return /^[a-zA-Z0-9 ]{2,20}$/.test(name);
}

/**
 * Validate dice roll value
 */
export function isValidDiceRoll(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= DICE_CONFIG.MIN_VALUE &&
    value <= DICE_CONFIG.MAX_VALUE
  );
}

/**
 * Validate board position
 */
export function isValidBoardPosition(position: number): boolean {
  return (
    Number.isInteger(position) &&
    position >= 0 &&
    position < BOARD_CONFIG.TOTAL_POSITIONS
  );
}

/**
 * Validate player count
 */
export function isValidPlayerCount(count: number): boolean {
  return (
    Number.isInteger(count) &&
    count >= PLAYER_CONFIG.MIN_PLAYERS &&
    count <= PLAYER_CONFIG.MAX_PLAYERS
  );
}
```

## Helpers

General-purpose utility functions:

```typescript
// src/utils/helpers.ts

/**
 * Delay execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Deep clone object (simple version)
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if two arrays are equal (shallow)
 */
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

/**
 * Group array items by key
 */
export function groupBy<T, K extends string | number>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return array.reduce(
    (result, item) => {
      const key = getKey(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    },
    {} as Record<K, T[]>
  );
}
```

## Type Guards

Runtime type checking utilities:

```typescript
// src/utils/typeGuards.ts

import type { PlayerColor, GamePhase } from '@types/contracts/state-store.contract';

/**
 * Check if value is a valid PlayerColor
 */
export function isPlayerColor(value: unknown): value is PlayerColor {
  return (
    typeof value === 'string' &&
    Object.values(PLAYER_COLORS).includes(value as PlayerColor)
  );
}

/**
 * Check if value is a valid GamePhase
 */
export function isGamePhase(value: unknown): value is GamePhase {
  const validPhases: GamePhase[] = [
    'waiting',
    'dice-rolled',
    'token-moved',
    'turn-end',
    'game-over',
  ];
  return typeof value === 'string' && validPhases.includes(value as GamePhase);
}

/**
 * Assert value is not null/undefined
 */
export function assertDefined<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error('Value is null or undefined');
  }
}
```

## Testing Utilities

Property-based testing with fast-check:

```typescript
// src/utils/__tests__/helpers.property.test.ts
import * as fc from 'fast-check';
import { clamp, randomInt, arraysEqual } from '../helpers';

describe('helpers - property-based tests', () => {
  test('clamp always returns value between min and max', () => {
    fc.assert(
      fc.property(
        fc.integer(),
        fc.integer(),
        fc.integer(),
        (value, a, b) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);
          const result = clamp(value, min, max);
          return result >= min && result <= max;
        }
      )
    );
  });

  test('randomInt always returns integer in range', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (max) => {
        const result = randomInt(1, max);
        return Number.isInteger(result) && result >= 1 && result <= max;
      }),
      { numRuns: 1000 }
    );
  });

  test('arraysEqual is symmetric', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a, b) => {
        return arraysEqual(a, b) === arraysEqual(b, a);
      })
    );
  });
});
```

## Best Practices

### 1. Pure Functions

All utils should be pure functions:

```typescript
// ✅ Good - Pure function
export function add(a: number, b: number): number {
  return a + b;
}

// ❌ Bad - Side effect
let total = 0;
export function addToTotal(value: number): void {
  total += value; // Mutation!
}
```

### 2. Comprehensive Tests

Test utilities thoroughly:

```typescript
describe('formatDuration', () => {
  it('formats seconds correctly', () => {
    expect(formatDuration(5000)).toBe('5s');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(65000)).toBe('1m 5s');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(3665000)).toBe('1h 1m');
  });
});
```

### 3. TypeScript Generics

Use generics for reusable utilities:

```typescript
export function groupBy<T, K extends string | number>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  // Implementation
}
```

### 4. JSDoc Comments

Document complex utilities:

```typescript
/**
 * Calculate new board position after dice roll
 * @param current - Current position (0-71)
 * @param roll - Dice roll value (1-6)
 * @returns New position after wrapping around board
 * @example calculatePosition(70, 5) => 3
 */
export function calculatePosition(current: number, roll: number): number {
  return (current + roll) % BOARD_CONFIG.TOTAL_POSITIONS;
}
```

## Dependencies

Utils can import from:

- `@types/*` - Type definitions
- Standard JavaScript/TypeScript libraries

Utils **should not** import from:

- `@engine/*` - Business logic
- `@ui/*` - UI components
- `@state/*` - State stores
- `@services/*` - Platform services

Keep utils dependency-free and framework-agnostic.

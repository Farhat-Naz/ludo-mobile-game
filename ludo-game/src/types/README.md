# Type Definitions

TypeScript type definitions and interface contracts for the entire application.

## Purpose

The types module contains:

- **Contracts**: Interface definitions for stores, services, and major subsystems
- **Game Types**: Type definitions for game entities (players, tokens, board state)
- **UI Types**: Type definitions for component props and navigation
- **Utility Types**: Generic type helpers and transformations

## Directory Structure

```
src/types/
├── contracts/              # Interface contracts
│   ├── state-store.contract.ts
│   ├── settings-store.contract.ts
│   ├── profile-store.contract.ts
│   ├── navigation.contract.ts
│   └── services.contract.ts
├── game/                   # Game entity types
│   ├── player.types.ts
│   ├── token.types.ts
│   ├── board.types.ts
│   └── dice.types.ts
├── ui/                     # UI-specific types
│   ├── component.types.ts
│   └── screen.types.ts
└── util.types.ts           # Generic utility types
```

## Contract Pattern

Contracts define the public API of major subsystems. They serve as:

- **Documentation**: Clear specification of what a subsystem does
- **Testing**: Mock implementations for unit tests
- **Dependency Inversion**: Code depends on interfaces, not concrete implementations

### State Store Contracts

```typescript
// src/types/contracts/state-store.contract.ts

import type { PlayerColor } from '@utils/constants';

/**
 * Token entity
 */
export interface Token {
  id: string;
  playerId: string;
  color: PlayerColor;
  position: number; // 0-71 on board, -1 if in home
  status: 'home' | 'active' | 'safe-zone' | 'finished';
}

/**
 * Player entity
 */
export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  isAI: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
}

/**
 * Game phase
 */
export type GamePhase =
  | 'waiting' // Waiting for player to roll
  | 'dice-rolled' // Dice rolled, waiting for token selection
  | 'token-moved' // Token moved, processing turn effects
  | 'turn-end' // Turn ending, preparing for next player
  | 'game-over'; // Game finished

/**
 * Game store interface
 */
export interface IGameStore {
  // State
  currentPlayer: PlayerColor;
  phase: GamePhase;
  diceValue: number | null;
  players: Player[];
  tokens: Token[];
  turnNumber: number;
  winner: PlayerColor | null;

  // Actions
  actions: {
    setupGame: (config: GameSetupConfig) => void;
    rollDice: () => void;
    moveToken: (tokenId: string) => void;
    nextTurn: () => void;
    reset: () => void;
  };
}

/**
 * Game setup configuration
 */
export interface GameSetupConfig {
  playerCount: number;
  players: Array<{
    name: string;
    color: PlayerColor;
    isAI: boolean;
    difficulty?: 'easy' | 'medium' | 'hard';
  }>;
}
```

### Settings Store Contract

```typescript
// src/types/contracts/settings-store.contract.ts

export interface ISettingsStore {
  // State
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  musicVolume: number; // 0-1
  sfxVolume: number; // 0-1
  difficulty: 'easy' | 'medium' | 'hard';
  colorblindMode: boolean;
  language: 'en' | 'es' | 'fr'; // Future expansion

  // Actions
  actions: {
    toggleSound: () => void;
    toggleHaptics: () => void;
    setVolume: (type: 'music' | 'sfx', volume: number) => void;
    setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
    toggleColorblindMode: () => void;
    setLanguage: (language: 'en' | 'es' | 'fr') => void;
  };
}
```

### Service Contracts

```typescript
// src/types/contracts/services.contract.ts

/**
 * Audio service interface
 */
export interface IAudioService {
  initialize(): Promise<void>;
  playSound(soundId: string): Promise<void>;
  playMusic(trackId: string): Promise<void>;
  stopMusic(): Promise<void>;
  setVolume(type: 'sfx' | 'music', volume: number): Promise<void>;
  cleanup(): Promise<void>;
}

/**
 * Haptic service interface
 */
export interface IHapticService {
  setEnabled(enabled: boolean): void;
  triggerLight(): Promise<void>;
  triggerMedium(): Promise<void>;
  triggerHeavy(): Promise<void>;
  triggerSuccess(): Promise<void>;
  triggerWarning(): Promise<void>;
  triggerError(): Promise<void>;
}

/**
 * Storage service interface
 */
export interface IAsyncStorageService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

### Navigation Contract

```typescript
// src/types/contracts/navigation.contract.ts

/**
 * Root navigation stack parameter list
 * Defines all screens and their required parameters
 */
export type RootStackParamList = {
  Home: undefined; // No params
  Game: {
    playerCount: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
  Settings: undefined;
  Profile: undefined;
  HowToPlay: undefined;
  GameHistory: undefined;
  Achievements: undefined;
};

/**
 * Helper type to get screen props
 * Usage: type HomeScreenProps = ScreenProps<'Home'>
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
```

## Game Entity Types

```typescript
// src/types/game/player.types.ts

import type { PlayerColor } from '@utils/constants';

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  winRate: number;
  averageTurns: number;
  fastestWin: number | null; // Duration in ms
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  stats: PlayerStats;
  achievements: string[];
  createdAt: string;
  lastPlayed: string | null;
}

// src/types/game/token.types.ts

export type TokenStatus = 'home' | 'active' | 'safe-zone' | 'finished';

export interface TokenState {
  id: string;
  playerId: string;
  color: PlayerColor;
  position: number;
  status: TokenStatus;
  canMove: boolean; // Calculated based on dice roll
  isSelected: boolean;
}

// src/types/game/board.types.ts

export interface CellState {
  position: number;
  type: 'normal' | 'safe' | 'start' | 'finish';
  color?: PlayerColor; // For colored cells (start, finish)
  tokens: string[]; // Token IDs on this cell
}

export interface BoardState {
  cells: CellState[];
  activePath: number[]; // Path for current player
  safeZones: Record<PlayerColor, number[]>; // Safe zone positions for each player
}
```

## UI Component Types

```typescript
// src/types/ui/component.types.ts

import type { ViewStyle, TextStyle } from 'react-native';
import type { PlayerColor } from '@utils/constants';

/**
 * Common button props
 */
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Token component props
 */
export interface TokenComponentProps {
  tokenId: string;
  color: PlayerColor;
  position: number;
  isSelected: boolean;
  canMove: boolean;
  onPress?: () => void;
  size?: number;
  animated?: boolean;
}

/**
 * Dice component props
 */
export interface DiceComponentProps {
  value: number | null;
  isRolling: boolean;
  onRoll: () => void;
  disabled?: boolean;
  size?: number;
}
```

## Utility Types

```typescript
// src/types/util.types.ts

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make all properties readonly recursively
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Extract function parameter types
 */
export type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

/**
 * Extract function return type
 */
export type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : never;

/**
 * Require at least one property
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * Make specific properties required
 */
export type RequireKeys<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};
```

## Type Guards

Use type guards to safely narrow types at runtime:

```typescript
import type { Token, Player } from '@types/contracts/state-store.contract';

/**
 * Check if token can move
 */
export function isMovableToken(token: Token, diceValue: number): boolean {
  if (token.status === 'finished') return false;
  if (token.status === 'home') return diceValue === 6;
  return true;
}

/**
 * Check if player is AI
 */
export function isAIPlayer(player: Player): boolean {
  return player.isAI === true;
}
```

## Best Practices

### 1. Use Contracts for Public APIs

Define interfaces for all major subsystems:

```typescript
// ✅ Good - Interface contract
export interface IGameEngine {
  rollDice(): number;
  moveToken(tokenId: string, steps: number): boolean;
}

// Implementation
export class GameEngine implements IGameEngine {
  // ...
}
```

### 2. Prefer Type over Interface for Unions/Intersections

```typescript
// ✅ Good - Type for unions
export type GamePhase = 'waiting' | 'active' | 'finished';

// ✅ Good - Interface for object shapes
export interface Player {
  id: string;
  name: string;
}
```

### 3. Use Const Assertions for Constants

```typescript
export const PLAYER_COLORS = {
  RED: 'red',
  BLUE: 'blue',
} as const;

// Type is: { readonly RED: "red"; readonly BLUE: "blue"; }
```

### 4. Document Complex Types

```typescript
/**
 * Game setup configuration
 *
 * @example
 * const config: GameSetupConfig = {
 *   playerCount: 2,
 *   players: [
 *     { name: "Alice", color: "RED", isAI: false },
 *     { name: "Bob", color: "BLUE", isAI: true, difficulty: "medium" }
 *   ]
 * };
 */
export interface GameSetupConfig {
  playerCount: number;
  players: PlayerConfig[];
}
```

### 5. Extract Types from Constants

```typescript
export const PLAYER_COLORS = {
  RED: 'red',
  BLUE: 'blue',
} as const;

// Extract type from values
export type PlayerColor = (typeof PLAYER_COLORS)[keyof typeof PLAYER_COLORS];
// Type is: "red" | "blue"
```

## Dependencies

Types can import from:

- `@utils/*` - Constants (to derive types)
- Other `@types/*` modules
- External type libraries (`react-native`, `@react-navigation/*`, etc.)

Types **should not** import from:

- `@engine/*` - Business logic
- `@ui/*` - UI components
- `@state/*` - State stores
- `@services/*` - Services

Keep types pure and dependency-free.

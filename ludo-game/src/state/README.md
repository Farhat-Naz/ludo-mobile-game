# State Management

Zustand stores for global application state with persistence middleware.

## Purpose

The state module manages all global application state using Zustand, a lightweight (1KB) state management library. It handles:

- Game state (current game, players, board, turns)
- User settings (sound, haptics, difficulty)
- Player profile (statistics, achievements)
- App preferences (theme, language)

## Why Zustand?

- **Tiny bundle size**: 1KB (vs Redux 3KB + Redux Toolkit 10KB)
- **Simple API**: No boilerplate, no providers, no reducers
- **TypeScript first**: Built-in type inference
- **Middleware support**: Persistence, devtools, immer
- **Performance**: Selector-based subscriptions prevent unnecessary re-renders

## Directory Structure

```
src/state/
├── stores/
│   ├── gameStore.ts        # Active game state
│   ├── settingsStore.ts    # User preferences
│   └── profileStore.ts     # Player profile and stats
├── middleware/
│   ├── persistence.ts      # AsyncStorage + SQLite persistence
│   └── devtools.ts         # Redux DevTools integration
└── __tests__/              # State logic tests
```

## Store Structure

Each store follows this pattern:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyStore {
  // State
  count: number;
  items: string[];

  // Actions
  actions: {
    increment: () => void;
    addItem: (item: string) => void;
    reset: () => void;
  };
}

export const useMyStore = create<MyStore>()(
  persist(
    (set, get) => ({
      // Initial state
      count: 0,
      items: [],

      // Actions
      actions: {
        increment: () => set((state) => ({ count: state.count + 1 })),
        addItem: (item) => set((state) => ({ items: [...state.items, item] })),
        reset: () => set({ count: 0, items: [] }),
      },
    }),
    {
      name: 'my-store', // LocalStorage key
    }
  )
);
```

## Persistence Strategy

### Hybrid Storage

- **AsyncStorage**: For user settings and preferences (key-value pairs)
- **SQLite**: For complex relational data (game history, statistics)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

// Settings store - persisted to AsyncStorage
export const useSettingsStore = create<ISettingsStore>()(
  persist(
    (set) => ({
      soundEnabled: true,
      hapticsEnabled: true,
      actions: {
        // ...
      },
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

## Store Examples

### Game Store

```typescript
import { create } from 'zustand';
import type { IGameStore } from '@types/contracts/state-store.contract';
import { rollDice } from '@engine/dice/rollDice';
import { calculateNewPosition } from '@engine/board/calculatePosition';

export const useGameStore = create<IGameStore>()((set, get) => ({
  // State
  currentPlayer: 'RED',
  phase: 'waiting',
  diceValue: null,
  players: [],
  tokens: [],

  // Actions
  actions: {
    rollDice: () => {
      const value = rollDice(); // Engine logic
      set({ diceValue: value, phase: 'dice-rolled' });
    },

    moveToken: (tokenId: string) => {
      const { diceValue, tokens } = get();
      if (!diceValue) return;

      const token = tokens.find((t) => t.id === tokenId);
      if (!token) return;

      const newPosition = calculateNewPosition(token.position, diceValue);

      set({
        tokens: tokens.map((t) =>
          t.id === tokenId ? { ...t, position: newPosition } : t
        ),
        phase: 'token-moved',
      });
    },

    nextTurn: () => {
      const { currentPlayer } = get();
      const nextPlayer = getNextPlayer(currentPlayer); // Engine logic
      set({
        currentPlayer: nextPlayer,
        diceValue: null,
        phase: 'waiting',
      });
    },

    reset: () => {
      set({
        currentPlayer: 'RED',
        phase: 'waiting',
        diceValue: null,
        tokens: [],
      });
    },
  },
}));
```

### Settings Store

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ISettingsStore } from '@types/contracts/settings-store.contract';

export const useSettingsStore = create<ISettingsStore>()(
  persist(
    (set) => ({
      // State
      soundEnabled: true,
      hapticsEnabled: true,
      musicVolume: 0.7,
      sfxVolume: 0.8,
      difficulty: 'medium',
      colorblindMode: false,

      // Actions
      actions: {
        toggleSound: () =>
          set((state) => ({ soundEnabled: !state.soundEnabled })),

        toggleHaptics: () =>
          set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),

        setVolume: (type: 'music' | 'sfx', volume: number) =>
          set({
            [type === 'music' ? 'musicVolume' : 'sfxVolume']: Math.max(
              0,
              Math.min(1, volume)
            ),
          }),

        setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') =>
          set({ difficulty }),

        toggleColorblindMode: () =>
          set((state) => ({ colorblindMode: !state.colorblindMode })),
      },
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Profile Store

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { IProfileStore } from '@types/contracts/profile-store.contract';

export const useProfileStore = create<IProfileStore>()(
  persist(
    (set, get) => ({
      // State
      playerName: 'Player',
      avatar: 'default',
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        gamesAbandoned: 0,
        totalPlayTime: 0,
        longestWinStreak: 0,
      },
      achievements: [],

      // Actions
      actions: {
        setPlayerName: (name: string) => set({ playerName: name }),

        setAvatar: (avatar: string) => set({ avatar }),

        recordGameResult: (result: 'win' | 'loss' | 'abandoned') => {
          const { stats } = get();
          set({
            stats: {
              ...stats,
              gamesPlayed: stats.gamesPlayed + 1,
              gamesWon: result === 'win' ? stats.gamesWon + 1 : stats.gamesWon,
              gamesLost:
                result === 'loss' ? stats.gamesLost + 1 : stats.gamesLost,
              gamesAbandoned:
                result === 'abandoned'
                  ? stats.gamesAbandoned + 1
                  : stats.gamesAbandoned,
            },
          });
        },

        unlockAchievement: (achievementId: string) => {
          const { achievements } = get();
          if (!achievements.includes(achievementId)) {
            set({ achievements: [...achievements, achievementId] });
          }
        },
      },
    }),
    {
      name: 'profile-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

## Selector Usage for Performance

### ❌ Bad - Subscribes to entire store

```typescript
function MyComponent() {
  const store = useGameStore(); // Re-renders on ANY state change
  return <Text>{store.currentPlayer}</Text>;
}
```

### ✅ Good - Subscribes to specific value

```typescript
function MyComponent() {
  const currentPlayer = useGameStore((state) => state.currentPlayer);
  // Only re-renders when currentPlayer changes
  return <Text>{currentPlayer}</Text>;
}
```

### ✅ Good - Select multiple values efficiently

```typescript
import { shallow } from 'zustand/shallow';

function MyComponent() {
  const { currentPlayer, phase } = useGameStore(
    (state) => ({
      currentPlayer: state.currentPlayer,
      phase: state.phase,
    }),
    shallow // Shallow equality check
  );

  return (
    <View>
      <Text>{currentPlayer}</Text>
      <Text>{phase}</Text>
    </View>
  );
}
```

### ✅ Good - Select actions (never change)

```typescript
function DiceButton() {
  const rollDice = useGameStore((state) => state.actions.rollDice);
  // Actions never change, so this never re-renders
  return <Button onPress={rollDice} title="Roll" />;
}
```

## Testing Stores

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useGameStore } from '../gameStore';

describe('gameStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.actions.reset();
    });
  });

  it('rolls dice and updates state', () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.actions.rollDice();
    });

    expect(result.current.diceValue).toBeGreaterThanOrEqual(1);
    expect(result.current.diceValue).toBeLessThanOrEqual(6);
    expect(result.current.phase).toBe('dice-rolled');
  });

  it('moves token to correct position', () => {
    const { result } = renderHook(() => useGameStore());

    // Setup
    act(() => {
      result.current.actions.setupGame({
        players: ['RED', 'BLUE'],
        tokens: [{ id: 'token-1', position: 0, color: 'RED', status: 'active' }],
      });
      result.current.actions.rollDice();
    });

    const initialDiceValue = result.current.diceValue!;

    act(() => {
      result.current.actions.moveToken('token-1');
    });

    const token = result.current.tokens.find((t) => t.id === 'token-1');
    expect(token?.position).toBe(initialDiceValue);
  });
});
```

## Middleware

### Custom Persistence Middleware

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

export const hybridPersistence = (config) => (set, get, api) => {
  // Persist simple state to AsyncStorage
  // Persist complex state to SQLite

  return config(
    (...args) => {
      set(...args);
      // Save to storage after each state update
      const state = get();
      saveToStorage(state);
    },
    get,
    api
  );
};
```

### DevTools Integration

```typescript
import { devtools } from 'zustand/middleware';

export const useGameStore = create<IGameStore>()(
  devtools(
    (set, get) => ({
      // ... store implementation
    }),
    { name: 'GameStore' }
  )
);

// Now inspect state in Redux DevTools
```

## Best Practices

### 1. Separate State and Actions

```typescript
interface MyStore {
  // State
  count: number;

  // Actions (grouped)
  actions: {
    increment: () => void;
    decrement: () => void;
  };
}
```

### 2. Immutable Updates

```typescript
// ✅ Good - Immutable
set((state) => ({ items: [...state.items, newItem] }));

// ❌ Bad - Mutation
set((state) => {
  state.items.push(newItem); // Mutates state!
  return state;
});
```

### 3. Async Actions

```typescript
actions: {
  loadGameData: async (gameId: string) => {
    set({ loading: true });
    try {
      const data = await fetchGameData(gameId);
      set({ gameData: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}
```

### 4. Computed Values

```typescript
// Don't store computed values in state
// Instead, compute them in selectors
function MyComponent() {
  const totalTokensFinished = useGameStore((state) =>
    state.tokens.filter((t) => t.status === 'finished').length
  );
}
```

## Dependencies

State code can import from:

- `@engine/*` - Game logic
- `@services/*` - Platform services (for async actions)
- `@types/*` - Type definitions
- `@utils/*` - Utilities
- `zustand` - State management
- `@react-native-async-storage/async-storage` - Persistence
- `expo-sqlite` - Complex data persistence

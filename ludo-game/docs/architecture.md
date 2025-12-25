# Architecture

Technical architecture documentation for the Ludo mobile game.

## System Overview

The Ludo mobile game follows a **modular, layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│             UI Layer (React Native)          │
│   Screens, Components, Animations, Navigation│
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│         State Layer (Zustand Stores)         │
│  Game State, Settings, Profile, Persistence  │
└────────────┬───────────┬────────────────────┘
             │           │
┌────────────▼───┐   ┌───▼────────────────────┐
│  Engine Layer  │   │   Services Layer       │
│  (Pure Logic)  │   │ (Platform APIs)        │
│  Game Rules    │   │ Audio, Haptics, Storage│
└────────────────┘   └────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│          Utilities & Types                   │
│     Constants, Helpers, Type Definitions     │
└─────────────────────────────────────────────┘
```

## Core Principles

### 1. Engine Modularity

**Constitutional Requirement**: Game logic MUST be framework-agnostic.

```typescript
// ✅ Engine code (src/engine/**)
export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

// ❌ Engine code CANNOT import React Native
import { Vibration } from 'react-native'; // FORBIDDEN
```

**Enforcement**:
- ESLint rules block React Native imports in `src/engine/**`
- 80% test coverage requirement for engine code
- Engine tests run without React Native environment

### 2. Unidirectional Data Flow

```
User Action → State Store Action → Engine Logic → State Update → UI Re-render
```

### 3. Dependency Inversion

Code depends on interfaces (contracts), not concrete implementations:

```typescript
// Define contract
interface IAudioService {
  playSound(id: string): Promise<void>;
}

// UI depends on interface
function DiceButton({ audioService }: { audioService: IAudioService }) {
  const handleRoll = () => audioService.playSound('dice-roll');
}

// Easy to mock for tests
const mockAudio: IAudioService = {
  playSound: jest.fn(),
};
```

## Layer Details

### UI Layer

**Technology**: React Native, Expo SDK 52, React Navigation

**Responsibilities**:
- Render game visuals
- Handle user input
- Animate game actions (React Native Reanimated v3)
- Navigate between screens

**Key Files**:
- `src/ui/screens/` - Full-screen views
- `src/ui/components/` - Reusable components
- `src/navigation/` - React Navigation setup

**Data Flow**:
```typescript
// Component reads from store
const currentPlayer = useGameStore((state) => state.currentPlayer);

// Component calls store action
const rollDice = useGameStore((state) => state.actions.rollDice);

// Store action calls engine logic
actions: {
  rollDice: () => {
    const value = rollDice(); // Engine function
    set({ diceValue: value }); // Update state
  }
}
```

### State Layer

**Technology**: Zustand (1KB state management)

**Responsibilities**:
- Manage global application state
- Coordinate between UI and Engine
- Persist state to AsyncStorage/SQLite
- Provide selector-based subscriptions

**Key Stores**:

1. **Game Store** (`src/state/stores/gameStore.ts`)
   - Current game state (players, tokens, turns)
   - Game actions (roll dice, move token, next turn)

2. **Settings Store** (`src/state/stores/settingsStore.ts`)
   - User preferences (sound, haptics, volume)
   - Persisted to AsyncStorage

3. **Profile Store** (`src/state/stores/profileStore.ts`)
   - Player profile and statistics
   - Persisted to AsyncStorage + SQLite

**State Design**:
```typescript
interface IGameStore {
  // Flat state (no nested objects for performance)
  currentPlayer: PlayerColor;
  phase: GamePhase;
  diceValue: number | null;

  // Actions grouped under 'actions' namespace
  actions: {
    rollDice: () => void;
    moveToken: (tokenId: string) => void;
  };
}
```

### Engine Layer

**Technology**: Pure TypeScript (no framework dependencies)

**Responsibilities**:
- Implement game rules
- Calculate game state transitions
- Validate moves
- AI opponent logic

**Key Modules**:

1. **Dice** (`src/engine/dice/`)
   - Roll dice
   - Validate dice values
   - Check for extra turns

2. **Board** (`src/engine/board/`)
   - Calculate positions
   - Path traversal
   - Board state management

3. **Tokens** (`src/engine/tokens/`)
   - Token movement rules
   - Capture logic
   - Finish conditions

4. **Rules** (`src/engine/rules/`)
   - Turn logic
   - Win conditions
   - Rule validation

5. **AI** (`src/engine/ai/`)
   - Move evaluation
   - Strategy patterns
   - Difficulty levels

**Testing**:
- 80% coverage requirement (branches, functions, lines, statements)
- Property-based tests with `fast-check`
- Pure function testing (no mocks needed)

### Services Layer

**Technology**: Expo modules (audio, haptics, SQLite)

**Responsibilities**:
- Abstract platform-specific APIs
- Provide clean interfaces
- Enable dependency injection for testing

**Key Services**:

1. **Audio Service** (`src/services/audio/`)
   - Play sound effects and music
   - Volume control
   - Preload audio assets

2. **Haptic Service** (`src/services/haptics/`)
   - Trigger vibration feedback
   - Configurable intensity

3. **Storage Services** (`src/services/storage/`)
   - AsyncStorage: Key-value persistence
   - SQLite: Relational data (game history, stats)

**Service Pattern**:
```typescript
// Interface in contracts
export interface IAudioService {
  playSound(id: string): Promise<void>;
}

// Implementation
export class AudioService implements IAudioService {
  async playSound(id: string): Promise<void> {
    // Expo-av implementation
  }
}

// Export singleton
export const audioService = new AudioService();
```

### Utilities & Types

**Constants** (`src/utils/constants.ts`):
- Game configuration (board size, dice range)
- Player colors and positions
- Animation timings

**Colors** (`src/utils/colors.ts`):
- Colorblind-accessible palette
- WCAG AA compliant contrast ratios
- Pattern identifiers for each player

**Type Definitions** (`src/types/`):
- Contracts for stores and services
- Game entity types (Player, Token, Board)
- Navigation types

## Data Flow

### Complete Flow Example: Rolling Dice

1. **User Interaction** (UI Layer)
   ```typescript
   // DiceButton.tsx
   <TouchableOpacity onPress={handleRoll}>
   ```

2. **State Action Called** (State Layer)
   ```typescript
   const rollDice = useGameStore((state) => state.actions.rollDice);
   const handleRoll = () => rollDice();
   ```

3. **Engine Logic Executed** (Engine Layer)
   ```typescript
   // gameStore.ts
   actions: {
     rollDice: () => {
       const value = rollDice(); // Pure engine function
       set({ diceValue: value, phase: 'dice-rolled' });
     }
   }
   ```

4. **State Updated** (State Layer)
   ```typescript
   // Zustand updates state
   set({ diceValue: 5, phase: 'dice-rolled' });
   ```

5. **UI Re-renders** (UI Layer)
   ```typescript
   // Component auto-updates via selector
   const diceValue = useGameStore((state) => state.diceValue);
   ```

6. **Side Effects** (Services Layer)
   ```typescript
   // Play sound
   await audioService.playSound('dice-roll');
   // Trigger haptic
   await hapticService.triggerMedium();
   ```

## Persistence Strategy

### Hybrid Storage

**AsyncStorage** - Key-value pairs:
- User settings (sound, haptics, volume)
- Player profile (name, avatar)
- Simple preferences

**SQLite** - Relational data:
- Game history (date, players, winner, duration)
- Statistics (wins, losses, averages)
- Achievements

**Implementation**:
```typescript
// Zustand persist middleware
export const useSettingsStore = create<ISettingsStore>()(
  persist(
    (set) => ({
      soundEnabled: true,
      // ...
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// SQLite for complex queries
await sqliteService.saveGame({
  date: new Date().toISOString(),
  players: ['Red', 'Blue'],
  winner: 'Red',
  duration: 300000,
});
```

## Testing Strategy

### Test Pyramid

```
     /\
    /E2E\ (Detox - Full app flows)
   /------\
  /  API  \ (Integration - Multi-module)
 /--------\
/ Unit    \ (Jest - Individual functions)
-----------
```

**Unit Tests** (80% of tests):
- Engine logic (80% coverage required)
- Utilities
- Services (with mocks)

**Integration Tests** (15% of tests):
- State stores with engine
- UI components with stores
- Full user flows

**E2E Tests** (5% of tests):
- Critical paths (start game, play turn, win)
- Cross-platform compatibility

### Property-Based Testing

Use `fast-check` to validate game rules:

```typescript
test('dice roll always returns 1-6', () => {
  fc.assert(
    fc.property(fc.integer(), () => {
      const roll = rollDice();
      return roll >= 1 && roll <= 6;
    }),
    { numRuns: 10000 } // Test 10,000 random cases
  );
});
```

## Performance Optimizations

### 1. Selector-Based Subscriptions

```typescript
// ✅ Good - Only re-renders when currentPlayer changes
const currentPlayer = useGameStore((state) => state.currentPlayer);

// ❌ Bad - Re-renders on ANY state change
const store = useGameStore();
```

### 2. Animated Values

Use React Native Reanimated for 60 FPS animations:

```typescript
const translateX = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: translateX.value }],
}));

// Runs on UI thread (not JS thread)
translateX.value = withSpring(newPosition);
```

### 3. Image Optimization

- Preload critical assets
- Use appropriate resolutions
- Compress images

## Security Considerations

### Local Data

- AsyncStorage is **unencrypted** (suitable for preferences)
- SQLite is **unencrypted** (suitable for game history)
- No sensitive data stored locally

### Network

- No external API calls (offline game)
- Future multiplayer: HTTPS only, certificate pinning

## Future Enhancements

### Multiplayer Architecture

```
┌─────────┐         ┌─────────┐
│ Client 1│◄───────►│ Server  │
└─────────┘         └────┬────┘
                         │
┌─────────┐              │
│ Client 2│◄─────────────┘
└─────────┘

- WebSocket connections
- Turn-based protocol
- State synchronization
- Conflict resolution
```

### Analytics (Optional)

- Track gameplay metrics
- Monitor crashes
- A/B testing for AI difficulty

### Cloud Save

- Sync profile across devices
- Backup game history
- Leaderboards

## Build & Deployment

See [deployment.md](./deployment.md) for:

- Build configuration
- Release process
- App store submission
- Update strategy

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [React Navigation Docs](https://reactnavigation.org/)

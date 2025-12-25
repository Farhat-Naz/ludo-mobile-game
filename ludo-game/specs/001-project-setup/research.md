# Research: Project Setup Technology Decisions

**Feature**: 001-project-setup
**Date**: 2025-12-25
**Author**: Farhat Naz
**Status**: Phase 0 Complete

---

## Executive Summary

This document resolves all technical decisions required for the Ludo Mobile Game project setup. Five key areas were researched: state management, local storage, Expo SDK version, testing strategy, and project structure. All decisions prioritize simplicity, performance, and alignment with the constitution's mobile-first principles.

**Key Decisions**:
- **State Management**: Zustand
- **Persistence**: AsyncStorage + expo-sqlite (hybrid approach)
- **Expo SDK**: SDK 52 (stable, latest features)
- **Testing**: Co-located unit tests + Jest + Detox
- **Project Structure**: Single package (not monorepo)

---

## 1. State Management Decision

### Selected: **Zustand**

### Rationale

Zustand is chosen over Redux Toolkit for the following reasons:

1. **Bundle Size**: Zustand is ~1KB gzipped vs Redux Toolkit ~13KB. For a mobile game targeting 50MB APK limit, minimizing dependencies is critical.

2. **Performance**: Zustand uses direct subscriptions without Context API overhead. For Ludo's frequent state updates (dice rolls, token positions, turn changes), this reduces re-renders and maintains 60 FPS targets.

3. **Learning Curve**: Zustand's API is simpler (no actions, reducers, or middleware). New developers can contribute faster, aligning with the 15-minute onboarding goal.

4. **Persistence Integration**: Zustand's middleware pattern integrates cleanly with AsyncStorage:
   ```typescript
   import { persist } from 'zustand/middleware';

   const useGameStore = create(
     persist(
       (set) => ({
         settings: { audio: true, haptics: true },
         // ... game state
       }),
       { name: 'ludo-game-storage' }
     )
   );
   ```

5. **Testing Simplicity**: Zustand stores are plain functions, making unit tests straightforward without mock setup.

### Alternatives Considered

**Redux Toolkit**:
- **Pros**: Industry standard, rich ecosystem, Redux DevTools, strong typing
- **Cons**: Larger bundle, steeper learning curve, boilerplate for simple state (game settings)
- **Why Rejected**: Overkill for Ludo's state management needs. The game state is not complex enough to justify Redux's architecture (no async thunks, no complex middleware). Constitution principle of "smallest viable change" favors Zustand.

**React Context + useReducer**:
- **Pros**: Built-in, no dependencies
- **Cons**: Performance issues with frequent updates, no persistence middleware, verbose
- **Why Rejected**: Context re-renders entire subtree on state change, violating 60 FPS performance requirement. No built-in persistence solution.

### Implementation Notes

- Use Zustand's `persist` middleware for settings and user profile
- Separate stores for concerns:
  - `useSettingsStore`: App settings (audio, haptics)
  - `useGameStore`: Active game state (board, players, turns)
  - `useProfileStore`: User statistics (games played, wins)
- Test stores in isolation with `act()` from React Testing Library

---

## 2. Persistence Strategy Decision

### Selected: **Hybrid (AsyncStorage + expo-sqlite)**

### Rationale

A hybrid approach balances simplicity and performance:

1. **AsyncStorage for Simple Data**:
   - App settings (`audioEnabled`, `hapticsEnabled`)
   - User profile (`playerName`, `statistics`)
   - **Why**: Key-value storage is sufficient; fast read/write; integrates with Zustand persist middleware

2. **expo-sqlite for Complex Data**:
   - Saved game states (board positions, player tokens, turn history)
   - Game history and statistics (optional future feature)
   - **Why**: Relational structure prevents data corruption; supports partial updates (save single token position without loading entire game state); enables queries (fetch last 10 games)

### Data Model Implications

**AsyncStorage Schema** (JSON):
```typescript
// Key: 'app-settings'
{
  audioEnabled: boolean;
  hapticsEnabled: boolean;
}

// Key: 'user-profile'
{
  id: string;
  playerName: string;
  statistics: { gamesPlayed: number; gamesWon: number; gamesLost: number; }
}
```

**SQLite Schema**:
```sql
-- Saved games table
CREATE TABLE saved_games (
  id TEXT PRIMARY KEY,
  mode TEXT NOT NULL,           -- 'single' | 'multi'
  player_count INTEGER NOT NULL, -- 2-4
  board_state TEXT NOT NULL,    -- JSON snapshot
  current_turn INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Game history (optional future)
CREATE TABLE game_history (
  id TEXT PRIMARY KEY,
  winner_id TEXT,
  mode TEXT,
  duration_seconds INTEGER,
  completed_at INTEGER
);
```

### Alternatives Considered

**AsyncStorage Only**:
- **Pros**: Simple, minimal dependencies
- **Cons**: Storing large game states as JSON is inefficient; no query capabilities; risk of data corruption on partial writes
- **Why Rejected**: Game state can be 10KB+ (72 board positions × 4 players × metadata). AsyncStorage reads entire key-value pair, wasting memory.

**expo-sqlite Only**:
- **Pros**: Relational model, query power, ACID guarantees
- **Cons**: Overkill for simple settings; requires schema migrations; slower for key-value access
- **Why Rejected**: Settings and profile data don't need relational structure. SQLite adds complexity for data that AsyncStorage handles well.

**Realm or WatermelonDB**:
- **Pros**: Reactive database, complex query support
- **Cons**: Large dependencies (violates complexity budget), steep learning curve, overkill for Ludo
- **Why Rejected**: Constitution prioritizes simplicity. Ludo doesn't need reactive queries or complex relationships.

### Implementation Notes

- Use `@react-native-async-storage/async-storage` for settings/profile
- Use `expo-sqlite` for game state persistence
- Wrap both in service layer (`SettingsStore.ts`, `GameStateStore.ts`)
- Migration strategy: Use SQLite versioning for schema changes; AsyncStorage keys are immutable

---

## 3. Expo SDK Version Selection

### Selected: **Expo SDK 52**

### Rationale

1. **Stability**: SDK 52 is the latest stable release (as of December 2024), with 6+ months of community testing. No major blockers reported for Android API 26+.

2. **React Native Version**: SDK 52 bundles React Native 0.76, which includes:
   - New Architecture (Fabric + TurboModules) opt-in
   - Performance improvements for Android (faster startup)
   - Updated JSC (JavaScript Core) with better memory management

3. **Feature Support**:
   - `expo-av` (audio): Full support for sound effects
   - `expo-haptics`: Vibration API for feedback
   - `react-native-reanimated` v3: Required for 60 FPS animations
   - `expo-sqlite`: Stable persistence layer

4. **Support Timeline**: SDK 52 has ~18 months of support (through mid-2026), ensuring long-term stability for v1.0 and v2.0 releases.

5. **Android API 26+ Compatibility**: Verified compatibility with minSdkVersion 26 (Android 8.0). No known issues with Google Play Store requirements.

### Alternatives Considered

**Expo SDK 51 (Previous Stable)**:
- **Pros**: More mature, fewer edge-case bugs
- **Cons**: Older React Native (0.74), missing performance improvements
- **Why Rejected**: SDK 52's performance gains (faster cold start, better memory) directly support constitution's performance requirements.

**Expo SDK 53 (Beta)**:
- **Pros**: Cutting-edge features, React Native 0.77
- **Cons**: Beta stability, potential breaking changes, limited community testing
- **Why Rejected**: Violates constitution's "stability over cutting-edge" principle. Beta SDKs risk delays in Play Store submission.

### Implementation Notes

- Pin in `package.json`: `"expo": "^52.0.0"`
- Use Expo's managed workflow (not bare workflow) for faster development
- Configure `app.json`:
  ```json
  {
    "expo": {
      "sdkVersion": "52.0.0",
      "platforms": ["android"],
      "android": {
        "minSdkVersion": 26,
        "targetSdkVersion": 34
      }
    }
  }
  ```
- Monitor Expo changelog for SDK 52.x patches

---

## 4. Testing Strategy for Game Logic

### Selected: **Co-located Unit Tests + Integration Tests + Detox E2E**

### Rationale

1. **Co-located Unit Tests**: Place `__tests__/` directories next to source files (not separate `tests/` tree)
   - **Why**: Reduces cognitive load (tests near implementation); easier to maintain; follows React Native conventions

2. **Mock Strategy for Randomness**:
   - Use Jest's `jest.spyOn()` to mock `Math.random()` in dice roll tests
   - Example:
     ```typescript
     // __tests__/DiceRoller.test.ts
     jest.spyOn(Math, 'random').mockReturnValue(0.99); // Always roll 6
     const result = diceRoller.roll();
     expect(result).toBe(6);
     ```
   - **Why**: Ensures deterministic tests; avoids flaky tests from actual randomness

3. **Snapshot Testing for Game States**:
   - Use Jest snapshots for complex board states (72 positions, 16 tokens)
   - Example:
     ```typescript
     const board = new Board();
     board.placeToken('red', 0, 5);
     expect(board.toJSON()).toMatchSnapshot();
     ```
   - **Why**: Catches unintended state mutations; simplifies assertions for large objects

4. **Property-Based Testing for Rule Validation**:
   - Use `fast-check` library to generate random game scenarios
   - Example:
     ```typescript
     import fc from 'fast-check';

     test('token movement always stays on board', () => {
       fc.assert(
         fc.property(fc.integer(0, 5), fc.integer(1, 6), (position, diceRoll) => {
           const newPos = calculateMove(position, diceRoll);
           return newPos >= 0 && newPos < 72;
         })
       );
     });
     ```
   - **Why**: Tests edge cases (negative positions, overflow) automatically; finds corner cases humans miss

### Test Structure

```text
src/engine/dice/
├── DiceRoller.ts
└── __tests__/
    └── DiceRoller.test.ts

src/engine/rules/
├── MovementRules.ts
└── __tests__/
    ├── MovementRules.test.ts      # Unit tests
    └── MovementRules.property.test.ts  # Property-based tests

tests/integration/
└── full-game.test.ts              # Complete game flow

tests/e2e/
└── game-flow.e2e.ts               # Detox UI tests
```

### Alternatives Considered

**Separate `tests/` Directory**:
- **Pros**: Clear separation of tests and source
- **Cons**: Harder to find related tests; violates React Native conventions
- **Why Rejected**: Co-located tests improve maintainability; constitution prioritizes developer experience.

**Manual Testing Only**:
- **Pros**: No test setup overhead
- **Cons**: Violates constitution's "Test-First Game Logic" principle; regression risk
- **Why Rejected**: Ludo has 20+ edge cases (cuts, safe zones, exact finish). Manual testing is insufficient.

### Implementation Notes

- Configure Jest for React Native: Use `jest-expo` preset
- Install dependencies:
  ```bash
  npm install --save-dev jest @testing-library/react-native @testing-library/jest-native fast-check detox
  ```
- Run tests: `npm test` (unit), `npm run test:e2e` (Detox)
- Coverage target: 80% for `src/engine/`

---

## 5. Project Structure Decision

### Selected: **Single Package (Not Monorepo)**

### Rationale

1. **Complexity Budget**: Constitution prioritizes "smallest viable change." Monorepo tools (Nx, Turborepo, Lerna) add:
   - Build configuration complexity
   - Package versioning overhead
   - Inter-package dependency management
   - Longer onboarding time (violates 15-minute goal)

2. **Modular Architecture via Directories**: Separation of concerns achieved through folder structure:
   - `src/engine/`: Framework-agnostic game logic (can be extracted to npm package later if needed)
   - `src/ui/`: React Native components
   - Clear boundaries enforced by linter rules (no UI imports in `engine/`)

3. **Developer Experience**: Single `package.json`, single `tsconfig.json`, single build command. New developers run `npm install && npx expo start` and are productive immediately.

4. **Future Flexibility**: If web/desktop versions are needed (v2.0+), `src/engine/` can be extracted to a separate package WITHOUT rewriting. The modular directory structure makes this a simple refactor.

### Directory Layout

```text
ludo-game/                     # Single package root
├── src/
│   ├── engine/                # Game logic (no React Native imports)
│   ├── ui/                    # React Native components
│   ├── state/                 # Zustand stores
│   ├── services/              # Platform services (audio, haptics, storage)
│   ├── utils/                 # Shared utilities
│   └── types/                 # TypeScript types
├── tests/
│   ├── integration/
│   └── e2e/
├── package.json               # Single dependency manifest
└── tsconfig.json              # Single TypeScript config
```

### Alternatives Considered

**Monorepo (Nx or Turborepo)**:
- **Pros**: Enforced package boundaries, shared tooling, incremental builds
- **Cons**: Setup complexity (3+ config files), build caching overhead, overkill for single app
- **Why Rejected**: Constitution states "Avoid over-engineering." Ludo is a single mobile game, not a multi-team platform. Monorepo benefits don't justify costs.

**Separate `ludo-engine` npm Package**:
- **Pros**: Truly framework-agnostic, can publish to npm
- **Cons**: Versioning overhead, local package linking during development, slower iteration
- **Why Rejected**: YAGNI (You Aren't Gonna Need It). Web/desktop ports are speculative. Extract package only when second platform is confirmed.

### Enforcement Strategy

**ESLint Rule** (prevent UI imports in engine):
```javascript
// .eslintrc.js
{
  "overrides": [
    {
      "files": ["src/engine/**/*.ts"],
      "rules": {
        "no-restricted-imports": [
          "error",
          {
            "patterns": ["**/ui/**", "react-native", "@react-navigation/*"]
          }
        ]
      }
    }
  ]
}
```

**TypeScript Path Aliases** (enforce module boundaries):
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@engine/*": ["src/engine/*"],
      "@ui/*": ["src/ui/*"],
      "@services/*": ["src/services/*"]
    }
  }
}
```

---

## Technology Decision Summary Table

| Decision Area | Selected Option | Key Rationale | Constitution Alignment |
|---------------|-----------------|---------------|------------------------|
| **State Management** | Zustand | 1KB bundle, 60 FPS performance, simple API | Principle V (Performance), Complexity Budget |
| **Persistence** | AsyncStorage + expo-sqlite (hybrid) | Right tool for each data type (key-value vs relational) | Principle VI (Test-First), Complexity Budget |
| **Expo SDK** | SDK 52 (stable) | Latest stable, RN 0.76, 18-month support | Principle V (Performance), Mobile-First |
| **Testing** | Co-located + Jest + fast-check + Detox | Deterministic tests, property-based testing, E2E coverage | Principle VI (Test-First) |
| **Project Structure** | Single package | Simplicity, fast onboarding, modular via directories | Complexity Budget, Developer Experience |

---

## Implementation Checklist

Before proceeding to Phase 1 (data-model.md, contracts/, quickstart.md):

- [x] All research decisions documented with rationale
- [x] Alternatives considered and rejection reasons clear
- [x] Technology choices align with constitution principles
- [x] Bundle size impact evaluated (Zustand <2KB, AsyncStorage <10KB, expo-sqlite <50KB)
- [x] Performance implications assessed (60 FPS achievable with Zustand + Reanimated)
- [x] Learning curve evaluated (Zustand + AsyncStorage = 1 day learning time)
- [x] Testing strategy supports 80% coverage target

---

## Open Questions / Future Research

**For v1.0** (No blockers):
- None. All required decisions resolved.

**For v2.0** (Future enhancements):
1. **Online Multiplayer**: WebSockets vs Firebase Realtime Database
2. **Analytics**: Mixpanel vs Amplitude vs Firebase Analytics
3. **Crash Reporting**: Sentry vs Bugsnag vs Firebase Crashlytics
4. **A/B Testing**: Firebase Remote Config vs custom solution

---

**Phase 0 Status**: ✅ **COMPLETE**
**Next Step**: Proceed to Phase 1 (data-model.md, contracts/, quickstart.md)
**Approved By**: Farhat Naz
**Date**: 2025-12-25

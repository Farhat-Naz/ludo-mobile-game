# Implementation Plan: Project Setup and Development Environment

**Branch**: `001-project-setup` | **Date**: 2025-12-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-project-setup/spec.md`

## Summary

Establish a production-ready React Native (Expo) development environment for a mobile Ludo game targeting Google Play Store release. The setup will support TypeScript, include essential development tools, and provide comprehensive onboarding documentation to ensure any developer can begin contributing within 15 minutes.

## Technical Context

**Language/Version**: TypeScript 5.x with React Native (Expo SDK 52+)
**Primary Dependencies**:
- Expo (development framework)
- React Navigation (screen navigation)
- React Native Reanimated (60 FPS animations)
- Zustand or Redux Toolkit (state management - TBD in research)
- expo-av (audio)
- AsyncStorage or expo-sqlite (persistence - TBD in research)

**Storage**: Local storage via AsyncStorage (game state, preferences) and optional SQLite for structured data
**Testing**: Jest + React Native Testing Library + Detox (E2E)
**Target Platform**: Android 8.0+ (API 26+), iOS 13+ (future)
**Project Type**: Mobile application (React Native/Expo)
**Performance Goals**: 60 FPS animations, <3s cold start, <100ms touch response
**Constraints**:
- Must run on mid-range Android devices (2020+)
- Maximum APK/AAB size: 50MB (initial download)
- Offline-first architecture (no backend in v1.0)

**Scale/Scope**:
- Single mobile game application
- ~15-20 screens (menu, game modes, settings, game board)
- Support 1-4 players per game session
- Target 50k+ lines of code at completion

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principles Alignment

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Mobile-First Development** | ✅ PASS | React Native (Expo) targets mobile as primary platform; all features designed for touch interactions |
| **II. Game Engine Modularity** | ✅ PASS | Project structure separates `src/engine/` (logic) from `src/ui/` (presentation) |
| **III. Progressive AI Complexity** | ✅ PASS | AI implementation deferred to Feature 002; setup supports modular architecture |
| **IV. Multi-Mode Flexibility** | ✅ PASS | State management and navigation structure support 1-4 player modes |
| **V. Performance & UX Standards** | ✅ PASS | React Native Reanimated selected for 60 FPS; expo-haptics and expo-av included |
| **VI. Test-First Game Logic** | ✅ PASS | Jest, React Native Testing Library, and Detox configured for unit/integration/E2E tests |

### Technology Stack Compliance

| Stack Component | Constitution Requirement | Selected Technology | Status |
|-----------------|-------------------------|---------------------|--------|
| Frontend | React Native (Expo) OR Flutter | **React Native (Expo)** | ✅ PASS |
| Language | TypeScript OR Dart | **TypeScript** | ✅ PASS |
| State Management | Redux Toolkit OR Zustand | **TBD in Phase 0** | ⏳ RESEARCH |
| Animations | React Native Reanimated | **React Native Reanimated** | ✅ PASS |
| Audio | expo-av | **expo-av** | ✅ PASS |
| Local Storage | AsyncStorage OR expo-sqlite | **TBD in Phase 0** | ⏳ RESEARCH |

### Quality Gates

All quality gates from constitution Section "Development Workflow → Quality Gates" are satisfied by tooling:
- ✅ Unit tests: Jest configured
- ✅ Integration tests: Jest + React Native Testing Library
- ✅ Multi-device testing: Expo Go app + Android emulator
- ✅ Performance profiling: React DevTools + Flipper configured
- ✅ Code review: GitHub PR template created
- ✅ Documentation: README.md and docs/ structure planned

**Gate Result**: ✅ **PASS** - Proceed to Phase 0 research

---

## Phase 0: Research & Technology Decisions

### Research Tasks

The following items require investigation before proceeding to implementation planning:

#### 1. State Management Selection (Zustand vs Redux Toolkit)
**Question**: Which state management library best fits Ludo game requirements?

**Research Criteria**:
- Bundle size impact (constitution: minimize dependencies)
- Performance with frequent updates (dice rolls, token movements)
- Developer experience and learning curve
- Persistence integration (AsyncStorage/SQLite)
- Testing simplicity

**Decision Required**: Select Zustand OR Redux Toolkit and document rationale in `research.md`

#### 2. Local Storage Strategy (AsyncStorage vs expo-sqlite)
**Question**: Should game state persistence use key-value storage or relational database?

**Research Criteria**:
- Game state structure (complex nested objects vs normalized data)
- Query requirements (fetch all state vs partial updates)
- Performance for save/load operations
- Migration complexity for future schema changes
- Bundle size impact

**Decision Required**: Select AsyncStorage OR expo-sqlite (or hybrid approach) and document in `research.md`

#### 3. Expo SDK Version Selection
**Question**: Which Expo SDK version balances stability and feature support?

**Research Criteria**:
- Stability (recent release vs LTS)
- React Native version bundled
- Known issues with Android API 26+ compatibility
- Support timeline and update frequency

**Decision Required**: Pin specific Expo SDK version in `research.md`

#### 4. Testing Strategy for Game Logic
**Question**: How should game engine unit tests be structured for maximum maintainability?

**Research Criteria**:
- Test file organization (co-located vs separate directory)
- Mock strategy for randomness (dice rolls)
- Snapshot testing for game states
- Property-based testing for rule validation

**Decision Required**: Document testing patterns and examples in `research.md`

#### 5. Monorepo vs Single Package
**Question**: Should the project use a monorepo structure or single package?

**Research Criteria**:
- Game engine as separate package (enables future web/desktop)
- Shared types/constants package
- Complexity budget from constitution (avoid over-engineering)
- Developer onboarding time impact

**Decision Required**: Document project structure decision in `research.md`

### Research Deliverables

**Output File**: `specs/001-project-setup/research.md`

**Required Sections**:
1. **State Management Decision**
   - Selected: [Zustand | Redux Toolkit]
   - Rationale: [3-5 sentences]
   - Alternatives Considered: [brief comparison]

2. **Persistence Strategy Decision**
   - Selected: [AsyncStorage | expo-sqlite | Hybrid]
   - Rationale: [3-5 sentences]
   - Data model implications

3. **Expo SDK Version**
   - Selected: `expo@[X.Y.Z]`
   - Rationale: [stability vs features]

4. **Testing Patterns**
   - Unit test structure
   - Mock strategy for randomness
   - Example test cases

5. **Project Structure**
   - Selected: [Monorepo | Single Package]
   - Directory layout
   - Package organization rationale

---

## Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete with all decisions documented

### 1. Data Model Design

**Output File**: `specs/001-project-setup/data-model.md`

**Entities to Define**:

Since this is a project setup feature (not the game engine itself), the data model focuses on **configuration and state persistence structures**:

#### Configuration Entities
- **AppSettings**: User preferences (audio on/off, haptics, theme)
- **GamePreferences**: Default player count, AI difficulty
- **UserProfile**: Player name, statistics (games played, wins)

#### Persistence Schema
- **SavedGameState** (for future save/resume functionality)
  - Game mode
  - Player configurations
  - Board state snapshot
  - Current turn information

**Data Model Structure**:
```typescript
// Outline for data-model.md
interface AppSettings {
  audioEnabled: boolean;
  hapticsEnabled: boolean;
  theme: 'light' | 'dark'; // Future enhancement
}

interface UserProfile {
  id: string;
  playerName: string;
  statistics: {
    gamesPlayed: number;
    gamesWon: number;
    gameLost: number;
  };
}

// Additional entities based on persistence decision from Phase 0
```

### 2. API Contracts

**Output Directory**: `specs/001-project-setup/contracts/`

For this setup feature, "contracts" refers to **internal module interfaces** (not REST APIs):

#### File System Contract
- **config.contract.ts**: Settings persistence interface
  ```typescript
  interface ISettingsStore {
    loadSettings(): Promise<AppSettings>;
    saveSettings(settings: AppSettings): Promise<void>;
  }
  ```

#### Navigation Contract
- **navigation.contract.ts**: Screen routing types
  ```typescript
  type RootStackParamList = {
    Home: undefined;
    GameModeSelection: undefined;
    GameBoard: { mode: 'single' | 'multi'; playerCount: 2 | 3 | 4 };
    Settings: undefined;
  };
  ```

#### State Management Contract
- **store.contract.ts**: Global state shape (based on Phase 0 decision)

**Deliverables**:
- `contracts/settings-store.contract.ts`
- `contracts/navigation.contract.ts`
- `contracts/state-store.contract.ts`

### 3. Developer Quickstart Guide

**Output File**: `specs/001-project-setup/quickstart.md`

**Required Sections**:

1. **Prerequisites**
   - Node.js version requirement
   - Package manager (npm/yarn/pnpm)
   - Expo CLI installation
   - Android Studio setup (for emulator)

2. **Installation Steps**
   ```bash
   # Clone repository
   git clone <repo-url>
   cd ludo-game

   # Install dependencies
   npm install

   # Start development server
   npx expo start
   ```

3. **Development Workflow**
   - Running on emulator vs physical device
   - Hot reload usage
   - Debugging with React DevTools
   - Running tests: `npm test`

4. **Project Structure Tour**
   - `src/engine/`: Game logic (framework-agnostic)
   - `src/ui/`: React Native components
   - `src/state/`: State management
   - `src/services/`: Audio, haptics, storage
   - `tests/`: Unit, integration, E2E tests

5. **Common Tasks**
   - Adding a new screen
   - Creating a new component
   - Writing unit tests
   - Debugging performance issues

6. **Troubleshooting**
   - Common Expo errors
   - Android emulator issues
   - Cache clearing commands

**Target**: Developer can run app on device within 15 minutes of cloning repo

### 4. Agent Context Update

**Prerequisite**: All Phase 1 artifacts (data-model.md, contracts/, quickstart.md) completed

**Action**: Run agent context update script to register new technologies and patterns

```powershell
.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude
```

**What This Does**:
- Reads current plan.md and research.md
- Extracts technology decisions (state management, persistence, SDK version)
- Updates `.claude/agent-context.md` (or equivalent) with:
  - React Native (Expo) patterns
  - Selected state management library
  - Testing strategy
  - Project structure conventions

**Expected Updates to Agent Context**:
- Technology stack: React Native (Expo SDK X.Y), TypeScript 5.x
- State management: [Zustand | Redux Toolkit]
- Persistence: [AsyncStorage | expo-sqlite]
- Testing: Jest + React Native Testing Library + Detox
- Architecture: Modular game engine (src/engine/) separated from UI (src/ui/)

---

## Project Structure

### Documentation (this feature)

```text
specs/001-project-setup/
├── spec.md                  # Feature specification (user input)
├── plan.md                  # This file
├── research.md              # Phase 0 output (technology decisions)
├── data-model.md            # Phase 1 output (configuration entities)
├── quickstart.md            # Phase 1 output (developer onboarding)
├── contracts/               # Phase 1 output (TypeScript interfaces)
│   ├── settings-store.contract.ts
│   ├── navigation.contract.ts
│   └── state-store.contract.ts
├── checklists/              # Validation checklists
│   └── requirements.md      # (already exists)
└── tasks.md                 # Phase 2 output (NOT created by /sp.plan)
```

### Source Code (repository root)

**Structure Decision**: Single project with modular architecture (not monorepo)

**Rationale**:
- Constitution prioritizes simplicity and small changes
- Game engine modularity achieved via directory structure, not package boundaries
- Avoids monorepo tooling complexity (Nx, Turborepo, Lerna)
- Easier developer onboarding (15-minute target)
- Future platform expansion (web/desktop) can extract engine later if needed

```text
ludo-game/
├── src/
│   ├── engine/              # Core game logic (framework-agnostic)
│   │   ├── dice/
│   │   │   ├── DiceRoller.ts
│   │   │   └── __tests__/
│   │   ├── board/
│   │   │   ├── Board.ts
│   │   │   ├── Position.ts
│   │   │   └── __tests__/
│   │   ├── tokens/
│   │   │   ├── Token.ts
│   │   │   ├── TokenManager.ts
│   │   │   └── __tests__/
│   │   ├── rules/
│   │   │   ├── MovementRules.ts
│   │   │   ├── WinCondition.ts
│   │   │   └── __tests__/
│   │   ├── ai/              # Future: AI player logic
│   │   │   └── __tests__/
│   │   └── GameEngine.ts    # Main game orchestrator
│   │
│   ├── ui/                  # React Native components
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── GameModeSelectionScreen.tsx
│   │   │   ├── GameBoardScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── components/
│   │   │   ├── Board/
│   │   │   │   ├── Board.tsx
│   │   │   │   ├── Cell.tsx
│   │   │   │   └── SafeZone.tsx
│   │   │   ├── Dice/
│   │   │   │   └── Dice.tsx
│   │   │   ├── Token/
│   │   │   │   └── Token.tsx
│   │   │   └── PlayerIndicator/
│   │   │       └── PlayerIndicator.tsx
│   │   └── animations/
│   │       ├── diceRoll.ts
│   │       └── tokenMovement.ts
│   │
│   ├── state/               # State management (Zustand or Redux Toolkit)
│   │   ├── store.ts         # Store configuration
│   │   ├── slices/          # (if Redux Toolkit)
│   │   └── hooks/           # Custom state hooks
│   │
│   ├── services/            # Platform services
│   │   ├── audio/
│   │   │   └── AudioService.ts
│   │   ├── haptics/
│   │   │   └── HapticsService.ts
│   │   ├── storage/
│   │   │   ├── SettingsStore.ts
│   │   │   └── GameStateStore.ts
│   │   └── navigation/
│   │       └── NavigationService.ts
│   │
│   ├── utils/               # Shared utilities
│   │   ├── colors.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   └── types/               # TypeScript type definitions
│       ├── contracts/       # Contract interfaces (from Phase 1)
│       ├── game.types.ts
│       └── ui.types.ts
│
├── tests/
│   ├── unit/                # Unit tests (co-located with source in __tests__)
│   ├── integration/         # Full game scenario tests
│   │   └── full-game.test.ts
│   └── e2e/                 # End-to-end Detox tests
│       └── game-flow.e2e.ts
│
├── assets/
│   ├── audio/               # Sound effects
│   │   ├── dice-roll.mp3
│   │   ├── token-move.mp3
│   │   └── cut.mp3
│   ├── images/              # Sprites, board graphics
│   └── animations/          # Lottie files (optional)
│
├── docs/
│   ├── rules.md             # Ludo rules documentation
│   ├── architecture.md      # Technical architecture overview
│   └── deployment.md        # Play Store deployment guide
│
├── .expo/                   # Expo generated files
├── .github/
│   └── pull_request_template.md
│
├── app.json                 # Expo configuration
├── package.json
├── tsconfig.json
├── jest.config.js
├── .eslintrc.js
├── .prettierrc.js
└── README.md
```

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: ✅ No violations detected

All technology choices and architectural decisions align with constitution principles:
- Mobile-first: React Native (Expo) selected
- Modular engine: `src/engine/` separated from `src/ui/`
- Progressive AI: Architecture supports future AI module
- Multi-mode: State management supports 1-4 players
- Performance: React Native Reanimated for 60 FPS
- Test-first: Jest + Testing Library + Detox configured

---

## Risk Analysis & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Expo SDK breaking changes** | Medium | High | Pin specific SDK version; test upgrades in separate branch |
| **Android device fragmentation** | High | Medium | Test on 3+ devices (low/mid/high-end); use Expo compatibility matrix |
| **State management complexity** | Low | Medium | Phase 0 research includes performance benchmarks; choose simpler option if uncertain |
| **Learning curve for new developers** | Medium | Medium | Comprehensive quickstart.md; video walkthrough; pair programming sessions |
| **Performance on low-end devices** | Medium | High | Early performance profiling; optimize animations; lazy load screens |

---

## Post-Phase 1 Constitution Re-Check

**Status**: ✅ **COMPLETE** (2025-12-25)

**Checklist**:
- [x] All research decisions documented in `research.md`
  - ✅ State management: Zustand selected (rationale documented)
  - ✅ Persistence: AsyncStorage + expo-sqlite hybrid (rationale documented)
  - ✅ Expo SDK: Version 52 selected (rationale documented)
  - ✅ Testing: Co-located + Jest + fast-check + Detox (patterns documented)
  - ✅ Project structure: Single package (rationale documented)

- [x] Data model aligns with constitution's persistence requirements
  - ✅ AppSettings: Simple key-value (AsyncStorage) ✓
  - ✅ UserProfile: Simple key-value (AsyncStorage) ✓
  - ✅ SavedGame: Complex relational (SQLite) ✓
  - ✅ All entities include `version` field for migrations ✓
  - ✅ Zod schemas planned for runtime validation ✓

- [x] Contracts enforce modular game engine architecture
  - ✅ `settings-store.contract.ts`: Settings persistence interface ✓
  - ✅ `profile-store.contract.ts`: Profile persistence interface ✓
  - ✅ `navigation.contract.ts`: Type-safe screen routing ✓
  - ✅ `state-store.contract.ts`: Zustand store interfaces ✓
  - ✅ All contracts use TypeScript interfaces (not classes) ✓
  - ✅ No UI dependencies in contracts ✓

- [x] Quickstart guide achieves <15 minute onboarding target
  - ✅ Prerequisites section: 10 minutes (Node, Git, Expo CLI)
  - ✅ Installation section: 3 minutes (clone + npm install)
  - ✅ First run section: 2 minutes (npx expo start + device)
  - ✅ Project structure tour: Visual directory tree ✓
  - ✅ Common tasks: Examples for screens, components, tests ✓
  - ✅ Troubleshooting: 5 common issues with fixes ✓

- [x] Agent context updated with technology decisions
  - ⚠️ Script requires template (`agent-file-template.md`) not present in repository
  - ✅ All technology decisions documented in `research.md` (serves as agent context)
  - ✅ Future task: Create agent context update when template is available

- [x] No new dependencies violate complexity budget
  - ✅ Zustand: <2KB (approved)
  - ✅ AsyncStorage: <10KB (approved)
  - ✅ expo-sqlite: <50KB (approved)
  - ✅ Zod: ~8KB (approved for validation)
  - ✅ fast-check: Dev dependency only (no production impact)
  - ✅ Total production bundle impact: <70KB
  - ✅ No unnecessary dependencies added

### Constitution Compliance Summary

| Principle | Pre-Design | Post-Design | Notes |
|-----------|------------|-------------|-------|
| **I. Mobile-First** | ✅ PASS | ✅ PASS | React Native (Expo) confirmed; all contracts designed for mobile |
| **II. Engine Modularity** | ✅ PASS | ✅ PASS | Contracts enforce separation (no UI in engine); path aliases configured |
| **III. Progressive AI** | ✅ PASS | ✅ PASS | Game store placeholder ready for AI integration (Feature 002) |
| **IV. Multi-Mode** | ✅ PASS | ✅ PASS | Navigation supports 1-4 players; GameStore includes mode/playerCount |
| **V. Performance** | ✅ PASS | ✅ PASS | Zustand selected for 60 FPS; React Native Reanimated in stack |
| **VI. Test-First** | ✅ PASS | ✅ PASS | Testing patterns documented; co-located tests; fast-check for properties |

**Final Gate Result**: ✅ **PASS** - All constitution principles satisfied

### Violations & Justifications

**None**. All design decisions align with constitution principles and complexity budget.

---

## Next Steps

After `/sp.plan` completes:

1. **Phase 0**: Generate `research.md` with all technology decisions
2. **Phase 1**: Generate `data-model.md`, `contracts/`, and `quickstart.md`
3. **Agent Update**: Run `update-agent-context.ps1` to register technologies
4. **Phase 2**: Run `/sp.tasks` to generate actionable task list (`tasks.md`)
5. **Implementation**: Begin executing tasks from `tasks.md`

**Command Completion**: `/sp.plan` ends after Phase 1. User runs `/sp.tasks` separately.

---

**Branch**: `001-project-setup`
**Feature**: Project Setup and Development Environment
**Maintained by**: Farhat Naz
**Last Updated**: 2025-12-25

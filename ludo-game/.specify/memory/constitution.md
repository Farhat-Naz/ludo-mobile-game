\# Ludo Game Constitution

<!--
  Sync Impact Report:
  Version: 1.0.0 (Initial ratification)
  Created: 2025-12-25

  Principles Established:
  - Mobile-First Development
  - Game Engine Modularity
  - Progressive AI Complexity
  - Multi-Mode Flexibility
  - Performance & UX Standards
  - Test-First Game Logic

  Templates Status:
  ✅ plan-template.md - reviewed, no changes needed (generic template)
  ✅ spec-template.md - reviewed, no changes needed (generic template)
  ✅ tasks-template.md - reviewed, no changes needed (generic template)

  Follow-up TODOs:
  - Create initial README.md with game description and setup instructions
  - Add screenshot/mockup assets once UI development begins
  - Document Play Store deployment process in docs/
-->

## Core Principles

### I. Mobile-First Development

All features MUST be designed and implemented for mobile devices as the primary platform.

- Target: **Google Play Store** release as primary deployment goal
- UI components MUST be touch-optimized with appropriate hit areas (minimum 44x44 density-independent pixels)
- All layouts MUST be responsive and tested on small screens (320px width minimum)
- Device capabilities (haptics, orientation, notifications) MUST be leveraged where appropriate
- Desktop/web versions are OUT OF SCOPE unless explicitly specified

**Rationale**: Mobile-first ensures the core experience is optimized for the target platform and prevents desktop-centric design decisions that don't translate to mobile.

### II. Game Engine Modularity

Game logic MUST be separated from UI/presentation layer as independent, testable modules.

Core engine components:
- **Dice Logic**: Roll mechanics, validation, extra turn rules (6 grants extra turn)
- **Turn Management**: Player rotation, turn state, game flow control
- **Token Rules**: Movement validation, opening rules (requires 6), safe zones, cutting mechanics, exact finish requirements
- **Board State**: Position tracking, collision detection, win conditions

Each component MUST:
- Be independently testable with unit tests
- Expose clear, documented interfaces
- Handle edge cases explicitly
- Maintain no direct UI dependencies

**Rationale**: Modular game engine enables thorough testing, easier AI integration, and potential future platform expansion (web, desktop) without rewriting core logic.

### III. Progressive AI Complexity

AI player implementation MUST follow a phased approach from simple to sophisticated.

**Phase 1 (MANDATORY)**: Rule-based AI with priority system:
1. If token can cut opponent → move it
2. If token can enter safe zone → move it
3. If dice = 6 and unopened token exists → open new piece
4. Otherwise → move furthest token

**Phase 2 (FUTURE)**: Probability-based decision making
- Evaluate risk/reward of moves
- Consider opponent positions and likely next moves
- Strategic blocking and defensive positioning

**Phase 3 (FUTURE)**: Advanced strategies (mini-max, machine learning)

**Rationale**: Progressive complexity ensures a playable game quickly (Phase 1) while leaving room for enhancement. Simple AI is easier to test and debug.

### IV. Multi-Mode Flexibility

The game MUST support multiple play modes with graceful degradation.

**Required Modes**:
- 🤖 **Single Player**: User vs System (AI)
- 👥 **2 Players**: Local (same device)
- 👥👥 **3 Players**: Local (same device)
- 👥👥👥 **4 Players**: Local (same device)

**Future Modes** (OUT OF SCOPE for v1.0):
- Online Multiplayer (2-4 players)
- Tournament modes
- Custom rule variations

**Implementation Requirements**:
- Game engine MUST be agnostic to player type (human/AI)
- Mode selection MUST occur before game start
- Each mode MUST be independently testable
- Local multiplayer MUST clearly indicate active player turn

**Rationale**: Starting with local modes delivers immediate value while keeping architecture flexible for future online features.

### V. Performance & UX Standards (NON-NEGOTIABLE)

All game interactions MUST meet strict performance and user experience standards.

**Performance Requirements**:
- Animations MUST run at **60 FPS** (frame budget: 16.67ms)
- Touch response MUST feel instant (<100ms from tap to visual feedback)
- Dice roll animation MUST complete in 0.8-1.2 seconds
- Token movement animation MUST complete at 200ms per board position
- App cold start MUST complete in <3 seconds on mid-range devices (2020+)

**UX Requirements**:
- Haptic feedback MUST trigger on: dice roll, token selection, cut event, win event
- Sound effects MUST be included for: dice roll, token move, cut, safe zone entry, win
- Audio MUST be toggleable via settings (persist preference)
- Color-coded player tokens (Red, Blue, Green, Yellow) MUST be distinguishable by colorblind users (use patterns/shapes as secondary indicators)
- Game state MUST be savable and resumable (local persistence)

**Accessibility**:
- All interactive elements MUST meet WCAG 2.1 AA contrast ratios (4.5:1 for text)
- Screen reader support MUST announce current player, dice result, and available moves
- Alternative to sound-only feedback MUST be provided (visual indicators)

**Rationale**: Performance and UX standards ensure the game feels polished and professional, increasing user retention and positive reviews.

### VI. Test-First Game Logic

All game rules and logic MUST be test-driven with comprehensive test coverage.

**Testing Requirements**:
- **Unit Tests**: All game engine components (dice, movement, rules)
  - Dice roll validation
  - Token opening rules (requires 6)
  - Safe zone mechanics
  - Cutting logic
  - Exact finish requirements
  - Extra turn on rolling 6

- **Integration Tests**: Full game scenarios
  - Complete game flow (start → win)
  - Multi-player turn management
  - AI decision making
  - Edge cases (all tokens cut, blocked positions, exact finish scenarios)

- **Manual Test Scenarios**: UI/UX validation
  - Touch interactions
  - Animation smoothness
  - Audio/haptic feedback
  - Screen transitions

**Test Coverage Target**: Minimum 80% code coverage for game engine modules

**Process**: Write tests FIRST → Ensure tests FAIL → Implement feature → Tests PASS

**Rationale**: Ludo has complex rules with many edge cases. Test-first development ensures rules are correctly implemented and regressions are caught early.

## Technology Stack

**Frontend (Game UI)**:
- **React Native (Expo)** OR **Flutter**
- Decision: React Native if team knows JavaScript/TypeScript; Flutter for maximum performance and native feel
- MUST support iOS 13+ and Android 8.0+ (API level 26+)

**Game Logic**:
- TypeScript (React Native) OR Dart (Flutter)
- MUST be framework-agnostic (no direct UI dependencies in core engine)

**State Management**:
- React Native: Redux Toolkit OR Zustand
- Flutter: Riverpod OR Bloc pattern
- MUST support game state persistence to local storage

**Animations**:
- React Native: React Native Reanimated
- Flutter: Built-in Animation APIs
- MUST achieve 60 FPS performance target

**Audio**:
- React Native: expo-av
- Flutter: audioplayers package
- MUST support background audio settings (on/off toggle)

**Local Storage**:
- React Native: AsyncStorage OR expo-sqlite
- Flutter: shared_preferences + sqflite
- MUST persist: game state, user preferences, statistics

**Backend** (FUTURE - Out of scope for v1.0):
- Firebase (Authentication, Realtime Database, Cloud Functions)
- OR Supabase (PostgreSQL, Realtime, Authentication)
- OR Node.js + WebSockets

## Development Workflow

### Project Structure

```
ludo-game/
├── src/
│   ├── engine/           # Core game logic (framework-agnostic)
│   │   ├── dice/
│   │   ├── board/
│   │   ├── tokens/
│   │   ├── rules/
│   │   └── ai/
│   ├── ui/               # UI components
│   │   ├── screens/
│   │   ├── components/
│   │   └── animations/
│   ├── state/            # State management
│   ├── services/         # Audio, haptics, storage
│   └── utils/
├── tests/
│   ├── unit/             # Engine unit tests
│   ├── integration/      # Full game scenario tests
│   └── e2e/              # UI/UX tests
├── assets/
│   ├── audio/
│   ├── images/
│   └── animations/
└── docs/
    ├── rules.md          # Ludo rules documentation
    ├── architecture.md   # Technical architecture
    └── deployment.md     # Play Store deployment guide
```

### Feature Development Flow

1. **Spec**: Document feature in `specs/<feature>/spec.md`
2. **Plan**: Create architecture in `specs/<feature>/plan.md`
3. **Tasks**: Generate task list in `specs/<feature>/tasks.md`
4. **Tests**: Write failing tests FIRST
5. **Implement**: Build feature to pass tests
6. **Review**: Code review + manual UX testing
7. **Document**: Update README, add screenshots if UI change
8. **Commit**: Small, logical commits with clear messages

### Quality Gates

Before merging any feature:
- ✅ All unit tests pass
- ✅ Integration tests pass for affected game modes
- ✅ Manual testing on at least 2 devices (different screen sizes)
- ✅ Performance profiling shows 60 FPS maintained
- ✅ No console errors or warnings
- ✅ Code review approved by at least 1 reviewer
- ✅ Documentation updated if public API changed

## Constraints & Non-Goals

### In Scope
- Mobile-only UI (iOS + Android)
- Local multiplayer (same device, 2-4 players)
- Single-player vs AI
- Core Ludo rules (standard variant)
- Game state persistence (save/resume)
- Sound effects and haptic feedback
- Basic statistics (games played, wins)

### Out of Scope (v1.0)
- Online multiplayer (deferred to v2.0)
- Custom rule variations
- In-app purchases or monetization
- Social features (friends, chat, leaderboards)
- Desktop or web versions
- Accessibility features beyond WCAG AA compliance
- Multiple language support (English only for v1.0)
- Tournament or ranking systems

### Explicit Non-Goals
- Real-time online multiplayer in v1.0 (complex, requires backend)
- 3D graphics or advanced visual effects (scope creep)
- Integration with social media platforms
- Analytics beyond basic crash reporting

## Governance

### Constitution Authority
- This constitution supersedes all other development practices and documentation
- All feature specifications, plans, and tasks MUST comply with these principles
- Any violation of NON-NEGOTIABLE principles requires explicit justification and approval

### Amendments
- Amendments require:
  1. Documented rationale (why change is needed)
  2. Impact analysis (what breaks, what needs migration)
  3. Approval from project lead
  4. Version bump following semantic versioning
- Major changes (removing/redefining principles) → MAJOR version bump
- New principles or expanded guidance → MINOR version bump
- Clarifications, typo fixes, non-semantic changes → PATCH version bump

### Version Control
- Use semantic versioning: MAJOR.MINOR.PATCH
- Tag constitution versions in git: `constitution-v1.0.0`
- Maintain changelog of constitution changes in this file

### Compliance Review
- All PRs MUST be reviewed against constitution principles
- Feature specs MUST include "Constitution Check" section referencing relevant principles
- Implementation plans MUST justify any complexity that appears to violate simplicity principles
- Code reviews MUST verify test-first approach was followed

### Complexity Budget
Projects MUST remain simple and focused. Justify any:
- New third-party dependencies (evaluate bundle size impact)
- Architectural patterns beyond standard MVC/MVVM
- Performance optimizations that reduce code clarity
- Feature additions beyond core Ludo gameplay

Use `specs/<feature>/plan.md` Complexity Tracking section to document justifications.

**Runtime Development Guidance**: See `CLAUDE.md` for agent-specific development workflows, PHR creation, and ADR suggestion processes.

---

**Version**: 1.0.0 | **Ratified**: 2025-12-25 | **Last Amended**: 2025-12-25

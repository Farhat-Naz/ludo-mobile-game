# Tasks: Project Setup and Development Environment

**Input**: Design documents from `/specs/001-project-setup/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not explicitly requested in spec.md - test tasks EXCLUDED per template guidelines

**Organization**: Tasks grouped by user story (US1: P1, US2: P2, US3: P3) to enable independent implementation

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story assignment (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Per research.md decision: **Single package structure** (not monorepo)
- Source: `src/` at repository root
- Tests: `tests/` at repository root
- Specs: `specs/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization per research.md technology decisions

- [X] T001 Initialize Expo project with SDK 52 using `npx create-expo-app@latest ludo-game --template blank-typescript`
- [X] T002 [P] Configure TypeScript in `tsconfig.json` with path aliases (@engine/*, @ui/*, @state/*, @services/*)
- [X] T003 [P] Install core dependencies: `expo@^52.0.0`, `react-native@0.76`, `zustand@^4.0.0`, `@react-native-async-storage/async-storage`, `expo-sqlite`
- [X] T004 [P] Install development dependencies: `jest`, `@testing-library/react-native`, `@testing-library/jest-native`, `fast-check`, `detox`
- [X] T005 [P] Install UI dependencies: `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-reanimated@^3.0.0`, `expo-av`, `expo-haptics`
- [X] T006 [P] Install validation library: `zod@^3.0.0`
- [X] T007 Configure ESLint in `.eslintrc.js` with React Native rules and path alias no-restricted-imports for `src/engine/**`
- [X] T008 [P] Configure Prettier in `.prettierrc.js` with project style guide
- [X] T009 [P] Configure Jest in `jest.config.js` with jest-expo preset and moduleNameMapper for path aliases
- [X] T010 [P] Create `.gitignore` with node_modules, .expo, build artifacts, .env
- [X] T011 [P] Create `.env.example` template for environment variables
- [X] T012 Configure `app.json` with Expo SDK 52, Android minSdkVersion 26, targetSdkVersion 34

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T013 Create base project structure: `src/engine/`, `src/ui/`, `src/state/`, `src/services/`, `src/utils/`, `src/types/`, `tests/unit/`, `tests/integration/`, `tests/e2e/`, `assets/audio/`, `assets/images/`, `docs/`
- [ ] T014 [P] Copy TypeScript contracts from `specs/001-project-setup/contracts/` to `src/types/contracts/`
- [ ] T015 [P] Create `src/utils/constants.ts` with color constants (red, blue, green, yellow), board size, player count limits
- [ ] T016 [P] Create `src/utils/colors.ts` with theme color palette and colorblind-accessible patterns
- [ ] T017 [P] Create example test file `src/engine/__tests__/example.test.ts` with basic Jest + fast-check example
- [ ] T018 Configure React Navigation stack navigator in `src/navigation/RootNavigator.tsx` using contracts/navigation.contract.ts types
- [ ] T019 [P] Create basic welcome screen component in `src/ui/screens/WelcomeScreen.tsx` with "Ludo Game" title and "Continue" button
- [ ] T020 Update `App.tsx` to render RootNavigator with WelcomeScreen as initial route

**Checkpoint**: Foundation ready - User story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Development Environment Initialization (Priority: P1) 🎯 MVP

**Goal**: Developer can complete full environment setup in <15 minutes and run app on emulator

**Independent Test**: Follow quickstart.md on clean machine, verify app launches showing WelcomeScreen within 15 minutes total

### Implementation for User Story 1

- [ ] T021 [P] [US1] Create comprehensive README.md in repository root with: game description, technology stack (React Native + Expo SDK 52, TypeScript, Zustand), prerequisites, installation steps, how to run locally, directory structure explanation, development workflow
- [ ] T022 [P] [US1] Document Expo SDK 52 installation in README.md: Node.js 18+ requirement, `npm install -g expo-cli`, Expo Go app download links (iOS App Store, Google Play)
- [ ] T023 [P] [US1] Document Android emulator setup in README.md: Android Studio download, AVD creation (Pixel 5, API 33), emulator launch instructions
- [ ] T024 [P] [US1] Document iOS simulator setup in README.md (macOS only): Xcode installation, Command Line Tools, simulator auto-launch with Expo
- [ ] T025 [P] [US1] Create installation script section in README.md: `git clone`, `cd ludo-game`, `npm install`, `npx expo start`
- [ ] T026 [P] [US1] Add troubleshooting section to README.md with 5 common issues: Metro bundler errors, unable to connect to dev server, Android emulator crashes, TypeScript path alias errors, test failures
- [ ] T027 [P] [US1] Document lint and format commands in README.md: `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run type-check`
- [ ] T028 [P] [US1] Add npm scripts to `package.json`: `"start": "npx expo start"`, `"lint": "eslint src/"`, `"lint:fix": "eslint src/ --fix"`, `"format": "prettier --write src/"`, `"format:check": "prettier --check src/"`, `"type-check": "tsc --noEmit"`, `"test": "jest"`, `"test:watch": "jest --watch"`, `"test:coverage": "jest --coverage"`
- [ ] T029 [US1] Verify linter runs successfully on codebase: `npm run lint` (0 errors on foundational phase code)
- [ ] T030 [US1] Verify formatter runs successfully: `npm run format:check` (all files properly formatted)
- [ ] T031 [US1] Verify app launches on Android emulator: `npx expo start`, press `a`, verify WelcomeScreen renders within 30 seconds
- [ ] T032 [US1] Verify app launches on iOS simulator (if macOS available): `npx expo start`, press `i`, verify WelcomeScreen renders within 30 seconds
- [ ] T033 [US1] Verify hot reload works: Edit WelcomeScreen.tsx title, save, verify app refreshes without full reload
- [ ] T034 [US1] Create `.github/pull_request_template.md` with checklist: tests pass, linter passes, no console errors, documentation updated

**Checkpoint**: User Story 1 complete - Developer can set up environment and run app in <15 minutes

---

## Phase 4: User Story 2 - Project Structure Creation (Priority: P2)

**Goal**: Developers have clear, well-organized project structure separating engine logic, UI, state, and services

**Independent Test**: Inspect directory structure, verify all folders exist with README files explaining purpose

### Implementation for User Story 2

- [ ] T035 [P] [US2] Create `src/engine/README.md` explaining: framework-agnostic game logic, no React Native imports allowed, ESLint enforcement, examples of dice logic, board state, token rules
- [ ] T036 [P] [US2] Create `src/ui/README.md` explaining: React Native components, screens vs components, navigation structure, animation guidelines
- [ ] T037 [P] [US2] Create `src/state/README.md` explaining: Zustand stores, persistence middleware, selector usage for performance, store creation examples
- [ ] T038 [P] [US2] Create `src/services/README.md` explaining: platform services (audio, haptics, storage), service interfaces, dependency injection pattern
- [ ] T039 [P] [US2] Create `src/utils/README.md` explaining: shared utilities, constants, helper functions, no business logic
- [ ] T040 [P] [US2] Create `src/types/README.md` explaining: TypeScript type definitions, contract interfaces, game types, UI types
- [ ] T041 [P] [US2] Create `tests/README.md` explaining: unit tests (co-located in `__tests__`), integration tests (full scenarios), E2E tests (Detox), running tests, coverage targets (80% for engine)
- [ ] T042 [P] [US2] Create `docs/rules.md` documenting Ludo game rules: board layout, token movement, safe zones, cutting mechanics, exact finish requirements, extra turn on 6
- [ ] T043 [P] [US2] Create `docs/architecture.md` documenting technical architecture: modular engine design, UI separation, state management strategy, persistence approach, testing strategy
- [ ] T044 [P] [US2] Create `docs/deployment.md` placeholder for future Play Store deployment guide (to be filled in deployment feature)
- [ ] T045 [US2] Update root README.md with "Project Structure" section showing directory tree and purpose of each folder
- [ ] T046 [US2] Update root README.md with "Development Workflow" section: feature development flow, test-first approach, commit conventions, PR process
- [ ] T047 [US2] Create subdirectories in `src/engine/`: `dice/`, `board/`, `tokens/`, `rules/`, `ai/` (with placeholder README.md in each)
- [ ] T048 [US2] Create subdirectories in `src/ui/`: `screens/`, `components/`, `animations/` (with placeholder README.md in each)
- [ ] T049 [US2] Verify linter recognizes files in all directories: Create dummy `.ts` file in each subdirectory, run `npm run lint`, verify no "file not recognized" errors
- [ ] T050 [US2] Verify build tools process files in all directories: Run `npm run type-check`, verify TypeScript compiles all directories without errors

**Checkpoint**: User Story 2 complete - Project structure is clear and well-documented

---

## Phase 5: User Story 3 - Development Tooling Configuration (Priority: P3)

**Goal**: Pre-configured development tools (linting, formatting, testing) maintain code quality and consistency

**Independent Test**: Run lint, format, and test commands, verify they execute without configuration errors

### Implementation for User Story 3

- [ ] T051 [P] [US3] Configure ESLint rules in `.eslintrc.js`: `no-console` (warn), `@typescript-eslint/no-unused-vars` (error), `react-hooks/rules-of-hooks` (error), `react-hooks/exhaustive-deps` (warn)
- [ ] T052 [P] [US3] Add ESLint override for `src/engine/**/*.ts` in `.eslintrc.js`: restrict imports of `react-native`, `@react-navigation/*`, `**/ui/**` (enforce engine modularity per constitution)
- [ ] T053 [P] [US3] Configure Prettier rules in `.prettierrc.js`: `printWidth: 100`, `singleQuote: true`, `trailingComma: 'es5'`, `tabWidth: 2`, `semi: true`, `arrowParens: 'always'`
- [ ] T054 [P] [US3] Add VS Code settings in `.vscode/settings.json`: auto-format on save, ESLint auto-fix on save, recommended extensions (ESLint, Prettier, React Native Tools)
- [ ] T055 [P] [US3] Add VS Code extensions recommendations in `.vscode/extensions.json`: `dbaeumer.vscode-eslint`, `esbenp.prettier-vscode`, `msjsdiag.vscode-react-native`
- [ ] T056 [P] [US3] Configure Jest coverage thresholds in `jest.config.js`: `branches: 80`, `functions: 80`, `lines: 80`, `statements: 80` for `src/engine/**` (per constitution requirement)
- [ ] T057 [P] [US3] Add Jest setup file `tests/setup.js`: configure React Native Testing Library, mock AsyncStorage, mock expo-sqlite, global test utilities
- [ ] T058 [P] [US3] Create example unit test in `src/utils/__tests__/constants.test.ts`: test color constants are defined, test board size constant is valid
- [ ] T059 [P] [US3] Create example property-based test using fast-check in `src/utils/__tests__/helpers.property.test.ts`: test utility functions with random inputs
- [ ] T060 [P] [US3] Configure Detox for E2E tests in `.detoxrc.js`: Android emulator configuration (Pixel 5, API 33), build path, test runner (jest)
- [ ] T061 [US3] Run linter on entire codebase: `npm run lint`, verify 0 errors (warnings allowed)
- [ ] T062 [US3] Run formatter check: `npm run format:check`, verify all files pass formatting rules
- [ ] T063 [US3] Run unit tests: `npm test`, verify example tests pass (2 tests: constants, helpers)
- [ ] T064 [US3] Run TypeScript type checker: `npm run type-check`, verify 0 type errors
- [ ] T065 [US3] Run test coverage: `npm run test:coverage`, verify coverage report generates (may not meet 80% threshold yet - that's expected at this stage)
- [ ] T066 [US3] Document code quality checks in README.md: add "Code Quality" section with lint, format, type-check, test commands and expected output
- [ ] T067 [US3] Add pre-commit hook recommendation in README.md: suggest Husky + lint-staged for auto-linting on commit (optional, not enforced)

**Checkpoint**: User Story 3 complete - Development tooling is fully configured and operational

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting all user stories

- [ ] T068 [P] Create `.github/ISSUE_TEMPLATE/bug_report.md` for bug reporting
- [ ] T069 [P] Create `.github/ISSUE_TEMPLATE/feature_request.md` for feature requests
- [ ] T070 [P] Create `CONTRIBUTING.md` with contribution guidelines: code style, PR process, testing requirements, commit message format
- [ ] T071 [P] Create `LICENSE` file (MIT or GPL, per project choice)
- [ ] T072 [P] Add project badges to README.md: build status (placeholder), license, code style (Prettier), test coverage (placeholder)
- [ ] T073 [P] Create `CHANGELOG.md` with initial v0.1.0 entry documenting Feature 001-project-setup completion
- [ ] T074 Validate README.md follows quickstart.md: ensure all instructions are accurate, troubleshooting covers common errors, setup time estimate is realistic (<15 min)
- [ ] T075 Run full validation suite: `npm run lint && npm run format:check && npm run type-check && npm test`, verify all commands pass
- [ ] T076 Test setup on fresh machine (or fresh Docker container): clone repo, follow README.md, verify app launches within 15 minutes
- [ ] T077 [P] Update `specs/001-project-setup/plan.md` with "Implementation Status: Complete" note
- [ ] T078 [P] Update `specs/001-project-setup/spec.md` with actual implementation details: confirmed framework (React Native + Expo), confirmed SDK version (52), confirmed tools (Zustand, AsyncStorage, Jest)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational (Phase 2) completion
  - User Story 1 (P1): Can start immediately after Foundational
  - User Story 2 (P2): Can start immediately after Foundational (parallel with US1)
  - User Story 3 (P3): Can start immediately after Foundational (parallel with US1, US2)
- **Polish (Phase 6)**: Depends on all user stories (Phase 3-5) being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - Independent
- **User Story 2 (P2)**: No dependencies on other stories - Independent (can reference US1's README.md structure)
- **User Story 3 (P3)**: No dependencies on other stories - Independent (validates US1+US2 artifacts but doesn't modify them)

### Within Each User Story

- **User Story 1**: All documentation tasks [P] can run in parallel; validation tasks (T029-T034) must run sequentially after docs complete
- **User Story 2**: All README creation tasks [P] can run in parallel; structure verification tasks (T049-T050) must run after directory creation
- **User Story 3**: All configuration tasks [P] can run in parallel; validation tasks (T061-T067) must run sequentially after configuration complete

### Parallel Opportunities

- **Phase 1 (Setup)**: T002-T011 can all run in parallel (different files)
- **Phase 2 (Foundational)**: T014-T017, T019 can run in parallel
- **User Story 1**: T021-T028, T034 can run in parallel (different documentation files)
- **User Story 2**: T035-T044, T047-T048 can run in parallel (different README files)
- **User Story 3**: T051-T060 can run in parallel (different configuration files)
- **Phase 6 (Polish)**: T068-T073, T077-T078 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all documentation tasks for User Story 1 together:
Task: "Create comprehensive README.md in repository root..."
Task: "Document Expo SDK 52 installation in README.md..."
Task: "Document Android emulator setup in README.md..."
Task: "Document iOS simulator setup in README.md..."
Task: "Create installation script section in README.md..."
Task: "Add troubleshooting section to README.md..."
Task: "Document lint and format commands in README.md..."
Task: "Add npm scripts to package.json..."
Task: "Create .github/pull_request_template.md..."

# Then run validation tasks sequentially:
Task: "Verify linter runs successfully on codebase..."
Task: "Verify formatter runs successfully..."
Task: "Verify app launches on Android emulator..."
Task: "Verify app launches on iOS simulator..."
Task: "Verify hot reload works..."
```

---

## Parallel Example: User Story 2

```bash
# Launch all README creation tasks for User Story 2 together:
Task: "Create src/engine/README.md..."
Task: "Create src/ui/README.md..."
Task: "Create src/state/README.md..."
Task: "Create src/services/README.md..."
Task: "Create src/utils/README.md..."
Task: "Create src/types/README.md..."
Task: "Create tests/README.md..."
Task: "Create docs/rules.md..."
Task: "Create docs/architecture.md..."
Task: "Create docs/deployment.md..."
Task: "Create subdirectories in src/engine/..."
Task: "Create subdirectories in src/ui/..."

# Then run verification tasks sequentially:
Task: "Verify linter recognizes files in all directories..."
Task: "Verify build tools process files in all directories..."
```

---

## Parallel Example: User Story 3

```bash
# Launch all configuration tasks for User Story 3 together:
Task: "Configure ESLint rules in .eslintrc.js..."
Task: "Add ESLint override for src/engine/**/*.ts..."
Task: "Configure Prettier rules in .prettierrc.js..."
Task: "Add VS Code settings in .vscode/settings.json..."
Task: "Add VS Code extensions recommendations..."
Task: "Configure Jest coverage thresholds..."
Task: "Add Jest setup file tests/setup.js..."
Task: "Create example unit test in src/utils/__tests__/..."
Task: "Create example property-based test..."
Task: "Configure Detox for E2E tests..."

# Then run validation tasks sequentially:
Task: "Run linter on entire codebase..."
Task: "Run formatter check..."
Task: "Run unit tests..."
Task: "Run TypeScript type checker..."
Task: "Run test coverage..."
Task: "Document code quality checks in README.md..."
Task: "Add pre-commit hook recommendation..."
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T012)
2. Complete Phase 2: Foundational (T013-T020) - CRITICAL
3. Complete Phase 3: User Story 1 (T021-T034)
4. **STOP and VALIDATE**: Test setup on fresh machine, verify <15 min setup time
5. Deploy/demo if ready

**Estimated Time**: ~3-4 hours (1 hour setup, 1 hour foundational, 1.5 hours US1, 0.5 hours validation)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → **MVP Complete** (Developer can onboard in <15 min)
3. Add User Story 2 → Test independently → **Project structure documented**
4. Add User Story 3 → Test independently → **Full tooling configured**
5. Add Polish → **Production-ready development environment**

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (1 developer, 2 hours)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (P1) - Documentation and setup validation
   - **Developer B**: User Story 2 (P2) - Project structure and READMEs
   - **Developer C**: User Story 3 (P3) - Tooling configuration
3. Stories complete and merge independently (no conflicts - different files)
4. **Estimated Time**: 2 hours (setup) + 1.5 hours (parallel stories) = 3.5 hours total

---

## Task Count Summary

- **Phase 1 (Setup)**: 12 tasks (T001-T012)
- **Phase 2 (Foundational)**: 8 tasks (T013-T020)
- **Phase 3 (User Story 1)**: 14 tasks (T021-T034)
- **Phase 4 (User Story 2)**: 16 tasks (T035-T050)
- **Phase 5 (User Story 3)**: 17 tasks (T051-T067)
- **Phase 6 (Polish)**: 11 tasks (T068-T078)

**Total**: 78 tasks

**Parallelizable Tasks**: 52 tasks marked [P] (~67%)

**User Story Breakdown**:
- US1 (P1): 14 tasks - MVP scope
- US2 (P2): 16 tasks - Additive
- US3 (P3): 17 tasks - Additive

---

## Validation Checklist

All tasks follow required format:
- ✅ All tasks have checkbox `- [ ]`
- ✅ All tasks have sequential ID (T001-T078)
- ✅ All parallelizable tasks marked [P]
- ✅ All user story tasks have [Story] label (US1, US2, US3)
- ✅ All tasks include file paths or explicit commands
- ✅ Setup/Foundational/Polish tasks have NO [Story] label
- ✅ Each user story has clear goal and independent test
- ✅ Dependencies documented (Foundational blocks all stories)
- ✅ Parallel opportunities identified (52 tasks)
- ✅ MVP scope defined (US1 only, 14 tasks)

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests NOT included (not requested in spec.md per template guidelines)
- All tasks align with constitution principles (mobile-first, engine modularity, test-first, progressive AI)
- Estimated total implementation time: 6-8 hours (sequential), 3.5-4 hours (parallel with 3 developers)

---

**Feature**: 001-project-setup
**Branch**: `001-project-setup`
**Status**: Tasks generated ✅
**Next**: Run `/sp.implement` to execute tasks
**Generated**: 2025-12-25

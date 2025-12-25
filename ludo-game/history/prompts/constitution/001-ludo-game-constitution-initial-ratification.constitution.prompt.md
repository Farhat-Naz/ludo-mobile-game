---
id: 001
title: Ludo Game Constitution Initial Ratification
stage: constitution
date: 2025-12-25
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: User
command: /sp.constitution
labels: ["constitution", "ludo-game", "mobile-first", "game-engine", "ai", "testing", "performance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A (constitution document)
---

## Prompt

# 🎲 LUDO GAME – DEVELOPMENT CONSTITUTION

---

## 1. Project Vision

Build a **mobile-first Ludo game** that supports:

- 🤖 **Single Player** (User vs System / AI)
- 👥 **2 Players** (Local or Online)
- 👥👥 **3 Players**
- 👥👥👥 **4 Players**
- 📱 **Mobile-only UI** (Google Play Store ready)

---

## 2. Technology Stack (Recommended & Practical)

### Frontend (Game UI)

- ✅ **React Native (Expo)**
  **OR**
- ✅ **Flutter** (best for high-performance games)

> If you already know **JavaScript / TypeScript**, choose **React Native + Expo**

---

### Game Logic

- **TypeScript / Dart** (depending on framework)
- Custom **Ludo Game Engine**
  - Dice logic
  - Turn management
  - Token rules

---

### AI (System Player)

- **Phase 1:** Rule-based logic
- **Phase 2:** Probability-based decision making

---

### Multiplayer

- **Local Multiplayer**
  - Same device
- **Online Multiplayer** (Optional / Advanced)
  - Firebase / Supabase
  - WebSockets

---

### Backend (Optional but Recommended)

- Firebase (Authentication, Realtime Database)
- Node.js (if required for advanced logic)

---

## 3. Game Modes

### 🎮 Mode 1: Single Player (User vs System)

- Player vs AI
- AI auto-rolls dice
- AI chooses optimal move

---

### 🎮 Mode 2: Local Multiplayer

- 2, 3, or 4 players
- Same phone
- Turn-based gameplay

---

### 🎮 Mode 3: Online Multiplayer (Future)

- Create game room
- Join game room
- Real-time synchronization

---

## 4. Ludo Game Rules (Core Engine)

### Dice Rules

- Dice value: **1–6**
- Rolling **6** grants an extra turn

---

### Token Rules

- Token opens only when dice = **6**
- Safe zones are protected
- Cutting opponent token sends it back home
- Winning requires **exact dice number** to finish

---

## 5. System (AI) Player Logic

### AI Decision Rules (Phase 1)

Priority order:

1. If token can **cut opponent** → move it
2. If token can **enter safe zone** → move it
3. If token can **open new piece with 6**
4. Otherwise → move **furthest token**

---

### AI Enhancements (Future)

- Probability scoring
- Mini-max strategy

---

## 6. Mobile UI / UX Rules

### Screen Layout

- Board centered
- Dice positioned at bottom
- Color-coded player tokens
- Touch-based movement

---

### UI Requirements

- Fully responsive (small screens)
- Smooth **60 FPS animations**
- Haptic feedback
- Sound effects (dice roll, cut, win)

---

## 7. Project Folder Structure
**(React Native Example)**


---

### README.md Must Include

- Game description
- Screenshots
- Technology stack
- How to run locally
- Play Store deployment plan

---

### Git Commands

```bash
git init
git add .
git commit -m "Initial Ludo game setup"
git branch -M main
git remote add origin https://github.com/Farhat-Naz/ludo-mobile-game.git
git push -u origin main
```

## Response snapshot

Created comprehensive Ludo Game Constitution v1.0.0 with 6 core principles:

1. **Mobile-First Development** - Google Play Store target, touch-optimized UI, responsive design for small screens (320px+)

2. **Game Engine Modularity** - Separated game logic (dice, turn management, token rules, board state) from UI with clear interfaces and independent testability

3. **Progressive AI Complexity** - Phase 1: rule-based AI with priority system (cut opponent > safe zone > open piece > furthest token); Phase 2-3: advanced strategies deferred

4. **Multi-Mode Flexibility** - Single player (vs AI), 2-4 player local multiplayer; online multiplayer deferred to v2.0

5. **Performance & UX Standards (NON-NEGOTIABLE)** - 60 FPS animations, <100ms touch response, haptic feedback, sound effects, WCAG 2.1 AA accessibility, colorblind-friendly design

6. **Test-First Game Logic** - TDD mandatory, 80% code coverage target for game engine, comprehensive edge case testing

**Technology Stack Defined**:
- Frontend: React Native (Expo) OR Flutter
- Language: TypeScript OR Dart
- State: Redux Toolkit/Zustand (RN) or Riverpod/Bloc (Flutter)
- Storage: AsyncStorage/expo-sqlite (RN) or shared_preferences/sqflite (Flutter)
- Animations: React Native Reanimated OR Flutter Animation APIs

**Project Structure**:
```
src/
  engine/        # Core game logic (framework-agnostic)
  ui/            # UI components and screens
  state/         # State management
  services/      # Audio, haptics, storage
tests/
  unit/          # Engine unit tests
  integration/   # Full game scenarios
  e2e/           # UI/UX tests
```

**Governance**:
- Semantic versioning (MAJOR.MINOR.PATCH)
- Constitution supersedes all practices
- Quality gates: tests pass, 60 FPS maintained, code review required
- Complexity justifications required for new dependencies or patterns

**Scope Management**:
- v1.0 In Scope: Mobile-only, local multiplayer, AI opponent, core Ludo rules, persistence, audio/haptics
- v1.0 Out of Scope: Online multiplayer, custom rules, monetization, social features, web/desktop, i18n

All placeholders filled, no TODOs except future enhancements (README creation, screenshots, Play Store docs).

## Outcome

- ✅ Impact: Created foundational governance document establishing 6 core principles for mobile-first Ludo game development with clear technology stack, architecture patterns, testing requirements, and scope boundaries
- 🧪 Tests: N/A (governance document; mandates 80% code coverage for game engine with test-first approach)
- 📁 Files: Created .specify/memory/constitution.md (v1.0.0)
- 🔁 Next prompts: Create feature specification for initial game setup (/sp.specify), create README.md, establish project structure, begin AI decision engine implementation
- 🧠 Reflection: Constitution successfully translates user's mobile game vision into actionable principles. Strong emphasis on modularity (game engine separation), progressive complexity (phased AI), and non-negotiable UX standards (60 FPS, accessibility) provides clear guard rails. Technology stack flexibility (React Native vs Flutter) allows team skill adaptation while maintaining architectural consistency.

## Evaluation notes (flywheel)

- Failure modes observed: None; all placeholders successfully filled with concrete, testable principles derived from user input
- Graders run and results (PASS/FAIL): PASS - Constitution meets all requirements: no unresolved placeholders, semantic versioning applied (v1.0.0), principles are declarative and testable, governance rules clearly defined, sync impact report included
- Prompt variant (if applicable): N/A (standard constitution creation workflow)
- Next experiment (smallest change to try): Validate constitution compliance during first feature spec creation; ensure "Constitution Check" section properly references relevant principles (Mobile-First, Game Engine Modularity, Test-First Game Logic)

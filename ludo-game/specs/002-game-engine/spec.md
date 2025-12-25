# Feature Specification: Core Game Engine

**Feature Branch**: `002-game-engine`
**Created**: 2025-12-25
**Status**: Draft
**Input**: User description: "Core Ludo game logic including dice mechanics, token movement rules, board state management, and turn-based gameplay"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dice Rolling and Turn Management (Priority: P1)

Players need to roll a virtual dice to determine token movement, with the system correctly managing turns between 2-4 players and granting extra turns when a 6 is rolled.

**Why this priority**: Dice rolling and turn management are the fundamental mechanics that drive all game actions. Without this, no gameplay is possible.

**Independent Test**: Can be fully tested by simulating a game with automated players where each player rolls the dice in sequence, and verifying that rolling a 6 grants an extra turn before passing to the next player.

**Acceptance Scenarios**:

1. **Given** a game with 4 players, **When** Player 1 rolls the dice, **Then** the system generates a random number between 1-6 and displays the result
2. **Given** Player 1 rolled a 6, **When** the roll completes, **Then** Player 1 receives another turn instead of passing to Player 2
3. **Given** Player 1 rolled a number from 1-5, **When** the roll completes, **Then** the turn passes to Player 2
4. **Given** a 2-player game, **When** Player 1 completes their turn, **Then** the turn passes to Player 2, then back to Player 1 in sequence
5. **Given** Player 1 rolled three consecutive 6s, **When** the third 6 is rolled, **Then** Player 1's turn ends and passes to the next player (standard Ludo rule variation)

---

### User Story 2 - Token Movement and Board State (Priority: P1)

Players need to move their tokens around the board based on dice rolls, with the system tracking all token positions, detecting collisions, and managing safe zones.

**Why this priority**: Token movement is core gameplay. This story works with Story 1 (dice) to create a minimal playable game loop.

**Independent Test**: Can be fully tested by programmatically moving tokens through the board path, verifying position updates, safe zone detection, and collision handling work correctly.

**Acceptance Scenarios**:

1. **Given** a player rolled a 6 and has all tokens in home position, **When** they select a token to open, **Then** that token moves to the starting position on the board
2. **Given** a token is on the board at position 5, **When** the player rolls a 3, **Then** the token moves to position 8
3. **Given** a token is at position 50 (2 spaces from finish), **When** the player rolls exactly 2, **Then** the token enters the finish area and is marked complete
4. **Given** a token is 2 spaces from finish, **When** the player rolls 3 or higher, **Then** the token cannot move (requires exact number to finish)
5. **Given** Player 1's token lands on a space occupied by Player 2's token, **When** the space is NOT a safe zone, **Then** Player 2's token is sent back to home position ("cut")
6. **Given** Player 1's token lands on a safe zone space occupied by Player 2's token, **When** the move completes, **Then** both tokens remain on the safe zone (no cutting allowed)
7. **Given** two tokens of the same player are on the board, **When** the player rolls the dice, **Then** the player can choose which token to move (if both moves are legal)

---

### User Story 3 - Game Flow and Win Conditions (Priority: P2)

Players need the game to correctly detect when all tokens of a player reach the finish area, declare that player as the winner, and optionally continue for remaining players to determine rankings.

**Why this priority**: Win detection completes the game loop but is less critical than basic movement mechanics. A game can be tested without full win logic.

**Independent Test**: Can be fully tested by programmatically moving all tokens of one player to the finish area and verifying the win condition is detected and announced.

**Acceptance Scenarios**:

1. **Given** Player 1 has 3 tokens in finish and 1 token is 1 space away, **When** Player 1 rolls exactly 1 and moves the final token to finish, **Then** the system declares Player 1 as the winner
2. **Given** Player 1 has won, **When** the win is announced, **Then** the game optionally continues for remaining players to determine 2nd, 3rd, 4th place (or ends immediately based on game mode)
3. **Given** a 2-player game where Player 1 has won, **When** the win condition is met, **Then** the game ends and displays the final results
4. **Given** a 4-player game where Player 1 and Player 2 have finished, **When** Player 3 gets all tokens to finish, **Then** Player 3 is declared 3rd place and only Player 4 remains

---

### User Story 4 - Game State Persistence (Priority: P3)

Players need the ability to save the current game state and resume later, preserving all token positions, current player turn, and game mode.

**Why this priority**: Persistence improves user experience but is not required for core gameplay. Players can complete games in one session initially.

**Independent Test**: Can be fully tested by saving a mid-game state to storage, closing the game, reloading, and verifying all positions, turn order, and rules are restored correctly.

**Acceptance Scenarios**:

1. **Given** a game in progress with tokens at various positions, **When** the player saves and exits, **Then** all token positions, current turn, and dice state are persisted to local storage
2. **Given** a saved game exists, **When** the player chooses "Resume Game" from the menu, **Then** the game loads with all players, tokens, and turn state exactly as they were when saved
3. **Given** a game was saved mid-turn (after dice roll, before token selection), **When** the game is resumed, **Then** the player can continue their turn from the same state

---

### Edge Cases

- What happens when all of a player's tokens are blocked and cannot make a legal move?
  - **Handling**: Turn passes to next player automatically; player must wait for a better dice roll
- How does the system handle a player rolling a 6 when all tokens are already on the board?
  - **Handling**: Player gets the extra turn but can move any token; opening rule only applies when tokens are in home
- What if two players try to occupy the same non-safe zone space?
  - **Handling**: Later player's token "cuts" earlier player's token (standard Ludo rules)
- What happens if a player disconnects in a local multiplayer game?
  - **Handling**: Game pauses; can be resumed when player returns (local multiplayer assumes same device)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate random dice rolls between 1-6 with equal probability for each value
- **FR-002**: System MUST grant an extra turn when a player rolls a 6 (dice value = 6)
- **FR-003**: System MUST require a dice roll of exactly 6 to open a token from home position to starting position
- **FR-004**: System MUST track token positions for all players (up to 4 players, 4 tokens each = 16 total tokens)
- **FR-005**: System MUST maintain a board model with 52 standard spaces plus 4 home areas, 4 starting positions, and 4 finish areas
- **FR-006**: System MUST identify safe zone positions where tokens cannot be cut (typically 8 safe zones on standard Ludo board)
- **FR-007**: System MUST enforce the "cutting" rule: when a token lands on an opponent's token (non-safe zone), the opponent's token returns to home
- **FR-008**: System MUST require exact dice value to move a token into the finish area (no overshooting allowed)
- **FR-009**: System MUST allow players to choose which token to move when multiple legal moves exist
- **FR-010**: System MUST rotate turns among active players (2-4 players) in clockwise order
- **FR-011**: System MUST detect win condition when all 4 tokens of a player reach the finish area
- **FR-012**: System MUST provide game state serialization for save/resume functionality
- **FR-013**: System MUST validate all moves according to Ludo rules before applying position changes

### Key Entities

- **Dice**: Generates random values 1-6, tracks consecutive 6s
- **Token**: Represents one game piece with properties: owner (player), position (home/board/finish), status (active/completed)
- **Board**: 52-space circular path with safe zones, starting positions, home areas, and finish lanes
- **Player**: Owns 4 tokens, has a color (Red/Blue/Green/Yellow), tracks turn order
- **GameState**: Aggregates all players, tokens, current turn, dice state, move history
- **Move**: Represents a single game action (token ID, from position, to position, dice value, cutting occurred)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Dice rolls complete in under 100ms and feel random (pass chi-square distribution test over 10,000 rolls)
- **SC-002**: Game correctly processes 100 consecutive turns with mixed dice values and token movements without errors
- **SC-003**: System accurately detects cutting scenarios in 100% of test cases where tokens land on non-safe zone occupied spaces
- **SC-004**: System prevents 100% of invalid moves (e.g., opening without 6, overshooting finish, moving cut tokens)
- **SC-005**: Win condition is detected immediately (within 10ms) when the 4th token of any player enters finish
- **SC-006**: Game state can be saved and restored with 100% fidelity (all token positions, turn order, game mode match exactly)
- **SC-007**: A complete 4-player game can be simulated in under 5 seconds (for automated testing purposes)

## Assumptions *(if applicable)*

- Standard Ludo rules apply (52-space board, 4 tokens per player, 6 to open, exact finish, cutting on non-safe zones)
- Three consecutive 6s result in turn ending (common variant; prevents infinite turns)
- Home area tokens are not visible on the board until opened (standard representation)
- The board follows the cross-shaped layout with 4 colored home areas at corners
- All game logic is deterministic except for dice rolls (enables testing and replay)
- Game engine is UI-agnostic (can be tested without rendering UI)

## Technical Constraints *(if applicable)*

- Game engine MUST be framework-agnostic with no UI dependencies (Constitution Principle II)
- All game rules and logic MUST have unit test coverage minimum 80% (Constitution Principle VI)
- Game state updates MUST complete in under 16ms to maintain 60 FPS UI responsiveness (Constitution Principle V)
- Token movement calculations MUST be deterministic given same board state and dice value
- Game engine MUST support 2, 3, or 4 player modes (Constitution Principle IV)

## Dependencies *(if applicable)*

### External Dependencies
- Random number generator (Math.random or platform equivalent)
- Local storage API for game state persistence (AsyncStorage, SharedPreferences, or equivalent)

### Internal Dependencies
- 001-project-setup (project structure and development environment must exist)

## Out of Scope *(if applicable)*

- AI player logic (will be addressed in separate feature based on Constitution Phase 1 AI strategy)
- UI rendering, animations, and visual feedback (covered in 003-mobile-ui)
- Sound effects and haptic feedback (covered in 003-mobile-ui)
- Online multiplayer and real-time synchronization (out of scope for v1.0 per Constitution)
- Custom rule variations (e.g., teams, special powers) - v1.0 uses standard Ludo rules only
- Undo/redo functionality (future enhancement)
- Move hints or suggestions (may be part of future AI feature)

## Related Features *(if applicable)*

- This feature depends on:
  - 001-project-setup (development environment)

- This feature enables:
  - 003-mobile-ui (UI will display and interact with this game engine)
  - Future AI player feature (AI will use this engine's public API)
  - Future online multiplayer (game state serialization supports network sync)

## Open Questions *(if applicable)*

None - all game rules follow standard Ludo mechanics as defined in Constitution Section 4 (Ludo Game Rules).

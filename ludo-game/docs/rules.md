# Ludo Game Rules

Official rules for the classic Ludo board game as implemented in this mobile version.

## Game Overview

Ludo is a strategy board game for 2-4 players. The objective is to move all four of your tokens from the starting area (home) around the board and into the finish area before your opponents.

## Board Layout

- **72 Total Positions**: Main board path (18 positions per player × 4 players)
- **4 Starting Areas** (Home): One for each player color (Red, Blue, Green, Yellow)
- **4 Safe Zones**: Final 6 positions leading to each player's finish area
- **4 Finish Areas**: Where tokens must reach to win

### Position Numbering

- Positions 0-17: Red player's path
- Positions 18-35: Blue player's path
- Positions 36-53: Green player's path
- Positions 54-71: Yellow player's path

Each player starts at their respective starting position:
- Red: Position 0
- Blue: Position 18
- Green: Position 36
- Yellow: Position 54

## Setup

1. **Choose Player Count**: 2, 3, or 4 players
2. **Select Colors**: Each player chooses a color (Red, Blue, Green, Yellow)
3. **AI Players** (Optional): Configure AI difficulty (Easy, Medium, Hard)
4. **Starting Position**: All tokens begin in their home area (not on the board)

## Basic Rules

### 1. Dice Rolling

- Players take turns rolling a single six-sided die (values 1-6)
- The dice value determines how many spaces a token can move
- Only one token can be moved per turn

### 2. Opening Tokens

- **Tokens start in the home area** and cannot move until "opened"
- **To open a token**: Roll a 6 on the dice
- Rolling a 6 allows you to:
  - Move a token from home to your starting position (position 0, 18, 36, or 54), OR
  - Move an already active token 6 spaces
- You can only have a maximum of 4 tokens on the board (one per token piece)

### 3. Moving Tokens

- Move any of your active tokens forward by the dice value
- Tokens move clockwise around the board
- You must move a token if you can (no passing turns if a legal move exists)
- Tokens can share the same space (stacking)

### 4. Capturing (Cutting)

- **When you land exactly on an opponent's token**, you "cut" (capture) it
- The captured token is **sent back to its home area**
- The capturing player does **NOT** get an extra turn
- **Exception**: Safe Zone positions cannot be captured

### 5. Safe Zones

- **Safe positions**: Certain spaces on the board where tokens cannot be captured
- Typically marked with a star or special color
- Your own starting position is also safe
- Safe zone positions (final 6 spaces before finish) are always safe

### 6. Extra Turns

- **Rolling a 6 gives you an extra turn**
- You can roll again immediately after rolling a 6
- **Maximum consecutive rolls**: 3 sixes in a row
  - If you roll three 6s consecutively, your turn ends
  - On the third 6, you do NOT move any token
  - This prevents infinite turns

### 7. Entering Finish Area

- After completing the full board circuit, tokens enter their color's safe zone (6 positions)
- Tokens must move through the safe zone to reach the finish area
- **Exact finish required**: You must roll the EXACT number to enter the finish area
  - Example: If you're 2 spaces from finish and roll a 5, you cannot move
  - You must wait for a roll of 2

### 8. Winning the Game

- **First player to get all 4 tokens into the finish area wins**
- Other players continue playing for 2nd, 3rd, and 4th place

## Turn Sequence

1. **Roll Dice**: Tap the dice button to roll
2. **Select Token**: Choose which token to move (if multiple are movable)
3. **Automatic Movement**: Token animates to new position
4. **Process Effects**: Handle captures, finish checks
5. **Extra Turn Check**: If you rolled a 6, roll again; otherwise, next player's turn

## Special Cases

### Blocked Finish

- If all your tokens are in the safe zone and you cannot roll the exact number to finish:
  - You must continue rolling until you get the right number
  - No penalties for being unable to move

### No Legal Moves

- If you cannot move any token with your dice roll:
  - Your turn ends immediately
  - Next player's turn begins
  - Example: All tokens in home and you roll 1-5

### Token Priority

- When multiple tokens can move, the player chooses which one
- Recommended strategy: Move tokens closest to finishing first

## Strategy Tips

### Opening Game

- **Get all tokens out early**: Don't rely on just one token
- **Roll 6s aggressively**: More tokens = more options

### Mid Game

- **Spread your tokens**: Don't bunch them together
- **Capture strategically**: Send opponents back to slow their progress
- **Use safe zones**: Land on safe positions when possible

### End Game

- **Exact finish planning**: Count your rolls to finish precisely
- **Block opponents**: Use your tokens to occupy safe positions
- **Prioritize finishing**: Get your first token home quickly

## Variations Implemented

This implementation uses these specific rule variations:

1. **Exact Finish Required**: Yes
2. **Capture Gives Extra Turn**: No
3. **Max Consecutive 6s**: 3
4. **Starting Token Requires**: 6
5. **Stacking Allowed**: Yes (multiple tokens per position)
6. **Safe Zone Capture**: Not allowed

## AI Difficulty Levels

### Easy

- Random valid moves
- No strategic planning
- Does not prioritize finishing or capturing

### Medium

- Prefers capturing opponent tokens
- Moves tokens closer to finish first
- Basic position evaluation

### Hard

- Advanced strategic planning
- Evaluates all move options
- Prioritizes optimal token positioning
- Anticipates opponent moves
- Minimizes risk of being captured

## Accessibility

This implementation includes colorblind-accessible features:

- **Unique patterns** for each player color:
  - Red: Solid fill
  - Blue: Diagonal lines
  - Green: Dots
  - Yellow: Cross-hatch
- **High contrast** color choices (WCAG AA compliant)
- **Clear visual indicators** for selectable tokens
- **Haptic feedback** for important actions

## Glossary

- **Token**: One of four game pieces per player
- **Home**: Starting area where tokens begin (off the board)
- **Active**: Token on the main board path
- **Safe Zone**: Final 6 positions before finish
- **Finish**: End goal where tokens must reach
- **Capture/Cut**: Send opponent token back to home
- **Extra Turn**: Additional roll earned by rolling a 6
- **Exact Finish**: Must roll precise number to enter finish area

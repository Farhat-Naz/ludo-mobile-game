# Tokens Module

Token movement rules and collision handling.

## Purpose

- Validate token movement
- Handle token captures (cutting)
- Manage token status (home, active, safe-zone, finished)
- Track token positions

## Key Functions

- `canMoveToken(token, roll)`: Check if token can move
- `moveToken(token, roll)`: Calculate new token position
- `handleCapture(attacker, defender)`: Process token capture
- `isInSafeZone(token)`: Check if token is in safe zone

## Implementation Status

⏳ **Pending**: To be implemented in game engine feature phase.

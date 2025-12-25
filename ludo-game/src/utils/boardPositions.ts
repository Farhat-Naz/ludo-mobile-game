/**
 * Board Position Utilities
 * Maps logical board positions to screen coordinates
 */

import { BOARD_CONFIG, PLAYER_CONFIG, type PlayerColor } from '@utils/constants';
import type { Token } from '@engine/tokens';

/**
 * Screen position for a token
 */
export interface ScreenPosition {
  x: number;
  y: number;
}

/**
 * Get home position coordinates for a token
 * Tokens in home are arranged in a 2x2 grid within their home area
 * @param player - Player color
 * @param tokenIndex - Token index (0-3)
 * @param boardSize - Size of the board in pixels
 * @returns Screen position
 */
export function getHomePosition(
  player: PlayerColor,
  tokenIndex: number,
  boardSize: number
): ScreenPosition {
  const homeSize = boardSize * 0.4; // 40% of board size
  const padding = boardSize * 0.05; // 5% padding
  const tokenSpacing = homeSize / 3; // Space for 2x2 grid with gaps

  // Base positions for each home area
  const homeBasePositions: Record<PlayerColor, { x: number; y: number }> = {
    red: { x: padding, y: padding },
    blue: { x: boardSize - padding - homeSize, y: padding },
    green: { x: padding, y: boardSize - padding - homeSize },
    yellow: { x: boardSize - padding - homeSize, y: boardSize - padding - homeSize },
  };

  const base = homeBasePositions[player];

  // Arrange tokens in 2x2 grid
  const row = Math.floor(tokenIndex / 2);
  const col = tokenIndex % 2;

  return {
    x: base.x + (col + 0.5) * tokenSpacing,
    y: base.y + (row + 0.5) * tokenSpacing,
  };
}

/**
 * Get board path position coordinates for a token
 * Maps logical position (0-71) to screen coordinates on the cross path
 * @param position - Logical board position (0-71)
 * @param boardSize - Size of the board in pixels
 * @returns Screen position
 */
export function getBoardPathPosition(position: number, boardSize: number): ScreenPosition {
  const cellSize = boardSize / 15; // Board divided into 15x15 grid
  const halfBoard = boardSize / 2;
  const pathWidth = boardSize * 0.2; // 20% path width
  const pathHalf = pathWidth / 2;

  // Normalize position to 0-71
  const pos = position % BOARD_CONFIG.TOTAL_POSITIONS;

  // Ludo board path: each side has 18 positions
  // Starting from red (left middle), going clockwise

  if (pos >= 0 && pos < 6) {
    // Red starting path (left side, going up)
    return {
      x: halfBoard - pathHalf - cellSize * (5 - pos),
      y: halfBoard,
    };
  } else if (pos >= 6 && pos < 12) {
    // Top-left corner going right
    const offset = pos - 6;
    return {
      x: pathHalf + cellSize * offset,
      y: pathHalf,
    };
  } else if (pos >= 12 && pos < 18) {
    // Blue starting zone (top, going right)
    const offset = pos - 12;
    return {
      x: halfBoard,
      y: pathHalf + cellSize * offset,
    };
  } else if (pos >= 18 && pos < 24) {
    // Top-right going down
    const offset = pos - 18;
    return {
      x: boardSize - pathHalf - cellSize * offset,
      y: pathHalf,
    };
  } else if (pos >= 24 && pos < 30) {
    // Right side going down
    const offset = pos - 24;
    return {
      x: boardSize - pathHalf,
      y: pathHalf + cellSize * offset,
    };
  } else if (pos >= 30 && pos < 36) {
    // Yellow starting zone (right, going down)
    const offset = pos - 30;
    return {
      x: boardSize - pathHalf - cellSize * offset,
      y: halfBoard,
    };
  } else if (pos >= 36 && pos < 42) {
    // Bottom-right going left
    const offset = pos - 36;
    return {
      x: boardSize - pathHalf - cellSize * offset,
      y: boardSize - pathHalf,
    };
  } else if (pos >= 42 && pos < 48) {
    // Bottom side going left
    const offset = pos - 42;
    return {
      x: boardSize - pathHalf - cellSize * offset,
      y: boardSize - pathHalf,
    };
  } else if (pos >= 48 && pos < 54) {
    // Green starting zone (bottom, going left)
    const offset = pos - 48;
    return {
      x: halfBoard - cellSize * offset,
      y: boardSize - pathHalf,
    };
  } else if (pos >= 54 && pos < 60) {
    // Bottom-left going up
    const offset = pos - 54;
    return {
      x: pathHalf,
      y: boardSize - pathHalf - cellSize * offset,
    };
  } else if (pos >= 60 && pos < 66) {
    // Left side going up
    const offset = pos - 60;
    return {
      x: pathHalf,
      y: boardSize - pathHalf - cellSize * offset,
    };
  } else {
    // pos >= 66 && pos < 72
    // Red entry (left, going up to home)
    const offset = pos - 66;
    return {
      x: pathHalf + cellSize * offset,
      y: halfBoard,
    };
  }
}

/**
 * Get finish zone position coordinates for a token
 * @param player - Player color
 * @param finishPosition - Position in finish zone (0-5)
 * @param boardSize - Size of the board in pixels
 * @returns Screen position
 */
export function getFinishZonePosition(
  player: PlayerColor,
  finishPosition: number,
  boardSize: number
): ScreenPosition {
  const halfBoard = boardSize / 2;
  const cellSize = boardSize / 15;
  const pathHalf = boardSize * 0.1;

  // Each player has a finish lane leading to center
  switch (player) {
    case 'red':
      // Red: horizontal path going right to center
      return {
        x: pathHalf + cellSize * (finishPosition + 1),
        y: halfBoard,
      };
    case 'blue':
      // Blue: vertical path going down to center
      return {
        x: halfBoard,
        y: pathHalf + cellSize * (finishPosition + 1),
      };
    case 'green':
      // Green: horizontal path going left to center
      return {
        x: boardSize - pathHalf - cellSize * (finishPosition + 1),
        y: halfBoard,
      };
    case 'yellow':
      // Yellow: vertical path going up to center
      return {
        x: halfBoard,
        y: boardSize - pathHalf - cellSize * (finishPosition + 1),
      };
  }
}

/**
 * Get screen position for a token based on its current state
 * @param token - Token object
 * @param boardSize - Size of the board in pixels
 * @returns Screen position
 */
export function getTokenScreenPosition(token: Token, boardSize: number): ScreenPosition {
  switch (token.status) {
    case 'home':
      return getHomePosition(token.player, token.index, boardSize);

    case 'finish': {
      const finishPos = token.distanceTraveled - 52;
      if (finishPos >= 0 && finishPos <= BOARD_CONFIG.SAFE_ZONE_POSITIONS) {
        return getFinishZonePosition(token.player, finishPos, boardSize);
      }
      // If invalid finish position, return home
      return getHomePosition(token.player, token.index, boardSize);
    }

    case 'active':
      return getBoardPathPosition(token.position, boardSize);

    default:
      return getHomePosition(token.player, token.index, boardSize);
  }
}

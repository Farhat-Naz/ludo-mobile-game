/**
 * Token Movement Tests
 * Unit tests for token movement and collision logic
 */

import {
  canMoveToken,
  openToken,
  moveToken,
  checkCollision,
  sendTokenHome,
  getMoveableTokens,
  hasTokensInHome,
  countFinishedTokens,
  createToken,
} from '../tokenMovement';
import type { Token } from '../tokenTypes';
import { PLAYER_COLORS } from '../../../utils/constants';

describe('createToken', () => {
  it('should create token in home status', () => {
    const token = createToken(PLAYER_COLORS.RED, 0);

    expect(token.id).toBe('red-0');
    expect(token.player).toBe(PLAYER_COLORS.RED);
    expect(token.index).toBe(0);
    expect(token.status).toBe('home');
    expect(token.position).toBe(-1);
    expect(token.distanceTraveled).toBe(0);
  });
});

describe('canMoveToken', () => {
  it('should allow moving token with 6 when in home', () => {
    const token = createToken(PLAYER_COLORS.RED, 0);
    expect(canMoveToken(token, 6)).toBe(true);
  });

  it('should not allow moving token without 6 when in home', () => {
    const token = createToken(PLAYER_COLORS.RED, 0);
    expect(canMoveToken(token, 1)).toBe(false);
    expect(canMoveToken(token, 5)).toBe(false);
  });

  it('should not allow moving finished tokens', () => {
    const token: Token = {
      ...createToken(PLAYER_COLORS.RED, 0),
      status: 'finish',
      distanceTraveled: 58,
    };
    expect(canMoveToken(token, 3)).toBe(false);
  });

  it('should allow moving active tokens', () => {
    const token: Token = {
      ...createToken(PLAYER_COLORS.RED, 0),
      status: 'active',
      position: 5,
      distanceTraveled: 5,
    };
    expect(canMoveToken(token, 3)).toBe(true);
  });

  it('should not allow moves that overshoot finish', () => {
    const token: Token = {
      ...createToken(PLAYER_COLORS.RED, 0),
      status: 'active',
      position: -1,
      distanceTraveled: 57, // One away from finish
    };
    expect(canMoveToken(token, 1)).toBe(true); // Exactly finishes
    expect(canMoveToken(token, 2)).toBe(false); // Overshoots
  });
});

describe('openToken', () => {
  it('should move token from home to starting position', () => {
    const token = createToken(PLAYER_COLORS.RED, 0);
    const opened = openToken(token);

    expect(opened.status).toBe('active');
    expect(opened.position).toBe(0); // Red starts at 0
    expect(opened.distanceTraveled).toBe(0);
  });

  it('should throw error if token is not in home', () => {
    const token: Token = {
      ...createToken(PLAYER_COLORS.RED, 0),
      status: 'active',
      position: 5,
    };
    expect(() => openToken(token)).toThrow('Can only open tokens that are in home');
  });
});

describe('checkCollision', () => {
  it('should detect collision with opponent token', () => {
    const redToken: Token = {
      ...createToken(PLAYER_COLORS.RED, 0),
      status: 'active',
      position: 10,
    };

    const blueToken: Token = {
      ...createToken(PLAYER_COLORS.BLUE, 0),
      status: 'active',
      position: 10,
    };

    const allTokens = [blueToken];
    const collision = checkCollision(redToken, allTokens);

    expect(collision).toBeDefined();
    expect(collision?.id).toBe('blue-0');
  });

  it('should not detect collision with own token', () => {
    const redToken1: Token = {
      ...createToken(PLAYER_COLORS.RED, 0),
      status: 'active',
      position: 10,
    };

    const redToken2: Token = {
      ...createToken(PLAYER_COLORS.RED, 1),
      status: 'active',
      position: 10,
    };

    const allTokens = [redToken2];
    const collision = checkCollision(redToken1, allTokens);

    expect(collision).toBeUndefined();
  });

  it('should not detect collision if positions differ', () => {
    const redToken: Token = {
      ...createToken(PLAYER_COLORS.RED, 0),
      status: 'active',
      position: 10,
    };

    const blueToken: Token = {
      ...createToken(PLAYER_COLORS.BLUE, 0),
      status: 'active',
      position: 15,
    };

    const allTokens = [blueToken];
    const collision = checkCollision(redToken, allTokens);

    expect(collision).toBeUndefined();
  });
});

describe('sendTokenHome', () => {
  it('should reset token to home status', () => {
    const token: Token = {
      ...createToken(PLAYER_COLORS.RED, 0),
      status: 'active',
      position: 25,
      distanceTraveled: 25,
    };

    const homeToken = sendTokenHome(token);

    expect(homeToken.status).toBe('home');
    expect(homeToken.position).toBe(-1);
    expect(homeToken.distanceTraveled).toBe(0);
  });
});

describe('moveToken', () => {
  it('should open token with dice roll of 6', () => {
    const token = createToken(PLAYER_COLORS.RED, 0);
    const result = moveToken(token, 6, []);

    expect(result.token.status).toBe('active');
    expect(result.token.position).toBe(0);
    expect(result.didCut).toBe(false);
  });

  it('should move active token forward', () => {
    const token: Token = {
      ...createToken(PLAYER_COLORS.RED, 0),
      status: 'active',
      position: 5,
      distanceTraveled: 5,
    };

    const result = moveToken(token, 3, []);

    expect(result.token.position).toBe(8);
    expect(result.token.distanceTraveled).toBe(8);
    expect(result.didCut).toBe(false);
  });

  it('should finish token when reaching final position', () => {
    const token: Token = {
      ...createToken(PLAYER_COLORS.RED, 0),
      status: 'active',
      position: -1,
      distanceTraveled: 57,
    };

    const result = moveToken(token, 1, []);

    expect(result.token.status).toBe('finish');
    expect(result.token.distanceTraveled).toBe(58);
    expect(result.didCut).toBe(false);
  });

  it('should cut opponent token on collision', () => {
    const redToken: Token = {
      ...createToken(PLAYER_COLORS.RED, 0),
      status: 'active',
      position: 7,
      distanceTraveled: 7,
    };

    const blueToken: Token = {
      ...createToken(PLAYER_COLORS.BLUE, 0),
      status: 'active',
      position: 10,
      distanceTraveled: 10,
    };

    const result = moveToken(redToken, 3, [blueToken]);

    expect(result.token.position).toBe(10);
    expect(result.didCut).toBe(true);
    expect(result.cutToken).toBeDefined();
    expect(result.cutToken?.status).toBe('home');
  });
});

describe('getMoveableTokens', () => {
  it('should return only tokens that can move', () => {
    const tokens: Token[] = [
      createToken(PLAYER_COLORS.RED, 0), // home, needs 6
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'active', position: 10, distanceTraveled: 10 }, // can move
      { ...createToken(PLAYER_COLORS.RED, 2), status: 'finish', distanceTraveled: 58 }, // finished
    ];

    const moveable = getMoveableTokens(tokens, 3);

    expect(moveable.length).toBe(1);
    expect(moveable[0].index).toBe(1);
  });

  it('should return tokens in home when rolling 6', () => {
    const tokens: Token[] = [
      createToken(PLAYER_COLORS.RED, 0),
      createToken(PLAYER_COLORS.RED, 1),
    ];

    const moveable = getMoveableTokens(tokens, 6);

    expect(moveable.length).toBe(2);
  });
});

describe('hasTokensInHome', () => {
  it('should return true if player has tokens in home', () => {
    const tokens: Token[] = [
      createToken(PLAYER_COLORS.RED, 0),
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'active', position: 10, distanceTraveled: 10 },
    ];

    expect(hasTokensInHome(tokens)).toBe(true);
  });

  it('should return false if no tokens in home', () => {
    const tokens: Token[] = [
      { ...createToken(PLAYER_COLORS.RED, 0), status: 'active', position: 10, distanceTraveled: 10 },
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'finish', distanceTraveled: 58 },
    ];

    expect(hasTokensInHome(tokens)).toBe(false);
  });
});

describe('countFinishedTokens', () => {
  it('should count finished tokens correctly', () => {
    const tokens: Token[] = [
      { ...createToken(PLAYER_COLORS.RED, 0), status: 'finish', distanceTraveled: 58 },
      { ...createToken(PLAYER_COLORS.RED, 1), status: 'active', position: 10, distanceTraveled: 10 },
      { ...createToken(PLAYER_COLORS.RED, 2), status: 'finish', distanceTraveled: 58 },
      createToken(PLAYER_COLORS.RED, 3),
    ];

    expect(countFinishedTokens(tokens)).toBe(2);
  });

  it('should return 0 if no tokens finished', () => {
    const tokens: Token[] = [
      createToken(PLAYER_COLORS.RED, 0),
      createToken(PLAYER_COLORS.RED, 1),
    ];

    expect(countFinishedTokens(tokens)).toBe(0);
  });
});

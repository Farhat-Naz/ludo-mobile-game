// Jest configuration for engine tests (framework-agnostic)
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/engine'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@engine/(.*)$': '<rootDir>/src/engine/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
  },
  collectCoverageFrom: [
    'src/engine/**/*.ts',
    '!src/engine/**/*.d.ts',
    '!src/engine/**/__tests__/**',
  ],
  coverageThreshold: {
    'src/engine/**/*.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

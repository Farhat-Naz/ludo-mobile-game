module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
  },
  overrides: [
    {
      // Enforce engine modularity - no React Native or UI imports in engine code
      files: ['src/engine/**/*.ts', 'src/engine/**/*.tsx'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              '**/ui/**',
              'react-native',
              '@react-navigation/*',
              'expo-*',
            ],
          },
        ],
      },
    },
  ],
};

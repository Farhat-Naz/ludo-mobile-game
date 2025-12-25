# Developer Quickstart Guide

**Ludo Mobile Game** | **React Native (Expo)** | **Last Updated**: 2025-12-25

---

## ⏱️ 15-Minute Setup Goal

This guide gets you from git clone to running app in **15 minutes**.

**Prerequisites**: 10 minutes
**Installation**: 3 minutes
**First Run**: 2 minutes

---

## Prerequisites

### Required Software

Install these before starting:

1. **Node.js 18+ (LTS)**
   - Download: https://nodejs.org/
   - Verify: `node --version` (should show v18.x or higher)
   - Package manager: npm (bundled) or yarn/pnpm

2. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

3. **Expo CLI** (installed globally)
   ```bash
   npm install -g expo-cli
   ```
   - Verify: `expo --version`

4. **Mobile Device or Emulator** (choose one):

   **Option A: Physical Device (Easiest)**
   - Install **Expo Go** app:
     - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
     - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Connect device to same WiFi as development machine

   **Option B: Android Emulator**
   - Install [Android Studio](https://developer.android.com/studio)
   - Create AVD (Android Virtual Device) via AVD Manager
   - Recommended: Pixel 5 with API 33 (Android 13)
   - Launch emulator before running Expo

   **Option C: iOS Simulator (macOS only)**
   - Install Xcode from Mac App Store
   - Install Command Line Tools: `xcode-select --install`
   - Simulator launches automatically with Expo

### Optional (Recommended)

- **VS Code** (code editor): https://code.visualstudio.com/
  - Extensions:
    - ESLint (dbaeumer.vscode-eslint)
    - Prettier (esbenp.prettier-vscode)
    - React Native Tools (msjsdiag.vscode-react-native)

---

## Installation Steps

### 1. Clone Repository

```bash
git clone <repository-url>
cd ludo-game
```

### 2. Install Dependencies

```bash
# Using npm (default)
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

**Expected Duration**: 2-3 minutes (downloads ~300MB of node_modules)

### 3. Verify Installation

```bash
# Check Expo configuration
npx expo-doctor

# Expected output: "✓ Everything is configured correctly"
```

---

## First Run

### Start Development Server

```bash
# Start Expo dev server
npx expo start

# Or shorter alias
npm start
```

**Expected Output**:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

### Run on Device

**Physical Device (Expo Go)**:
1. Open Expo Go app on your device
2. Scan the QR code from terminal
3. App will load in 10-30 seconds

**Android Emulator**:
1. Ensure emulator is running
2. Press `a` in terminal
3. App will install and launch

**iOS Simulator (macOS)**:
1. Press `i` in terminal
2. Simulator will launch automatically
3. App will load in 10-20 seconds

### First Launch Checklist

When the app loads, you should see:

- [ ] Home screen with "Ludo Game" title
- [ ] "Start Game" button (functional navigation)
- [ ] "Settings" button (opens settings screen)
- [ ] No console errors in terminal
- [ ] Hot reload works (edit `App.tsx`, save, app refreshes)

---

## Project Structure Tour

```text
ludo-game/
├── src/                   # All application source code
│   ├── engine/            # 🎮 Game logic (framework-agnostic)
│   │   ├── dice/          # Dice roll mechanics
│   │   ├── board/         # Board state and positions
│   │   ├── tokens/        # Token movement rules
│   │   ├── rules/         # Ludo rules (cuts, safe zones)
│   │   └── ai/            # AI player logic (future)
│   │
│   ├── ui/                # 📱 React Native components
│   │   ├── screens/       # Full-screen views
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── GameBoardScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── components/    # Reusable UI components
│   │   │   ├── Board/
│   │   │   ├── Dice/
│   │   │   └── Token/
│   │   └── animations/    # React Native Reanimated animations
│   │
│   ├── state/             # 📊 Zustand state management
│   │   ├── useSettingsStore.ts
│   │   ├── useProfileStore.ts
│   │   └── useGameStore.ts
│   │
│   ├── services/          # 🔧 Platform services
│   │   ├── audio/         # Sound effects
│   │   ├── haptics/       # Vibration feedback
│   │   ├── storage/       # AsyncStorage, SQLite
│   │   └── navigation/    # React Navigation service
│   │
│   ├── utils/             # 🛠️ Shared utilities
│   │   ├── colors.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   └── types/             # 📝 TypeScript types
│       ├── contracts/     # Interface contracts
│       ├── game.types.ts
│       └── ui.types.ts
│
├── tests/                 # 🧪 Test suites
│   ├── unit/              # Unit tests (co-located with source in __tests__)
│   ├── integration/       # Full game scenario tests
│   └── e2e/               # Detox end-to-end tests
│
├── assets/                # 🎨 Static assets
│   ├── audio/             # Sound effects (dice, move, cut)
│   ├── images/            # Board graphics, tokens
│   └── animations/        # Lottie files (optional)
│
├── docs/                  # 📚 Documentation
│   ├── rules.md           # Ludo game rules
│   ├── architecture.md    # Technical architecture
│   └── deployment.md      # Play Store deployment
│
├── specs/                 # 📋 Feature specifications
│   ├── 001-project-setup/ # This feature
│   ├── 002-game-engine/   # Game logic feature
│   └── 003-mobile-ui/     # UI components feature
│
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project overview
```

### Key Directories

| Directory | Purpose | Import As |
|-----------|---------|-----------|
| `src/engine/` | Game logic (no React Native imports) | `@engine/*` |
| `src/ui/` | React Native components | `@ui/*` |
| `src/state/` | Zustand stores | `@state/*` |
| `src/services/` | Platform services | `@services/*` |
| `src/types/` | TypeScript types | `@types/*` |

**Import Example**:
```typescript
// Bad: Relative imports
import { DiceRoller } from '../../../engine/dice/DiceRoller';

// Good: Path aliases (configured in tsconfig.json)
import { DiceRoller } from '@engine/dice/DiceRoller';
```

---

## Common Development Tasks

### Adding a New Screen

1. **Create screen component**:
   ```bash
   # Create file
   touch src/ui/screens/NewScreen.tsx
   ```

   ```tsx
   // src/ui/screens/NewScreen.tsx
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';

   export default function NewScreen() {
     return (
       <View style={styles.container}>
         <Text>New Screen</Text>
       </View>
     );
   }

   const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
     },
   });
   ```

2. **Add route to navigation contract**:
   ```typescript
   // src/types/contracts/navigation.contract.ts
   export type RootStackParamList = {
     // ... existing routes
     NewScreen: undefined; // Add this line
   };
   ```

3. **Register screen in navigator**:
   ```tsx
   // App.tsx (or src/navigation/RootNavigator.tsx)
   import NewScreen from '@ui/screens/NewScreen';

   <Stack.Screen name="NewScreen" component={NewScreen} />
   ```

4. **Navigate to screen**:
   ```tsx
   import { useNavigation } from '@react-navigation/native';

   const navigation = useNavigation();
   navigation.navigate('NewScreen');
   ```

### Creating a New Component

1. **Create component file**:
   ```bash
   mkdir -p src/ui/components/MyComponent
   touch src/ui/components/MyComponent/MyComponent.tsx
   touch src/ui/components/MyComponent/index.ts
   ```

2. **Write component**:
   ```tsx
   // src/ui/components/MyComponent/MyComponent.tsx
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';

   interface MyComponentProps {
     title: string;
   }

   export default function MyComponent({ title }: MyComponentProps) {
     return (
       <View style={styles.container}>
         <Text>{title}</Text>
       </View>
     );
   }

   const styles = StyleSheet.create({
     container: { padding: 16 },
   });
   ```

3. **Export from index.ts**:
   ```typescript
   // src/ui/components/MyComponent/index.ts
   export { default } from './MyComponent';
   ```

4. **Use in screens**:
   ```tsx
   import MyComponent from '@ui/components/MyComponent';

   <MyComponent title="Hello!" />
   ```

### Writing Unit Tests

1. **Create test file** (co-located with source):
   ```bash
   mkdir src/engine/dice/__tests__
   touch src/engine/dice/__tests__/DiceRoller.test.ts
   ```

2. **Write test**:
   ```typescript
   // src/engine/dice/__tests__/DiceRoller.test.ts
   import { DiceRoller } from '../DiceRoller';

   describe('DiceRoller', () => {
     test('rolls a number between 1 and 6', () => {
       const roller = new DiceRoller();
       const result = roller.roll();

       expect(result).toBeGreaterThanOrEqual(1);
       expect(result).toBeLessThanOrEqual(6);
     });

     test('mock random for deterministic tests', () => {
       jest.spyOn(Math, 'random').mockReturnValue(0.99);
       const roller = new DiceRoller();
       expect(roller.roll()).toBe(6);

       jest.restoreAllMocks();
     });
   });
   ```

3. **Run tests**:
   ```bash
   # Run all tests
   npm test

   # Run tests in watch mode
   npm test -- --watch

   # Run tests with coverage
   npm test -- --coverage
   ```

### Debugging Performance Issues

1. **Enable React DevTools profiler**:
   ```bash
   # Install React DevTools globally
   npm install -g react-devtools
   ```

2. **Profile app**:
   - Open app in Expo
   - Shake device (or press `Cmd+D` in simulator)
   - Select "Toggle Performance Monitor"
   - Watch FPS, Memory, CPU usage

3. **Use Flipper** (advanced debugging):
   ```bash
   # Install Flipper
   # Download: https://fbflipper.com/

   # Run Expo in dev client mode (bare workflow required)
   # See docs: https://docs.expo.dev/workflow/debugging/
   ```

4. **Common performance fixes**:
   - Use `React.memo()` for expensive components
   - Use `useMemo()` for expensive calculations
   - Use `useCallback()` for event handlers
   - Optimize FlatList with `getItemLayout`
   - Profile animations with React Native Reanimated's `measurePerformance()`

---

## Development Workflow

### 1. Daily Development Loop

```bash
# Start dev server
npm start

# In another terminal: Run tests in watch mode
npm test -- --watch

# Edit code → Save → Auto-reload in Expo Go
# Write tests → Save → Auto-run tests

# Before committing: Lint and format
npm run lint
npm run format
```

### 2. Hot Reload vs Fast Refresh

- **Fast Refresh** (default): Preserves component state on code changes
- **Full Reload**: Press `r` in Expo terminal (resets all state)

**When to Full Reload**:
- Changed navigation structure
- Modified global state stores
- Added new native dependencies

### 3. Debugging

**Console Logs**:
- Visible in Expo terminal
- Use `console.log()`, `console.warn()`, `console.error()`

**React Native Debugger**:
1. Shake device → "Debug"
2. Opens Chrome DevTools
3. Set breakpoints in source code
4. Inspect state with React DevTools

**Expo Dev Menu**:
- Physical device: Shake
- iOS Simulator: `Cmd+D`
- Android Emulator: `Cmd+M` (macOS) or `Ctrl+M` (Windows)

---

## Troubleshooting

### "Metro bundler error: Cannot find module"

**Cause**: Missing dependency or cached build

**Fix**:
```bash
# Clear Metro cache
npx expo start --clear

# Or delete cache manually
rm -rf node_modules/.cache
```

### "Expo Go app: Unable to connect to development server"

**Cause**: Device not on same WiFi or firewall blocking

**Fix**:
1. Ensure device and computer on same network
2. Disable VPN on computer
3. Check firewall settings (allow port 19000)
4. Use tunnel mode: `npx expo start --tunnel` (slower)

### "Android emulator: App keeps crashing"

**Cause**: Out of memory or incompatible API level

**Fix**:
1. Increase emulator RAM (AVD Manager → Edit → Advanced → RAM)
2. Use API 33 (Android 13) or higher
3. Wipe emulator data: AVD Manager → Wipe Data

### "TypeScript error: Cannot find module '@engine/dice'"

**Cause**: Path aliases not configured

**Fix**:
1. Check `tsconfig.json` has paths configured:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@engine/*": ["src/engine/*"],
         "@ui/*": ["src/ui/*"]
       }
     }
   }
   ```
2. Restart TypeScript server in VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

### "Tests failing: Cannot find module"

**Cause**: Jest not configured for path aliases

**Fix**:
Add to `jest.config.js`:
```javascript
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@engine/(.*)$': '<rootDir>/src/engine/$1',
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@state/(.*)$': '<rootDir>/src/state/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
  },
};
```

---

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run specific test file
npm test DiceRoller.test.ts

# Run tests in watch mode
npm test -- --watch

# Run with coverage report
npm test -- --coverage
```

### Integration Tests

```bash
# Run integration tests (full game scenarios)
npm run test:integration
```

### End-to-End Tests (Detox)

```bash
# Build app for testing (first time only)
npm run test:e2e:build

# Run E2E tests
npm run test:e2e
```

---

## Code Quality Checks

### Linting (ESLint)

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Formatting (Prettier)

```bash
# Check formatting
npm run format:check

# Auto-format code
npm run format
```

### Type Checking (TypeScript)

```bash
# Check TypeScript types (no output = success)
npm run type-check
```

---

## Building for Production

### Android (Development Build)

```bash
# Build APK for testing
eas build --profile development --platform android
```

### Android (Production Build)

```bash
# Build AAB for Play Store
eas build --profile production --platform android
```

**Note**: Requires Expo Application Services (EAS) account.
See `docs/deployment.md` for full Play Store deployment guide.

---

## Resources

### Documentation

- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/docs/getting-started
- **React Navigation**: https://reactnavigation.org/docs/getting-started
- **Zustand**: https://docs.pmnd.rs/zustand/getting-started/introduction

### Project Documentation

- **Ludo Rules**: `docs/rules.md`
- **Architecture**: `docs/architecture.md`
- **Deployment Guide**: `docs/deployment.md`
- **Constitution**: `.specify/memory/constitution.md`

### Community

- **Expo Forums**: https://forums.expo.dev/
- **React Native Community**: https://reactnative.dev/community/overview
- **Project Issues**: (Your GitHub repository issues)

---

## Next Steps

Now that your development environment is running:

1. ✅ **Explore the codebase** (start with `src/ui/screens/HomeScreen.tsx`)
2. ✅ **Read the constitution** (`.specify/memory/constitution.md`)
3. ✅ **Review feature specs** (`specs/001-project-setup/spec.md`)
4. ✅ **Run the test suite** (`npm test`)
5. ✅ **Make a small change** (edit HomeScreen, save, see hot reload)
6. ✅ **Create your first PR** (follow PR template in `.github/pull_request_template.md`)

**Ready to contribute?** Check the task board (`specs/<feature>/tasks.md`) for available tasks!

---

**Quickstart Guide**: ✅ **COMPLETE**
**Estimated Setup Time**: 15 minutes
**Author**: Farhat Naz
**Last Updated**: 2025-12-25

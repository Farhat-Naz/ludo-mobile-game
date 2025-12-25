# Local Development Guide

Quick guide to run the Ludo game on your local machine.

---

## 🚀 Quick Start

### Prerequisites

**Required**:
- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager

**Optional** (for mobile emulators):
- Android Studio (for Android emulator)
- Xcode (for iOS simulator - macOS only)

---

## 📦 Installation & Setup

### Step 1: Navigate to Project

```bash
# Open terminal and go to project directory
cd "D:\quarterr 4\game\game-ludo\ludo-game"
```

### Step 2: Install Dependencies

```bash
# Install all dependencies (first time only)
npm install --legacy-peer-deps

# This installs:
# - React Native & Expo
# - All game dependencies
# - Development tools
```

**Note**: Use `--legacy-peer-deps` to resolve dependency conflicts.

---

## 🎮 Running the Game

### Option 1: Web Browser (Easiest!)

**Best for**: Quick testing, works on any platform

```bash
# Start web development server
npm run web

# Or using Expo directly
npx expo start --web
```

**What happens**:
- Development server starts
- Browser opens automatically at `http://localhost:8081`
- Game loads in browser window

**Controls**:
- Click to interact (simulates touch)
- F12 to open DevTools
- Ctrl+Shift+M for mobile view

---

### Option 2: Android Emulator

**Best for**: Testing Android-specific features (haptics, etc.)

#### Setup Android Emulator (One-time)

1. **Install Android Studio**: https://developer.android.com/studio
2. **Open Android Studio** → More Actions → Virtual Device Manager
3. **Create Virtual Device**:
   - Phone: Pixel 5 or similar
   - System Image: Android 13 (API 33) or higher
   - Click Finish
4. **Launch Emulator**: Click ▶️ play button

#### Run on Android

```bash
# Start development server
npm start

# Then press 'a' for Android
# OR run directly:
npm run android
```

**What happens**:
- Expo development server starts
- App builds and installs on emulator
- Game launches automatically
- Hot reload enabled (changes appear instantly)

---

### Option 3: iOS Simulator (macOS Only)

**Best for**: Testing iOS-specific behavior

#### Setup iOS Simulator (One-time)

1. **Install Xcode**: From Mac App Store (large download!)
2. **Install Command Line Tools**:
   ```bash
   xcode-select --install
   ```
3. **Install iOS Simulator**:
   ```bash
   npx expo install --ios
   ```

#### Run on iOS

```bash
# Start development server
npm start

# Then press 'i' for iOS
# OR run directly:
npm run ios
```

---

### Option 4: Physical Device (Real Phone/Tablet)

**Best for**: Real-world testing with actual touch and haptics

#### Install Expo Go App

**Android**: https://play.google.com/store/apps/details?id=host.exp.exponent
**iOS**: https://apps.apple.com/app/expo-go/id982107779

#### Connect Your Device

```bash
# Start development server
npm start

# A QR code will appear in terminal
# Scan with Expo Go app (Android) or Camera app (iOS)
```

**What happens**:
- Development server starts
- QR code displayed
- Scan with phone
- App loads in Expo Go
- Full features including haptics!

---

## 🎯 Development Server Commands

After running `npm start`, you'll see:

```
Metro waiting on exp://192.168.x.x:8081

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

**Common commands**:
- `a` - Open Android emulator
- `i` - Open iOS simulator (macOS)
- `w` - Open web browser
- `r` - Reload app
- `Ctrl+C` - Stop server

---

## 🧪 Running Tests

### Run All Tests

```bash
# Run all engine tests
npm test

# With coverage report
npm test -- --coverage

# Watch mode (re-runs on file changes)
npm test -- --watch
```

### Run Specific Tests

```bash
# Run only dice tests
npm test -- dice

# Run only board tests
npm test -- board

# Run only token tests
npm test -- tokens
```

---

## 🔍 Type Checking

```bash
# Check TypeScript types
npm run type-check

# This validates all TypeScript without building
```

---

## 🎨 Code Quality

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

---

## 📱 Platform-Specific Features

### Web Browser
- ✅ Full game logic
- ✅ Animations (slightly reduced performance)
- ✅ Audio (after user interaction)
- ❌ Haptic feedback (not available)

### Android Emulator
- ✅ Full game logic
- ✅ Smooth animations
- ✅ Audio
- ⚠️ Haptics (works but feels different than real device)

### iOS Simulator
- ✅ Full game logic
- ✅ Smooth animations
- ✅ Audio
- ❌ Haptics (not available in simulator)

### Physical Device
- ✅ Everything works perfectly!
- ✅ Real haptic feedback
- ✅ Best performance

---

## 🐛 Troubleshooting

### "npm install" fails

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Port 8081 already in use

**Solution**:
```bash
# Kill process on port 8081
npx kill-port 8081

# Or use different port
npx expo start --port 8082
```

### Android emulator won't connect

**Solution**:
```bash
# Check adb connection
adb devices

# Restart adb
adb kill-server
adb start-server

# Restart development server
npm start
```

### "Module not found" errors

**Solution**:
```bash
# Clear Metro bundler cache
npx expo start --clear

# Or clear all caches
rm -rf node_modules .expo .expo-shared
npm install --legacy-peer-deps
```

### Web version won't start

**Solution**:
```bash
# Ensure web dependencies installed
npm install react-native-web react-dom --legacy-peer-deps

# Clear cache and restart
npx expo start --web --clear
```

### TypeScript errors

**Solution**:
```bash
# Check for errors
npm run type-check

# Common fix: restart TS server in VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

## 🔥 Hot Reload

Development server has **hot reload** enabled:

- Edit any `.tsx` or `.ts` file
- Save the file
- Changes appear instantly (no manual reload!)
- Game state persists during reload

**Disable hot reload** (if needed):
```bash
npx expo start --no-dev
```

---

## 📊 Performance Monitoring

### Enable Performance Monitor

**Android/iOS**:
- Shake device (physical)
- Press `m` in terminal (emulator)
- Select "Show Performance Monitor"

**Web**:
- F12 → Performance tab
- React DevTools extension

### FPS Counter

Shows current frame rate:
- Open dev menu (shake device or press `m`)
- Enable "Show FPS Monitor"
- See real-time FPS in corner

---

## 🎮 Game Controls

### Desktop/Web
- **Mouse Click**: Tap/select tokens
- **Click Dice**: Roll dice
- **Click Move**: Move selected token

### Mobile/Touch
- **Tap**: Select token
- **Tap Dice**: Roll dice
- **Tap Token Again**: Move token

### Keyboard (Development)
- **R**: Reload app
- **D**: Open dev menu
- **Ctrl+C**: Stop server

---

## 📁 Project Structure

```
ludo-game/
├── src/
│   ├── engine/          # Game logic (pure TypeScript)
│   ├── ui/              # React Native components
│   ├── state/           # Zustand store
│   ├── services/        # Haptics, audio, AI
│   └── utils/           # Constants, helpers
├── assets/              # Images, icons
├── App.tsx              # Entry point
└── package.json         # Dependencies
```

**Key files**:
- `App.tsx` - App entry point
- `src/ui/screens/GameScreen.tsx` - Main game screen
- `src/state/gameStore.ts` - Game state management
- `src/engine/` - All game rules and logic

---

## 🛠️ VS Code Setup (Recommended)

### Extensions

1. **ES7+ React/Redux/React-Native**: Code snippets
2. **Prettier**: Code formatting
3. **ESLint**: Linting
4. **React Native Tools**: Debugging

### Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 📝 Available Scripts

```bash
# Development
npm start              # Start Expo dev server
npm run web            # Start web version
npm run android        # Run on Android
npm run ios            # Run on iOS (macOS only)

# Code Quality
npm run lint           # Check for lint errors
npm run lint:fix       # Fix auto-fixable issues
npm run format         # Format code with Prettier
npm run type-check     # Check TypeScript types

# Testing
npm test               # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run with coverage report

# Build
npm run build:web      # Build for web (Vercel)
```

---

## 🎯 Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] Navigate to `ludo-game/` folder
- [ ] Run `npm install --legacy-peer-deps`
- [ ] Run `npm run web` for browser
- [ ] Game opens at http://localhost:8081
- [ ] Play and enjoy!

---

## 🆘 Getting Help

**Issues**:
1. Check this troubleshooting section
2. Clear cache: `npx expo start --clear`
3. Reinstall: `rm -rf node_modules && npm install --legacy-peer-deps`

**Documentation**:
- Expo Docs: https://docs.expo.dev/
- React Native Docs: https://reactnative.dev/

**Your Project**:
- Tests: 109 passing ✅
- TypeScript: Clean ✅
- All dependencies: Installed ✅

---

## 🎉 You're Ready!

The easiest way to start:

```bash
cd "D:\quarterr 4\game\game-ludo\ludo-game"
npm run web
```

Game will open in your browser in seconds!

**Enjoy developing!** 🎮

# Ludo Game - Mobile Edition

A classic Ludo board game implementation for mobile devices, built with React Native and Expo. Experience the timeless strategy game with colorblind-accessible design, smooth animations, and intelligent AI opponents.

## Technology Stack

- **React Native** with **Expo SDK 52** - Cross-platform mobile framework
- **TypeScript 5.x** - Type-safe development
- **Zustand** - Lightweight state management (1KB)
- **AsyncStorage + expo-sqlite** - Hybrid persistence strategy
- **React Navigation** - Type-safe navigation
- **React Native Reanimated v3** - 60 FPS animations
- **Jest + fast-check** - Unit and property-based testing
- **Detox** - End-to-end testing
- **ESLint + Prettier** - Code quality and formatting

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Git** - Version control
- **Expo CLI** (optional) - `npm install -g expo-cli`
- **Android Studio** (for Android development) - [Download](https://developer.android.com/studio)
- **Xcode** (for iOS development, macOS only) - [Download](https://developer.apple.com/xcode/)

## Installation

Quick setup in 4 steps:

```bash
# 1. Clone the repository
git clone <repository-url>
cd ludo-game

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start

# 4. Run on your device
# Press 'a' for Android emulator
# Press 'i' for iOS simulator (macOS only)
# Scan QR code with Expo Go app for physical device
```

## Expo SDK 52 Installation

### Requirements

- Node.js 18 or higher
- Expo Go app on your mobile device (optional for testing on physical devices)

### Install Expo CLI (Optional)

```bash
npm install -g expo-cli
```

### Download Expo Go App

- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Android Emulator Setup

### 1. Install Android Studio

Download and install Android Studio from [developer.android.com/studio](https://developer.android.com/studio)

### 2. Create Android Virtual Device (AVD)

1. Open Android Studio
2. Go to **Tools > Device Manager**
3. Click **Create Device**
4. Select **Pixel 5** as the device
5. Select **API Level 33** (Android 13.0) as the system image
6. Click **Finish**

### 3. Launch Emulator

```bash
# Option 1: From Android Studio
# Click the play button next to your AVD in Device Manager

# Option 2: From command line
emulator -avd Pixel_5_API_33

# Option 3: Let Expo launch it automatically
npx expo start
# Press 'a' when prompted
```

## iOS Simulator Setup (macOS Only)

### 1. Install Xcode

Download Xcode from the Mac App Store or [developer.apple.com](https://developer.apple.com/xcode/)

### 2. Install Command Line Tools

```bash
xcode-select --install
```

### 3. Launch Simulator

The iOS Simulator will launch automatically when you press 'i' in the Expo development server:

```bash
npx expo start
# Press 'i' when prompted
```

## Running Locally

### Start Development Server

```bash
npm start
```

This will start the Expo development server and display a QR code in your terminal.

### Run on Android Emulator

```bash
npm run android
# or press 'a' in the Expo terminal
```

### Run on iOS Simulator (macOS only)

```bash
npm run ios
# or press 'i' in the Expo terminal
```

### Run on Physical Device

1. Install **Expo Go** app on your device
2. Scan the QR code displayed in the terminal
3. App will load on your device

## Directory Structure

```
ludo-game/
├── src/
│   ├── engine/           # Framework-agnostic game logic
│   │   └── __tests__/    # Engine unit tests
│   ├── ui/               # React Native components
│   │   ├── screens/      # Screen components
│   │   └── components/   # Reusable UI components
│   ├── state/            # Zustand state stores
│   ├── services/         # Platform services (audio, haptics, storage)
│   ├── utils/            # Shared utilities and constants
│   └── types/            # TypeScript type definitions
│       └── contracts/    # Interface contracts
├── tests/                # Test configuration and setup
├── specs/                # Feature specifications and planning
├── docs/                 # Additional documentation
├── .specify/             # Development tools and templates
└── history/              # Development history and ADRs
```

## Development Workflow

### Code Quality Commands

```bash
# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm run test:coverage
```

### Development Cycle

1. **Create feature branch**: `git checkout -b feature/my-feature`
2. **Write tests first**: Follow TDD approach
3. **Implement feature**: Keep changes focused and small
4. **Run quality checks**: `npm run lint && npm run type-check && npm test`
5. **Commit changes**: Use conventional commit messages
6. **Create pull request**: Follow PR template checklist

## Troubleshooting

### 1. Metro Bundler Errors

**Problem**: "Metro bundler failed to start" or "Port 8081 already in use"

**Solution**:
```bash
# Kill the process using port 8081
npx kill-port 8081

# Clear Metro cache
npx expo start -c
```

### 2. Unable to Connect to Dev Server

**Problem**: "Unable to connect to development server" on device

**Solution**:
- Ensure device and computer are on the same Wi-Fi network
- Disable firewall temporarily
- Try using tunnel mode: `npx expo start --tunnel`

### 3. Android Emulator Crashes

**Problem**: Emulator crashes or freezes on launch

**Solution**:
```bash
# Wipe emulator data
emulator -avd Pixel_5_API_33 -wipe-data

# Increase emulator RAM in AVD settings (4GB recommended)
# In Android Studio: Device Manager > Edit AVD > Advanced Settings > RAM
```

### 4. TypeScript Path Alias Errors

**Problem**: "Cannot find module '@engine/...' or '@ui/...'"

**Solution**:
- Restart TypeScript server in VS Code: `Cmd+Shift+P` > "Restart TS Server"
- Verify `tsconfig.json` has correct path mappings
- Clear Metro cache: `npx expo start -c`

### 5. Test Failures

**Problem**: Tests fail with "Cannot find module" or timeout errors

**Solution**:
```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests with verbose output
npm test -- --verbose

# Verify test setup file exists
cat tests/setup.js
```

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Project Status

- **Current Phase**: Project Setup (Feature 001)
- **Version**: 1.0.0
- **Status**: In Development

For detailed feature specifications, see [specs/001-project-setup/](./specs/001-project-setup/).

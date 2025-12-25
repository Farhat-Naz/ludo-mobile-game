# User Interface

React Native components, screens, and animations for the Ludo mobile game.

## Purpose

The UI module contains all visual components and user interaction logic. It's responsible for:

- Rendering game screens (Welcome, Game Board, Settings, etc.)
- Displaying game state visually
- Handling user input (touch, gestures)
- Animations and transitions
- Navigation between screens

## Directory Structure

```
src/ui/
├── screens/        # Full-screen components (WelcomeScreen, GameScreen, etc.)
├── components/     # Reusable UI components (Button, Card, Token, Board, etc.)
├── animations/     # Animation utilities and configurations
└── __tests__/      # Component tests with React Native Testing Library
```

## Screens vs Components

### Screens

Screens are full-page views registered with React Navigation:

```
src/ui/screens/
├── WelcomeScreen.tsx       # Initial landing page
├── GameScreen.tsx          # Main game board view
├── SettingsScreen.tsx      # Game settings and preferences
├── ProfileScreen.tsx       # Player profile and statistics
└── HowToPlayScreen.tsx     # Tutorial and rules
```

### Components

Components are reusable UI elements:

```
src/ui/components/
├── board/
│   ├── BoardView.tsx       # Main board layout
│   ├── PathCell.tsx        # Individual board cells
│   └── SafeZone.tsx        # Safe zone areas
├── tokens/
│   ├── Token.tsx           # Animated token piece
│   └── TokenCounter.tsx    # Token count display
├── dice/
│   ├── DiceView.tsx        # Animated dice
│   └── DiceButton.tsx      # Rollable dice button
├── common/
│   ├── Button.tsx          # Primary button
│   ├── Card.tsx            # Card container
│   └── Modal.tsx           # Modal dialog
└── player/
    ├── PlayerAvatar.tsx    # Player icon
    └── ScoreBoard.tsx      # Current scores
```

## Navigation Structure

Using React Navigation with type-safe routing:

```typescript
// src/types/contracts/navigation.contract.ts
export type RootStackParamList = {
  Home: undefined;
  Game: { playerCount: number; difficulty?: 'easy' | 'medium' | 'hard' };
  Settings: undefined;
  Profile: undefined;
  HowToPlay: undefined;
};

// Usage in screens
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@types/contracts/navigation.contract';

type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;

export default function GameScreen({ route, navigation }: GameScreenProps) {
  const { playerCount, difficulty } = route.params;
  // ...
}
```

## Animation Guidelines

### Using React Native Reanimated v3

Prefer Reanimated for 60 FPS animations:

```typescript
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

function AnimatedToken({ position }: { position: number }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const moveToken = (newX: number, newY: number) => {
    translateX.value = withSpring(newX);
    translateY.value = withSpring(newY);
  };

  return <Animated.View style={[styles.token, animatedStyle]} />;
}
```

### Animation Timings

Use consistent timing values from constants:

```typescript
import { ANIMATION_TIMINGS } from '@utils/constants';

// Token movement
withTiming(newPosition, { duration: ANIMATION_TIMINGS.TOKEN_MOVE });

// Dice roll
withSpring(rotation, { damping: ANIMATION_TIMINGS.DICE_ROLL });

// Screen transitions
withTiming(opacity, { duration: ANIMATION_TIMINGS.SCREEN_TRANSITION });
```

## Styling Guidelines

### StyleSheet API

Always use React Native's StyleSheet.create():

```typescript
import { StyleSheet } from 'react-native';
import { THEME_COLORS } from '@utils/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  button: {
    backgroundColor: THEME_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
```

### Colorblind Accessibility

Use colorblind-safe colors and patterns:

```typescript
import { getPlayerColor, getPlayerPattern } from '@utils/colors';
import type { PlayerColor } from '@types/contracts/state-store.contract';

function renderToken(color: PlayerColor) {
  const colorConfig = getPlayerColor(color);
  const pattern = getPlayerPattern(color);

  return (
    <View style={{ backgroundColor: colorConfig.primary }}>
      {/* Render pattern overlay for colorblind users */}
      <PatternOverlay type={pattern} />
    </View>
  );
}
```

### Responsive Design

Handle different screen sizes:

```typescript
import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
const scale = width / 375; // Base width (iPhone 11)

function normalize(size: number): number {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
}

const styles = StyleSheet.create({
  title: {
    fontSize: normalize(24),
  },
});
```

## Component Examples

### Basic Screen

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME_COLORS } from '@utils/colors';

export default function MyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME_COLORS.text.primary,
  },
});
```

### Interactive Component

```typescript
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { THEME_COLORS } from '@utils/colors';
import { rollDice } from '@engine/dice/rollDice';

export default function DiceButton() {
  const [result, setResult] = useState<number | null>(null);

  const handleRoll = () => {
    const roll = rollDice(); // Call engine logic
    setResult(roll);
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleRoll}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>
        {result !== null ? `Rolled: ${result}` : 'Roll Dice'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: THEME_COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: THEME_COLORS.text.inverse,
    fontSize: 18,
    fontWeight: '600',
  },
});
```

## Testing UI Components

Use React Native Testing Library:

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import DiceButton from '../DiceButton';

describe('DiceButton', () => {
  it('displays roll result when pressed', () => {
    const { getByText } = render(<DiceButton />);

    const button = getByText('Roll Dice');
    fireEvent.press(button);

    // Should show a number between 1 and 6
    expect(getByText(/Rolled: [1-6]/)).toBeTruthy();
  });
});
```

## State Management Integration

Connect to Zustand stores:

```typescript
import { useGameStore } from '@state/stores/gameStore';

function GameScreen() {
  const currentPlayer = useGameStore((state) => state.currentPlayer);
  const rollDice = useGameStore((state) => state.actions.rollDice);

  return (
    <View>
      <Text>Current Player: {currentPlayer}</Text>
      <Button onPress={rollDice} title="Roll Dice" />
    </View>
  );
}
```

## Platform Services

Use services for platform-specific features:

```typescript
import { playSound } from '@services/audio/audioService';
import { triggerHaptic } from '@services/haptics/hapticService';

function DiceButton() {
  const handleRoll = async () => {
    await triggerHaptic('medium');
    await playSound('dice-roll');
    const result = rollDice();
    // ...
  };
}
```

## Best Practices

### 1. Component Composition

Build complex UIs from simple components:

```typescript
function GameBoard() {
  return (
    <View style={styles.board}>
      <PathCells />
      <SafeZones />
      <HomeAreas />
      <Tokens />
    </View>
  );
}
```

### 2. Performance Optimization

Use React.memo for expensive components:

```typescript
const Token = React.memo(({ id, position, color }: TokenProps) => {
  // Only re-renders when props change
  return <AnimatedToken position={position} color={color} />;
});
```

### 3. Accessibility

Add accessibility props:

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Roll Dice"
  accessibilityHint="Tap to roll the dice"
  accessibilityRole="button"
>
  <Text>Roll</Text>
</TouchableOpacity>
```

## Dependencies

UI code can import from:

- `@engine/*` - Game logic (read-only, never modify engine state)
- `@state/*` - State management stores
- `@services/*` - Platform services
- `@utils/*` - Utilities and constants
- `@types/*` - Type definitions
- `@navigation/*` - Navigation utilities
- `react-native` - React Native core
- `expo-*` - Expo modules
- `@react-navigation/*` - Navigation
- `react-native-reanimated` - Animations

UI code **should not** modify engine state directly - always go through state stores.

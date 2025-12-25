# Platform Services

Service layer for platform-specific functionality (audio, haptics, storage, analytics).

## Purpose

Services provide abstraction over platform-specific APIs and external dependencies. This layer:

- Encapsulates Expo modules (audio, haptics, etc.)
- Provides consistent interfaces for platform features
- Enables dependency injection for testing
- Isolates platform code from business logic

## Directory Structure

```
src/services/
├── audio/
│   ├── audioService.ts         # Sound and music playback
│   └── __tests__/
├── haptics/
│   ├── hapticService.ts        # Vibration feedback
│   └── __tests__/
├── storage/
│   ├── asyncStorageService.ts  # Key-value persistence
│   ├── sqliteService.ts        # Relational data persistence
│   └── __tests__/
├── analytics/
│   ├── analyticsService.ts     # Usage tracking (optional)
│   └── __tests__/
└── notifications/
    ├── notificationService.ts  # Local notifications
    └── __tests__/
```

## Service Interfaces

All services follow the dependency injection pattern with interfaces:

```typescript
// Define interface in contracts
export interface IAudioService {
  playSound(soundId: string): Promise<void>;
  playMusic(trackId: string): Promise<void>;
  stopMusic(): Promise<void>;
  setVolume(type: 'sfx' | 'music', volume: number): Promise<void>;
  cleanup(): Promise<void>;
}

// Implement service
import { Audio } from 'expo-av';
import type { IAudioService } from '@types/contracts/services.contract';

export class AudioService implements IAudioService {
  private sounds: Map<string, Audio.Sound> = new Map();
  private music: Audio.Sound | null = null;

  async playSound(soundId: string): Promise<void> {
    // Implementation
  }

  async playMusic(trackId: string): Promise<void> {
    // Implementation
  }

  // ... other methods
}

// Export singleton instance
export const audioService = new AudioService();
```

## Audio Service

```typescript
// src/services/audio/audioService.ts
import { Audio, AVPlaybackStatus } from 'expo-av';
import type { IAudioService } from '@types/contracts/services.contract';

const SOUND_FILES = {
  'dice-roll': require('../../../assets/sounds/dice-roll.mp3'),
  'token-move': require('../../../assets/sounds/token-move.mp3'),
  'token-cut': require('../../../assets/sounds/token-cut.mp3'),
  'win': require('../../../assets/sounds/win.mp3'),
} as const;

const MUSIC_FILES = {
  'background': require('../../../assets/music/background.mp3'),
} as const;

export class AudioService implements IAudioService {
  private sounds: Map<string, Audio.Sound> = new Map();
  private music: Audio.Sound | null = null;
  private sfxVolume: number = 0.8;
  private musicVolume: number = 0.7;

  async initialize(): Promise<void> {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    // Preload sounds
    for (const [id, source] of Object.entries(SOUND_FILES)) {
      const { sound } = await Audio.Sound.createAsync(source);
      this.sounds.set(id, sound);
    }
  }

  async playSound(soundId: string): Promise<void> {
    const sound = this.sounds.get(soundId);
    if (!sound) {
      console.warn(`Sound not found: ${soundId}`);
      return;
    }

    await sound.setPositionAsync(0); // Rewind to start
    await sound.setVolumeAsync(this.sfxVolume);
    await sound.playAsync();
  }

  async playMusic(trackId: string): Promise<void> {
    if (this.music) {
      await this.music.stopAsync();
      await this.music.unloadAsync();
    }

    const source = MUSIC_FILES[trackId as keyof typeof MUSIC_FILES];
    if (!source) {
      console.warn(`Music track not found: ${trackId}`);
      return;
    }

    const { sound } = await Audio.Sound.createAsync(source, {
      isLooping: true,
      volume: this.musicVolume,
    });

    this.music = sound;
    await sound.playAsync();
  }

  async stopMusic(): Promise<void> {
    if (this.music) {
      await this.music.stopAsync();
    }
  }

  async setVolume(type: 'sfx' | 'music', volume: number): Promise<void> {
    const clampedVolume = Math.max(0, Math.min(1, volume));

    if (type === 'sfx') {
      this.sfxVolume = clampedVolume;
    } else {
      this.musicVolume = clampedVolume;
      if (this.music) {
        await this.music.setVolumeAsync(clampedVolume);
      }
    }
  }

  async cleanup(): Promise<void> {
    // Unload all sounds
    for (const sound of this.sounds.values()) {
      await sound.unloadAsync();
    }
    this.sounds.clear();

    if (this.music) {
      await this.music.unloadAsync();
      this.music = null;
    }
  }
}

export const audioService = new AudioService();
```

## Haptic Service

```typescript
// src/services/haptics/hapticService.ts
import * as Haptics from 'expo-haptics';
import type { IHapticService } from '@types/contracts/services.contract';

export class HapticService implements IHapticService {
  private enabled: boolean = true;

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  async triggerLight(): Promise<void> {
    if (!this.enabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async triggerMedium(): Promise<void> {
    if (!this.enabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  async triggerHeavy(): Promise<void> {
    if (!this.enabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  async triggerSuccess(): Promise<void> {
    if (!this.enabled) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async triggerWarning(): Promise<void> {
    if (!this.enabled) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  async triggerError(): Promise<void> {
    if (!this.enabled) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
}

export const hapticService = new HapticService();
```

## Storage Services

### AsyncStorage Service

```typescript
// src/services/storage/asyncStorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { IAsyncStorageService } from '@types/contracts/services.contract';

export class AsyncStorageService implements IAsyncStorageService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error reading from AsyncStorage: ${key}`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to AsyncStorage: ${key}`, error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from AsyncStorage: ${key}`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage', error);
    }
  }
}

export const asyncStorageService = new AsyncStorageService();
```

### SQLite Service

```typescript
// src/services/storage/sqliteService.ts
import * as SQLite from 'expo-sqlite';
import type { ISQLiteService } from '@types/contracts/services.contract';

export class SQLiteService implements ISQLiteService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync('ludo-game.db');

    // Create tables
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS game_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        players TEXT NOT NULL,
        winner TEXT,
        duration INTEGER,
        turns INTEGER,
        data TEXT
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        unlocked_at TEXT,
        progress INTEGER DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS idx_game_history_date ON game_history(date);
    `);
  }

  async saveGame(gameData: GameHistoryRecord): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT INTO game_history (date, players, winner, duration, turns, data)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        gameData.date,
        JSON.stringify(gameData.players),
        gameData.winner,
        gameData.duration,
        gameData.turns,
        JSON.stringify(gameData.data),
      ]
    );
  }

  async getGameHistory(limit: number = 50): Promise<GameHistoryRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<GameHistoryRecord>(
      `SELECT * FROM game_history ORDER BY date DESC LIMIT ?`,
      [limit]
    );

    return result.map((row) => ({
      ...row,
      players: JSON.parse(row.players as unknown as string),
      data: JSON.parse(row.data as unknown as string),
    }));
  }

  async cleanup(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export const sqliteService = new SQLiteService();
```

## Using Services

### In UI Components

```typescript
import { audioService } from '@services/audio/audioService';
import { hapticService } from '@services/haptics/hapticService';

function DiceButton() {
  const handleRoll = async () => {
    // Trigger haptic feedback
    await hapticService.triggerMedium();

    // Play sound
    await audioService.playSound('dice-roll');

    // Roll dice (game logic)
    const result = rollDice();
  };

  return <Button onPress={handleRoll} title="Roll Dice" />;
}
```

### In State Stores

```typescript
import { audioService } from '@services/audio/audioService';
import { sqliteService } from '@services/storage/sqliteService';

export const useGameStore = create<IGameStore>()((set, get) => ({
  actions: {
    finishGame: async () => {
      const { winner, duration, turns } = get();

      // Play win sound
      await audioService.playSound('win');

      // Save to database
      await sqliteService.saveGame({
        date: new Date().toISOString(),
        players: get().players,
        winner,
        duration,
        turns,
        data: {},
      });

      set({ phase: 'finished' });
    },
  },
}));
```

## Testing Services

### Mock Services for Tests

```typescript
// src/services/audio/__tests__/audioService.test.ts
import { AudioService } from '../audioService';

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    setAudioModeAsync: jest.fn(),
    Sound: {
      createAsync: jest.fn(() =>
        Promise.resolve({
          sound: {
            playAsync: jest.fn(),
            stopAsync: jest.fn(),
            setVolumeAsync: jest.fn(),
            setPositionAsync: jest.fn(),
            unloadAsync: jest.fn(),
          },
          status: {},
        })
      ),
    },
  },
}));

describe('AudioService', () => {
  let service: AudioService;

  beforeEach(() => {
    service = new AudioService();
  });

  it('plays sound with correct volume', async () => {
    await service.initialize();
    await service.setVolume('sfx', 0.5);
    await service.playSound('dice-roll');

    // Assert sound was played with volume 0.5
    expect(/* ... */).toBeCalled();
  });
});
```

### Dependency Injection in Tests

```typescript
// Test with mock service
const mockAudioService: IAudioService = {
  playSound: jest.fn(),
  playMusic: jest.fn(),
  stopMusic: jest.fn(),
  setVolume: jest.fn(),
  cleanup: jest.fn(),
};

// Inject into component
<DiceButton audioService={mockAudioService} />
```

## Best Practices

### 1. Interface-First Design

Always define service interfaces in contracts:

```typescript
// @types/contracts/services.contract.ts
export interface IMyService {
  doSomething(param: string): Promise<void>;
}

// Service implements interface
export class MyService implements IMyService {
  // ...
}
```

### 2. Error Handling

Services should handle errors gracefully:

```typescript
async playSound(soundId: string): Promise<void> {
  try {
    const sound = this.sounds.get(soundId);
    if (!sound) {
      console.warn(`Sound not found: ${soundId}`);
      return; // Graceful degradation
    }
    await sound.playAsync();
  } catch (error) {
    console.error(`Error playing sound: ${soundId}`, error);
    // Don't throw - audio failure shouldn't crash the app
  }
}
```

### 3. Singleton Pattern

Export singleton instances for most services:

```typescript
export const audioService = new AudioService();
```

### 4. Cleanup on Unmount

Services should provide cleanup methods:

```typescript
// In App.tsx
useEffect(() => {
  audioService.initialize();

  return () => {
    audioService.cleanup();
  };
}, []);
```

## Dependencies

Services can import from:

- `@types/*` - Type definitions
- `@utils/*` - Utilities
- `expo-*` - Expo modules
- `@react-native-async-storage/async-storage` - Storage
- Platform-specific libraries

Services **should not** import from:

- `@engine/*` - Business logic (services are called by engine/state, not vice versa)
- `@ui/*` - UI components
- `@state/*` - State stores (circular dependency)

/**
 * Audio Service
 * Manages sound effects for game events
 */

import { Audio } from 'expo-av';

let soundEffectsEnabled = true;

/**
 * Sound effect types
 */
export enum SoundEffect {
  DICE_ROLL = 'DICE_ROLL',
  TOKEN_MOVE = 'TOKEN_MOVE',
  TOKEN_CUT = 'TOKEN_CUT',
  WIN = 'WIN',
}

/**
 * Initialize audio system
 */
export async function initializeAudio(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
    });
  } catch (error) {
    console.error('Failed to initialize audio:', error);
  }
}

/**
 * Play sound effect
 * @param effect - Sound effect to play
 */
export async function playSoundEffect(effect: SoundEffect): Promise<void> {
  if (!soundEffectsEnabled) return;

  try {
    // TODO: Load actual sound files from assets
    // For now, this is a placeholder that won't play sounds
    console.log(`Playing sound effect: ${effect}`);

    // Example implementation (when sound files are added):
    // const { sound } = await Audio.Sound.createAsync(
    //   require(`@assets/sounds/${effect.toLowerCase()}.mp3`)
    // );
    // await sound.playAsync();
    // sound.setOnPlaybackStatusUpdate((status) => {
    //   if (status.isLoaded && status.didJustFinish) {
    //     sound.unloadAsync();
    //   }
    // });
  } catch (error) {
    console.error(`Failed to play sound effect ${effect}:`, error);
  }
}

/**
 * Enable sound effects
 */
export function enableSoundEffects(): void {
  soundEffectsEnabled = true;
}

/**
 * Disable sound effects
 */
export function disableSoundEffects(): void {
  soundEffectsEnabled = false;
}

/**
 * Check if sound effects are enabled
 */
export function areSoundEffectsEnabled(): boolean {
  return soundEffectsEnabled;
}

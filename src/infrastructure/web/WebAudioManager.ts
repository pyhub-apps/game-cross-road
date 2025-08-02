import { IAudioManager } from '../interfaces/IAudioManager';

/**
 * Web Audio Manager - Stub implementation for future audio support
 */
export class WebAudioManager implements IAudioManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private masterVolume: number = 1.0;
  private isMuted: boolean = false;

  constructor() {
    // Audio will be initialized on first user interaction
    console.log('WebAudioManager created (stub implementation)');
  }

  async loadSound(name: string, url: string): Promise<void> {
    // TODO: Implement audio loading
    console.log(`[Stub] Loading sound: ${name} from ${url}`);
  }

  playSound(name: string, volume: number = 1.0): void {
    // TODO: Implement sound playback
    console.log(`[Stub] Playing sound: ${name} at volume ${volume}`);
  }

  playMusic(name: string, volume: number = 1.0, loop: boolean = true): void {
    // TODO: Implement music playback
    console.log(`[Stub] Playing music: ${name} at volume ${volume}, loop: ${loop}`);
  }

  stopSound(name: string): void {
    // TODO: Implement sound stopping
    console.log(`[Stub] Stopping sound: ${name}`);
  }

  stopAllSounds(): void {
    // TODO: Implement stopping all sounds
    console.log('[Stub] Stopping all sounds');
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    console.log(`[Stub] Master volume set to: ${this.masterVolume}`);
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    console.log(`[Stub] Audio muted: ${this.isMuted}`);
  }

  /**
   * Initialize audio context on user interaction
   */
  private async initializeAudio(): Promise<void> {
    if (!this.audioContext) {
      try {
        this.audioContext = new AudioContext();
        console.log('AudioContext initialized');
      } catch (error) {
        console.error('Failed to create AudioContext:', error);
      }
    }
  }

  /**
   * Dispose of audio resources
   */
  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.sounds.clear();
    console.log('WebAudioManager disposed');
  }
}
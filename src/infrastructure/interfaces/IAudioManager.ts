export interface IAudioManager {
  /**
   * Load audio file
   */
  loadSound(name: string, url: string): Promise<void>;

  /**
   * Play sound effect
   */
  playSound(name: string, volume?: number): void;

  /**
   * Play background music
   */
  playMusic(name: string, volume?: number, loop?: boolean): void;

  /**
   * Stop specific sound
   */
  stopSound(name: string): void;

  /**
   * Stop all sounds
   */
  stopAllSounds(): void;

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void;

  /**
   * Mute/unmute all sounds
   */
  setMuted(muted: boolean): void;
}
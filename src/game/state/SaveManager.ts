export interface SaveData {
  highScore: number;
  lastPlayed: string;
  settings?: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    difficulty: 'easy' | 'normal' | 'hard';
  };
  statistics?: {
    totalGamesPlayed: number;
    totalScore: number;
    bestDistance: number;
    totalPlayTime: number;
  };
}

export class SaveManager {
  private static readonly SAVE_KEY = 'crossy_road_save';
  private static readonly SETTINGS_KEY = 'crossy_road_settings';

  /**
   * Save game data
   */
  static saveGameData(data: Partial<SaveData>): boolean {
    try {
      const existingData = this.loadGameData();
      const newData = { ...existingData, ...data, lastPlayed: new Date().toISOString() };
      
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(newData));
      return true;
    } catch (error) {
      console.error('Failed to save game data:', error);
      return false;
    }
  }

  /**
   * Load game data
   */
  static loadGameData(): SaveData {
    try {
      const saved = localStorage.getItem(this.SAVE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load game data:', error);
    }

    // Return default data
    return {
      highScore: 0,
      lastPlayed: new Date().toISOString(),
      settings: {
        soundEnabled: true,
        musicEnabled: true,
        difficulty: 'normal'
      },
      statistics: {
        totalGamesPlayed: 0,
        totalScore: 0,
        bestDistance: 0,
        totalPlayTime: 0
      }
    };
  }

  /**
   * Update statistics
   */
  static updateStatistics(updates: Partial<SaveData['statistics']>): void {
    const data = this.loadGameData();
    data.statistics = { ...data.statistics, ...updates };
    this.saveGameData(data);
  }

  /**
   * Update settings
   */
  static updateSettings(updates: Partial<SaveData['settings']>): void {
    const data = this.loadGameData();
    data.settings = { ...data.settings, ...updates };
    this.saveGameData(data);
  }

  /**
   * Clear all saved data
   */
  static clearAllData(): void {
    localStorage.removeItem(this.SAVE_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
  }

  /**
   * Export save data as JSON
   */
  static exportSaveData(): string {
    return JSON.stringify(this.loadGameData(), null, 2);
  }

  /**
   * Import save data from JSON
   */
  static importSaveData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      return this.saveGameData(data);
    } catch (error) {
      console.error('Failed to import save data:', error);
      return false;
    }
  }
}
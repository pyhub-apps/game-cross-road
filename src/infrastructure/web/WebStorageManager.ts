import { IStorageManager } from '../interfaces/IStorageManager';

export class WebStorageManager implements IStorageManager {
  private prefix: string;

  constructor(prefix: string = 'crossy_road_') {
    this.prefix = prefix;
  }

  async save(key: string, data: any): Promise<boolean> {
    try {
      const fullKey = this.prefix + key;
      const serialized = JSON.stringify(data);
      localStorage.setItem(fullKey, serialized);
      return true;
    } catch (error) {
      console.error(`Failed to save data for key '${key}':`, error);
      return false;
    }
  }

  async load<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.prefix + key;
      const data = localStorage.getItem(fullKey);
      
      if (data === null) {
        return null;
      }
      
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Failed to load data for key '${key}':`, error);
      return null;
    }
  }

  async remove(key: string): Promise<boolean> {
    try {
      const fullKey = this.prefix + key;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error(`Failed to remove data for key '${key}':`, error);
      return false;
    }
  }

  async clear(): Promise<boolean> {
    try {
      // Only clear items with our prefix
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    const fullKey = this.prefix + key;
    return localStorage.getItem(fullKey) !== null;
  }

  /**
   * Get storage size info
   */
  getStorageInfo(): { used: number; available: number } {
    let used = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          used += key.length + value.length;
        }
      }
    }
    
    // Estimate available storage (localStorage typically has 5-10MB limit)
    const estimatedTotal = 5 * 1024 * 1024; // 5MB in bytes
    
    return {
      used,
      available: estimatedTotal - used
    };
  }
}
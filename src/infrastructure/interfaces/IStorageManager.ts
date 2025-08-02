export interface IStorageManager {
  /**
   * Save data to storage
   */
  save(key: string, data: any): Promise<boolean>;

  /**
   * Load data from storage
   */
  load<T>(key: string): Promise<T | null>;

  /**
   * Remove data from storage
   */
  remove(key: string): Promise<boolean>;

  /**
   * Clear all stored data
   */
  clear(): Promise<boolean>;

  /**
   * Check if key exists
   */
  exists(key: string): Promise<boolean>;
}
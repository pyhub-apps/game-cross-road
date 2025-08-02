/**
 * Generic object pool for performance optimization
 * Reuses objects instead of creating new ones
 */
export class ObjectPool<T> {
  private available: T[] = [];
  private inUse: Set<T> = new Set();
  private createFn: () => T;
  private resetFn?: (item: T) => void;
  private maxSize: number;
  
  constructor(
    createFn: () => T,
    resetFn?: (item: T) => void,
    initialSize = 10,
    maxSize = 100
  ) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.available.push(createFn());
    }
  }
  
  /**
   * Get an object from the pool
   */
  acquire(): T {
    let item: T;
    
    if (this.available.length > 0) {
      item = this.available.pop()!;
    } else {
      item = this.createFn();
    }
    
    this.inUse.add(item);
    return item;
  }
  
  /**
   * Return an object to the pool
   */
  release(item: T): void {
    if (!this.inUse.has(item)) {
      console.warn('Attempting to release an item not from this pool');
      return;
    }
    
    this.inUse.delete(item);
    
    if (this.resetFn) {
      this.resetFn(item);
    }
    
    if (this.available.length < this.maxSize) {
      this.available.push(item);
    }
  }
  
  /**
   * Release all items back to the pool
   */
  releaseAll(): void {
    this.inUse.forEach(item => {
      if (this.resetFn) {
        this.resetFn(item);
      }
      if (this.available.length < this.maxSize) {
        this.available.push(item);
      }
    });
    this.inUse.clear();
  }
  
  /**
   * Get pool statistics
   */
  getStats(): { available: number; inUse: number; total: number } {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size
    };
  }
  
  /**
   * Clear the pool
   */
  clear(): void {
    this.available = [];
    this.inUse.clear();
  }
}
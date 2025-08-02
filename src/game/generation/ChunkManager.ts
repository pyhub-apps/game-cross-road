import { GeneratedLane } from '../interfaces/IMapGenerator'
import { MapGenerator } from './MapGenerator'

export interface Chunk {
  id: string
  startY: number
  endY: number
  lanes: GeneratedLane[]
}

/**
 * Manages map chunks for infinite procedural generation
 */
export class ChunkManager {
  private chunks: Map<string, Chunk> = new Map()
  private mapGenerator: MapGenerator
  private readonly CHUNK_SIZE = 20 // lanes per chunk
  private readonly ACTIVE_CHUNKS = 3 // number of chunks to keep active
  private readonly GENERATE_AHEAD = 10 // lanes to generate ahead of player
  
  constructor(mapGenerator: MapGenerator) {
    this.mapGenerator = mapGenerator
  }
  
  /**
   * Initialize with starting chunks
   */
  initialize(): void {
    // Generate initial chunks
    console.log('ChunkManager: Initializing', this.ACTIVE_CHUNKS, 'chunks')
    for (let i = 0; i < this.ACTIVE_CHUNKS; i++) {
      this.generateChunk(i * this.CHUNK_SIZE)
    }
    console.log('ChunkManager: Initialized with', this.chunks.size, 'chunks,', this.getStats().totalLanes, 'total lanes')
  }
  
  /**
   * Update chunks based on player position
   */
  update(playerY: number, difficulty: number): void {
    const currentChunkIndex = Math.floor(playerY / this.CHUNK_SIZE)
    const targetY = playerY + this.GENERATE_AHEAD
    const targetChunkIndex = Math.floor(targetY / this.CHUNK_SIZE)
    
    // Generate new chunks if needed
    for (let i = currentChunkIndex; i <= targetChunkIndex + 1; i++) {
      const chunkY = i * this.CHUNK_SIZE
      const chunkId = this.getChunkId(chunkY)
      
      if (!this.chunks.has(chunkId)) {
        this.generateChunk(chunkY, difficulty)
      }
    }
    
    // Remove old chunks that are too far behind
    const minY = (currentChunkIndex - 1) * this.CHUNK_SIZE
    this.cleanupOldChunks(minY)
  }
  
  /**
   * Get lanes within a Y range
   */
  getLanesInRange(minY: number, maxY: number): GeneratedLane[] {
    const lanes: GeneratedLane[] = []
    
    this.chunks.forEach(chunk => {
      chunk.lanes.forEach(lane => {
        if (lane.yPosition >= minY && lane.yPosition <= maxY) {
          lanes.push(lane)
        }
      })
    })
    
    return lanes.sort((a, b) => a.yPosition - b.yPosition)
  }
  
  /**
   * Get a specific lane by Y position
   */
  getLane(y: number): GeneratedLane | undefined {
    const chunkId = this.getChunkId(y)
    const chunk = this.chunks.get(chunkId)
    
    if (!chunk) return undefined
    
    return chunk.lanes.find(lane => lane.yPosition === y)
  }
  
  private generateChunk(startY: number, difficulty: number = 0): void {
    const chunkId = this.getChunkId(startY)
    const lanes = this.mapGenerator.generateLanes(startY, this.CHUNK_SIZE, difficulty)
    
    console.log(`ChunkManager: Generated chunk ${chunkId} with ${lanes.length} lanes (Y: ${startY} to ${startY + this.CHUNK_SIZE - 1})`)
    
    const chunk: Chunk = {
      id: chunkId,
      startY,
      endY: startY + this.CHUNK_SIZE - 1,
      lanes
    }
    
    this.chunks.set(chunkId, chunk)
  }
  
  private cleanupOldChunks(minY: number): void {
    const chunksToRemove: string[] = []
    
    this.chunks.forEach((chunk, id) => {
      if (chunk.endY < minY) {
        chunksToRemove.push(id)
      }
    })
    
    chunksToRemove.forEach(id => this.chunks.delete(id))
  }
  
  private getChunkId(y: number): string {
    const chunkIndex = Math.floor(y / this.CHUNK_SIZE)
    return `chunk_${chunkIndex}`
  }
  
  /**
   * Get current chunk statistics
   */
  getStats(): { totalChunks: number; totalLanes: number } {
    let totalLanes = 0
    this.chunks.forEach(chunk => {
      totalLanes += chunk.lanes.length
    })
    
    return {
      totalChunks: this.chunks.size,
      totalLanes
    }
  }
}
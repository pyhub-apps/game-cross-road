import { ISystem } from '../../core/interfaces/ISystem'
import { IEntity } from '../../core/interfaces/IEntity'

/**
 * Adapter for systems that need to implement the new ISystem interface
 */
export abstract class SystemAdapter {
  abstract name: string
  abstract priority: number
  abstract enabled: boolean
  abstract requiredComponents: string[]
  
  abstract initialize?(...args: any[]): void
  abstract update(entities: IEntity[], deltaTime: number): void
  abstract cleanup?(): void
}
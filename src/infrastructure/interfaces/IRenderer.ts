import { IEntity } from '../../core/interfaces/IEntity';
import { IComponent } from '../../core/interfaces/IComponent';

/**
 * Renderer configuration
 */
export interface RendererConfig {
  width: number;
  height: number;
  pixelRatio: number;
  clearColor: string;
  cameraFOV: number;
  cameraPosition: { x: number; y: number; z: number };
  cameraTarget: { x: number; y: number; z: number };
}

/**
 * Platform-agnostic renderer interface
 * This abstracts the rendering layer from game logic
 */
export interface IRenderer {
  /**
   * Initialize the renderer
   */
  initialize(config: RendererConfig): Promise<void>;
  
  /**
   * Update camera position
   */
  updateCamera(position: { x: number; y: number; z: number }, target?: { x: number; y: number; z: number }): void;
  
  /**
   * Render a frame
   */
  render(entities: IEntity[], getComponents: (entityId: string) => IComponent[]): void;
  
  /**
   * Handle window resize
   */
  resize(width: number, height: number): void;
  
  /**
   * Get renderer stats
   */
  getStats(): {
    fps: number;
    drawCalls: number;
    triangles: number;
    memory: number;
  };
  
  /**
   * Clean up resources
   */
  destroy(): void;
}
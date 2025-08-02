import { IRenderer } from '../interfaces/IRenderer';

export class WebRenderer implements IRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private animationFrameId: number | null = null;
  private renderCallback: ((deltaTime: number) => void) | null = null;
  private lastFrameTime: number = 0;

  initialize(container: HTMLElement): void {
    // Create canvas if it doesn't exist
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    
    container.appendChild(this.canvas);

    // Handle resize
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    console.log('WebRenderer initialized');
  }

  render(scene: any, camera: any): void {
    // In a real implementation, this would interface with React Three Fiber
    // For now, this is a placeholder that the R3F Canvas component will override
    console.log('WebRenderer render called');
  }

  resize(width: number, height: number): void {
    if (this.canvas) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
      this.canvas = null;
    }

    window.removeEventListener('resize', () => this.handleResize());
    
    console.log('WebRenderer disposed');
  }

  /**
   * Start the render loop
   */
  startRenderLoop(callback: (deltaTime: number) => void): void {
    this.renderCallback = callback;
    this.lastFrameTime = performance.now();
    this.animate();
  }

  /**
   * Stop the render loop
   */
  stopRenderLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.renderCallback = null;
  }

  /**
   * Get the canvas element
   */
  getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  /**
   * Animation loop
   */
  private animate = (): void => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;

    if (this.renderCallback) {
      this.renderCallback(deltaTime);
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  /**
   * Handle window resize
   */
  private handleResize(): void {
    if (this.canvas && this.canvas.parentElement) {
      const { clientWidth, clientHeight } = this.canvas.parentElement;
      this.resize(clientWidth, clientHeight);
    }
  }
}
import { useState, useEffect } from 'react'

export interface ViewportInfo {
  width: number
  height: number
  aspectRatio: number
  deviceType: 'mobile' | 'tablet' | 'desktop'
  orientation: 'portrait' | 'landscape'
  pixelRatio: number
  isHighDensity: boolean
}

export interface CameraConfig {
  zoom: number
  fov: number
  nearClip: number
  farClip: number
  frustumSize: number
}

/**
 * Hook for responsive viewport and camera configuration
 */
export function useViewport(): { viewport: ViewportInfo; cameraConfig: CameraConfig } {
  const [viewport, setViewport] = useState<ViewportInfo>(getViewportInfo())
  
  useEffect(() => {
    const handleResize = () => {
      setViewport(getViewportInfo())
    }
    
    const handleOrientationChange = () => {
      // Delay to ensure accurate dimensions after orientation change
      setTimeout(handleResize, 100)
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])
  
  const cameraConfig = getCameraConfig(viewport)
  
  return { viewport, cameraConfig }
}

/**
 * Get current viewport information
 */
function getViewportInfo(): ViewportInfo {
  const width = window.innerWidth
  const height = window.innerHeight
  const aspectRatio = width / height
  const pixelRatio = window.devicePixelRatio || 1
  
  // Determine device type based on width and pixel ratio
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
  if (width < 768 || (pixelRatio > 1 && width < 1024)) {
    deviceType = 'mobile'
  } else if (width < 1280) {
    deviceType = 'tablet'
  }
  
  return {
    width,
    height,
    aspectRatio,
    deviceType,
    orientation: aspectRatio > 1 ? 'landscape' : 'portrait',
    pixelRatio,
    isHighDensity: pixelRatio > 1
  }
}

/**
 * Get camera configuration based on viewport
 */
function getCameraConfig(viewport: ViewportInfo): CameraConfig {
  const { deviceType, orientation, aspectRatio } = viewport
  
  // Base configuration - reduced zoom for wider view
  let config: CameraConfig = {
    zoom: 1,  // Significantly reduced for wider view
    fov: 50,
    nearClip: 0.1,
    farClip: 1000,
    frustumSize: 30  // Increased for wider view
  }
  
  // Adjust for device type - all values reduced
  switch (deviceType) {
    case 'mobile':
      config.zoom = orientation === 'portrait' ? 0.8 : 1.0
      config.frustumSize = orientation === 'portrait' ? 25 : 30
      break
      
    case 'tablet':
      config.zoom = orientation === 'portrait' ? 1.0 : 1.2
      config.frustumSize = orientation === 'portrait' ? 28 : 30
      break
      
    case 'desktop':
      // Further adjust for ultra-wide screens
      if (aspectRatio > 2) {
        config.zoom = 1.5
        config.frustumSize = 35
      } else {
        config.zoom = 1.2
        config.frustumSize = 30
      }
      break
  }
  
  // Adjust for extreme aspect ratios
  if (aspectRatio < 0.5) {
    // Very tall screens (e.g., split screen on mobile)
    config.zoom *= 0.7
    config.frustumSize *= 0.8
  } else if (aspectRatio > 2.5) {
    // Very wide screens
    config.zoom *= 1.2
    config.frustumSize *= 1.2
  }
  
  return config
}

/**
 * Get responsive UI scale factor
 */
export function getUIScale(viewport: ViewportInfo): number {
  const { deviceType, width } = viewport
  
  switch (deviceType) {
    case 'mobile':
      return width < 375 ? 0.85 : 1.0
    case 'tablet':
      return 1.1
    case 'desktop':
      return width > 1920 ? 1.2 : 1.0
  }
}
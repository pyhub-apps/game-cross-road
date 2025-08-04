import { useThree, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GameManager } from '../../game/GameManager'

interface CameraProps {
  offset?: [number, number, number]
  target?: [number, number, number]
  zoom?: number
  followSpeed?: number
  minY?: number // Camera won't go below this Y position
}

export default function Camera({ 
  offset = [10, 10, 10], 
  target = [0, 0, 0],
  zoom = 1,  // Reduced default zoom
  followSpeed = 0.1,
  minY = 0
}: CameraProps) {
  const { camera, gl, size } = useThree()
  const targetRef = useRef(new THREE.Vector3(...target))
  const currentTargetRef = useRef(new THREE.Vector3(...target))
  const [isOrtho, setIsOrtho] = useState(false)
  const [dynamicZoom, setDynamicZoom] = useState(1)

  useEffect(() => {
    // Setup renderer
    gl.setPixelRatio(window.devicePixelRatio)
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
  }, [gl])

  useEffect(() => {
    // Check if camera is orthographic
    setIsOrtho(camera instanceof THREE.OrthographicCamera)
    
    if (camera instanceof THREE.OrthographicCamera) {
      // Adjust zoom based on screen size
      const baseZoom = zoom
      const aspectRatio = size.width / size.height
      
      // Responsive zoom adjustment with dynamic zoom from effects
      const responsiveMultiplier = aspectRatio < 1 ? 0.6 : aspectRatio < 1.5 ? 0.8 : 1.0
      camera.zoom = baseZoom * responsiveMultiplier * dynamicZoom
      
      camera.updateProjectionMatrix()
    }
  }, [camera, zoom, size, dynamicZoom])

  useEffect(() => {
    targetRef.current.set(...target)
  }, [target])
  
  // Listen for camera zoom updates from effects
  useEffect(() => {
    const gameManager = GameManager.getInstance()
    const unsubscribe = gameManager.getEventBus().on('CAMERA_MOVED', (event) => {
      if (event.data.zoom !== undefined) {
        setDynamicZoom(event.data.zoom)
      }
    })
    
    return () => {
      unsubscribe()
    }
  }, [])

  useFrame(() => {
    // Smooth camera following using lerp
    currentTargetRef.current.lerp(targetRef.current, followSpeed)
    
    // Apply minimum Y constraint
    if (currentTargetRef.current.y < minY) {
      currentTargetRef.current.y = minY
    }
    
    // Update camera position to follow target
    const offsetVec = new THREE.Vector3(...offset)
    camera.position.copy(currentTargetRef.current).add(offsetVec)
    
    // Always look at the target position
    camera.lookAt(currentTargetRef.current)
    
    // Log camera position for debugging
    if (Math.random() < 0.01) { // Log occasionally to avoid spam
      console.log('Camera at:', camera.position.toArray(), 'looking at:', currentTargetRef.current.toArray())
    }
  })

  return null
}
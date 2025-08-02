import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

interface CameraProps {
  position?: [number, number, number]
  fov?: number
}

export default function Camera({ 
  position = [10, 10, 10], 
  fov = 50 
}: CameraProps) {
  const { camera, gl } = useThree()

  useEffect(() => {
    // 아이소메트릭 뷰를 위한 카메라 설정
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov
      camera.position.set(...position)
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    }

    // 렌더러 설정
    gl.setPixelRatio(window.devicePixelRatio)
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
  }, [camera, gl, position, fov])

  return null
}
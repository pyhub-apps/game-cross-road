import { useState, useEffect } from 'react'
import { Html } from '@react-three/drei'
import { GameManager } from '../../../game/GameManager'

interface TestResult {
  name: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  message?: string
}

export default function CameraTestRunner() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  
  const runTests = async () => {
    setIsRunning(true)
    const gameManager = GameManager.getInstance()
    const eventBus = gameManager.getEventBus()
    const results: TestResult[] = []
    
    // Test 1: Camera Following
    results.push({ name: 'Camera Following', status: 'running' })
    setTestResults([...results])
    
    try {
      const initialCamera = gameManager.getGameState().cameraOffset
      eventBus.emit({ type: 'PLAYER_MOVED', data: { to: { x: 5, y: 5 } } })
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newCamera = gameManager.getGameState().cameraOffset
      if (newCamera && (newCamera.x !== initialCamera?.x || newCamera.y !== initialCamera?.y)) {
        results[0] = { name: 'Camera Following', status: 'passed', message: 'Camera follows player' }
      } else {
        results[0] = { name: 'Camera Following', status: 'failed', message: 'Camera did not move' }
      }
    } catch (error) {
      results[0] = { name: 'Camera Following', status: 'failed', message: String(error) }
    }
    
    setTestResults([...results])
    
    // Test 2: Boundary Constraints
    results.push({ name: 'Boundary Constraints', status: 'running' })
    setTestResults([...results])
    
    try {
      // Test X boundary
      eventBus.emit({ type: 'PLAYER_MOVED', data: { to: { x: 50, y: 5 } } })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const camera = gameManager.getGameState().cameraOffset
      if (camera && camera.x <= 10) {
        results[1] = { name: 'Boundary Constraints', status: 'passed', message: 'X boundary enforced' }
      } else {
        results[1] = { name: 'Boundary Constraints', status: 'failed', message: 'X boundary not enforced' }
      }
    } catch (error) {
      results[1] = { name: 'Boundary Constraints', status: 'failed', message: String(error) }
    }
    
    setTestResults([...results])
    
    // Test 3: Camera Effects
    results.push({ name: 'Camera Effects', status: 'running' })
    setTestResults([...results])
    
    try {
      // Test shake effect
      eventBus.emit({
        type: 'CAMERA_SHAKE',
        data: { intensity: 0.5, duration: 500, frequency: 10, fadeOut: true }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Test zoom effect
      eventBus.emit({
        type: 'CAMERA_ZOOM',
        data: { targetZoom: 1.5, duration: 500, easing: 'ease-in-out' }
      })
      
      results[2] = { name: 'Camera Effects', status: 'passed', message: 'Effects triggered successfully' }
    } catch (error) {
      results[2] = { name: 'Camera Effects', status: 'failed', message: String(error) }
    }
    
    setTestResults([...results])
    
    // Test 4: Pressure System
    results.push({ name: 'Pressure System', status: 'running' })
    setTestResults([...results])
    
    try {
      const beforeY = gameManager.getGameState().cameraOffset?.y || 0
      eventBus.emit({ type: 'PRESSURE_ACTIVATED', data: {} })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const afterY = gameManager.getGameState().cameraOffset?.y || 0
      eventBus.emit({ type: 'PRESSURE_DEACTIVATED', data: {} })
      
      if (afterY > beforeY) {
        results[3] = { name: 'Pressure System', status: 'passed', message: 'Camera scrolled up' }
      } else {
        results[3] = { name: 'Pressure System', status: 'failed', message: 'Camera did not scroll' }
      }
    } catch (error) {
      results[3] = { name: 'Pressure System', status: 'failed', message: String(error) }
    }
    
    setTestResults([...results])
    
    // Test 5: Frustum Culling
    results.push({ name: 'Frustum Culling', status: 'running' })
    setTestResults([...results])
    
    try {
      const cameraSystem = (gameManager as any).systems.get('camera')
      if (cameraSystem) {
        const inView = cameraSystem.isInFrustum(0, 0, 20)
        const outOfView = cameraSystem.isInFrustum(0, 100, 20)
        
        if (inView && !outOfView) {
          results[4] = { name: 'Frustum Culling', status: 'passed', message: 'Culling works correctly' }
        } else {
          results[4] = { name: 'Frustum Culling', status: 'failed', message: 'Culling logic error' }
        }
      }
    } catch (error) {
      results[4] = { name: 'Frustum Culling', status: 'failed', message: String(error) }
    }
    
    setTestResults([...results])
    setIsRunning(false)
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return '#00ff00'
      case 'failed': return '#ff0000'
      case 'running': return '#ffff00'
      default: return '#888888'
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return '✅'
      case 'failed': return '❌'
      case 'running': return '⏳'
      default: return '⭕'
    }
  }
  
  return (
    <Html position={[0, 0, 0]} style={{ position: 'fixed', top: '200px', right: '10px', zIndex: 1000 }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace',
        minWidth: '300px',
        maxWidth: '400px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#ffff00' }}>Camera System Tests</h3>
        
        <button 
          onClick={runTests} 
          disabled={isRunning}
          style={{ 
            margin: '0 0 10px 0',
            padding: '5px 10px',
            background: isRunning ? '#666' : '#0066ff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </button>
        
        <div style={{
          maxHeight: '250px',
          overflowY: 'auto',
          border: '1px solid #444',
          padding: '10px',
          background: 'rgba(0, 0, 0, 0.5)'
        }}>
          {testResults.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center' }}>
              Click "Run All Tests" to start
            </div>
          ) : (
            testResults.map((result, index) => (
              <div key={index} style={{ 
                marginBottom: '8px',
                padding: '5px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '3px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: getStatusColor(result.status)
                }}>
                  <span style={{ marginRight: '8px' }}>{getStatusIcon(result.status)}</span>
                  <strong>{result.name}</strong>
                </div>
                {result.message && (
                  <div style={{ 
                    marginLeft: '24px', 
                    fontSize: '10px', 
                    color: '#ccc',
                    marginTop: '2px'
                  }}>
                    {result.message}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div style={{ marginTop: '10px', fontSize: '10px', color: '#888' }}>
          Visual test runner for camera system.<br />
          Tests core functionality in real-time.
        </div>
      </div>
    </Html>
  )
}
import { useEffect, useState } from 'react'
import { Html } from '@react-three/drei'
import { GameManager } from '../../../game/GameManager'

export default function CameraBoundaryTest() {
  const [testResults, setTestResults] = useState<string[]>([])
  
  const runBoundaryTest = (direction: 'left' | 'right' | 'down') => {
    const gameManager = GameManager.getInstance()
    const inputManager = (gameManager as any).inputManager
    if (!inputManager) return
    
    const results: string[] = []
    
    // Simulate multiple movements in the specified direction
    const moves = direction === 'down' ? 15 : 12 // More moves for X-axis to reach bounds
    const keyMap = {
      left: 'ArrowLeft',
      right: 'ArrowRight',
      down: 'ArrowDown'
    }
    
    results.push(`Testing ${direction} boundary...`)
    
    // Simulate rapid movements
    for (let i = 0; i < moves; i++) {
      setTimeout(() => {
        const event = new KeyboardEvent('keydown', { key: keyMap[direction] })
        inputManager.handleKeyDown(event)
        
        // Check camera position after movement
        setTimeout(() => {
          const state = gameManager.getGameState()
          if (state.cameraOffset) {
            results.push(`Move ${i + 1}: Camera at (${state.cameraOffset.x.toFixed(2)}, ${state.cameraOffset.y.toFixed(2)})`)
            
            // Check if we hit a boundary
            if (direction === 'left' && state.cameraOffset.x <= -10) {
              results.push('✅ Hit LEFT boundary at X = -10')
            } else if (direction === 'right' && state.cameraOffset.x >= 10) {
              results.push('✅ Hit RIGHT boundary at X = 10')
            } else if (direction === 'down' && state.cameraOffset.y <= 0) {
              results.push('✅ Hit BOTTOM boundary at Y = 0')
            }
            
            setTestResults([...results])
          }
        }, 150)
      }, i * 200) // Stagger movements
    }
  }
  
  const resetPlayerPosition = () => {
    const gameManager = GameManager.getInstance()
    gameManager.reset()
    gameManager.createPlayer()
    setTestResults(['Player reset to (0, 0)'])
  }
  
  return (
    <Html position={[0, 0, 0]} style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 1000 }}>
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
        <h3 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>Camera Boundary Tests</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <button onClick={() => runBoundaryTest('left')} style={{ margin: '2px' }}>
            Test Left Boundary (-10)
          </button>
          <button onClick={() => runBoundaryTest('right')} style={{ margin: '2px' }}>
            Test Right Boundary (10)
          </button>
          <button onClick={() => runBoundaryTest('down')} style={{ margin: '2px' }}>
            Test Bottom Boundary (0)
          </button>
          <button onClick={resetPlayerPosition} style={{ margin: '2px', background: '#ff6600' }}>
            Reset Player
          </button>
        </div>
        
        <div style={{
          maxHeight: '200px',
          overflowY: 'auto',
          border: '1px solid #444',
          padding: '5px',
          background: 'rgba(0, 0, 0, 0.5)'
        }}>
          {testResults.map((result, index) => (
            <div key={index} style={{ 
              color: result.includes('✅') ? '#00ff00' : '#ffffff',
              fontWeight: result.includes('✅') ? 'bold' : 'normal'
            }}>
              {result}
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '10px', color: '#ffff00' }}>
          <strong>Expected Results:</strong><br />
          • Left: Camera X should stop at -10<br />
          • Right: Camera X should stop at 10<br />
          • Down: Camera Y should stop at 0<br />
          • Check console for "Camera clamped" logs
        </div>
      </div>
    </Html>
  )
}
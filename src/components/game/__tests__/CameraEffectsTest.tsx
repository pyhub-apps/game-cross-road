import { Html } from '@react-three/drei'
import { GameManager } from '../../../game/GameManager'

export default function CameraEffectsTest() {
  const gameManager = GameManager.getInstance()
  const eventBus = gameManager.getEventBus()
  
  // Shake effects
  const testShake = (intensity: 'light' | 'medium' | 'heavy') => {
    const configs = {
      light: { intensity: 0.2, duration: 500, frequency: 10, fadeOut: true },
      medium: { intensity: 0.5, duration: 800, frequency: 15, fadeOut: true },
      heavy: { intensity: 1.0, duration: 1200, frequency: 20, fadeOut: false }
    }
    
    eventBus.emit({
      type: 'CAMERA_SHAKE',
      data: configs[intensity]
    })
  }
  
  // Zoom effects
  const testZoom = (type: 'in' | 'out' | 'pulse') => {
    if (type === 'pulse') {
      // Zoom in then out
      eventBus.emit({
        type: 'CAMERA_ZOOM',
        data: { targetZoom: 1.5, duration: 500, easing: 'ease-in-out' }
      })
      setTimeout(() => {
        eventBus.emit({
          type: 'CAMERA_ZOOM',
          data: { targetZoom: 1.0, duration: 500, easing: 'ease-in-out' }
        })
      }, 600)
    } else {
      const targetZoom = type === 'in' ? 1.5 : 0.7
      eventBus.emit({
        type: 'CAMERA_ZOOM',
        data: { targetZoom, duration: 1000, easing: 'ease-in-out' }
      })
    }
  }
  
  // Focus effect
  const testFocus = () => {
    const playerPos = gameManager.getPlayerPosition()
    if (playerPos) {
      eventBus.emit({
        type: 'CAMERA_FOCUS',
        data: {
          target: { x: playerPos.x, y: playerPos.y },
          zoomLevel: 1.3,
          duration: 1500,
          vignette: true
        }
      })
    }
  }
  
  // Combined effects
  const testCombined = () => {
    // Shake + zoom out (explosion effect)
    testShake('heavy')
    testZoom('out')
  }
  
  const resetEffects = () => {
    eventBus.emit({ type: 'CAMERA_RESET_EFFECTS', data: {} })
  }
  
  return (
    <Html position={[0, 0, 0]} style={{ position: 'fixed', top: '200px', left: '10px', zIndex: 1000 }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace',
        minWidth: '250px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#ff6600' }}>Camera Effects Test</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <strong>Shake Effects:</strong><br />
          <button onClick={() => testShake('light')} style={{ margin: '2px' }}>
            Light Shake
          </button>
          <button onClick={() => testShake('medium')} style={{ margin: '2px' }}>
            Medium Shake
          </button>
          <button onClick={() => testShake('heavy')} style={{ margin: '2px' }}>
            Heavy Shake
          </button>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <strong>Zoom Effects:</strong><br />
          <button onClick={() => testZoom('in')} style={{ margin: '2px' }}>
            Zoom In
          </button>
          <button onClick={() => testZoom('out')} style={{ margin: '2px' }}>
            Zoom Out
          </button>
          <button onClick={() => testZoom('pulse')} style={{ margin: '2px' }}>
            Pulse
          </button>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <strong>Special Effects:</strong><br />
          <button onClick={testFocus} style={{ margin: '2px' }}>
            Focus Player
          </button>
          <button onClick={testCombined} style={{ margin: '2px' }}>
            Explosion
          </button>
        </div>
        
        <button 
          onClick={resetEffects} 
          style={{ 
            margin: '5px 0',
            background: '#ff0000',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            width: '100%'
          }}
        >
          Reset All Effects
        </button>
        
        <div style={{ marginTop: '10px', fontSize: '10px', color: '#888' }}>
          Test various camera effects for game feedback.<br />
          Effects can be triggered by game events.
        </div>
      </div>
    </Html>
  )
}
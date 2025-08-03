import { GameManager } from '../../game/GameManager'

export default function CameraReset() {
  const resetCamera = () => {
    const gameManager = GameManager.getInstance()
    const eventBus = gameManager.getEventBus()
    
    // Reset camera effects
    eventBus.emit({ type: 'CAMERA_RESET_EFFECTS', data: {} })
    
    // Restart the game completely (recreates map and player)
    gameManager.restart()
    
    // Force camera to origin
    eventBus.emit({
      type: 'PLAYER_MOVED',
      data: { to: { x: 0, y: 0 } }
    })
    
    // Deactivate pressure if active
    eventBus.emit({ type: 'PRESSURE_DEACTIVATED', data: {} })
    
    console.log('Game completely restarted')
  }
  
  return (
    <div style={{
      position: 'absolute',
      top: '60px',
      right: '10px',
      zIndex: 1000
    }}>
      <button
        onClick={resetCamera}
        style={{
          padding: '10px 20px',
          background: '#ff6600',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        Reset Camera
      </button>
    </div>
  )
}
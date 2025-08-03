import { Html } from '@react-three/drei'
import { useViewport } from '../../hooks/useViewport'

export default function ViewportDebugInfo() {
  const { viewport, cameraConfig } = useViewport()
  
  return (
    <Html 
      position={[0, 0, 0]} 
      style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        zIndex: 1000
      }}
    >
      <div style={{
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '11px',
        fontFamily: 'monospace',
        minWidth: '180px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#00ffff' }}>Viewport Info</h3>
        
        <div style={{ marginBottom: '8px' }}>
          <strong>Device:</strong> {viewport.deviceType}<br />
          <strong>Orientation:</strong> {viewport.orientation}<br />
          <strong>Size:</strong> {viewport.width}x{viewport.height}<br />
          <strong>Aspect Ratio:</strong> {viewport.aspectRatio.toFixed(2)}<br />
          <strong>Pixel Ratio:</strong> {viewport.pixelRatio}x
        </div>
        
        <div style={{ borderTop: '1px solid #444', paddingTop: '8px' }}>
          <strong>Camera Config:</strong><br />
          <strong>Zoom:</strong> {cameraConfig.zoom}<br />
          <strong>Frustum:</strong> {cameraConfig.frustumSize}<br />
          <strong>HD Display:</strong> {viewport.isHighDensity ? 'Yes' : 'No'}
        </div>
        
        <div style={{ marginTop: '8px', fontSize: '9px', color: '#888' }}>
          Camera automatically adjusts<br />
          to device and orientation
        </div>
      </div>
    </Html>
  )
}
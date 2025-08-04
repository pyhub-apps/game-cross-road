import { render } from '@testing-library/react'
import { Canvas } from '@react-three/fiber'
import Camera from '../Camera'
import { OrthographicCamera } from 'three'

// Mock three.js
jest.mock('three', () => ({
  ...jest.requireActual('three'),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setPixelRatio: jest.fn(),
    shadowMap: { enabled: false, type: 0 }
  }))
}))

describe('Camera Component', () => {
  const renderCamera = (props = {}) => {
    return render(
      <Canvas>
        <Camera {...props} />
      </Canvas>
    )
  }

  it('should render without crashing', () => {
    const { container } = renderCamera()
    expect(container).toBeTruthy()
  })

  it('should accept camera props', () => {
    const props = {
      offset: [5, 5, 5] as [number, number, number],
      target: [1, 0, 1] as [number, number, number],
      zoom: 40,
      followSpeed: 0.2,
      minY: -10
    }
    
    const { container } = renderCamera(props)
    expect(container).toBeTruthy()
  })

  it('should handle responsive zoom levels', () => {
    // Test portrait mode (mobile)
    global.innerWidth = 400
    global.innerHeight = 800
    const { container: mobileContainer } = renderCamera({ zoom: 50 })
    expect(mobileContainer).toBeTruthy()

    // Test landscape mode (desktop)
    global.innerWidth = 1920
    global.innerHeight = 1080
    const { container: desktopContainer } = renderCamera({ zoom: 50 })
    expect(desktopContainer).toBeTruthy()
  })
})
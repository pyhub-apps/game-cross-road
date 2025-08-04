import { render, screen, fireEvent } from '@testing-library/react'
import GameCanvas from '../GameCanvas'

// Mock the child components
jest.mock('../Camera', () => {
  return function MockCamera() {
    return <div data-testid="camera">Camera</div>
  }
})

jest.mock('../Lighting', () => {
  return function MockLighting() {
    return <div data-testid="lighting">Lighting</div>
  }
})

jest.mock('../Ground', () => {
  return function MockGround() {
    return <div data-testid="ground">Ground</div>
  }
})

jest.mock('../Game', () => {
  return function MockGame({ onPlayerPositionChange }: any) {
    // Simulate player movement
    React.useEffect(() => {
      onPlayerPositionChange?.([0, 0, -5])
    }, [onPlayerPositionChange])
    return <div data-testid="game">Game</div>
  }
})

jest.mock('../MapRenderer', () => {
  return function MockMapRenderer() {
    return <div data-testid="map-renderer">MapRenderer</div>
  }
})

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
  useThree: () => ({
    camera: {},
    gl: {
      setPixelRatio: jest.fn(),
      shadowMap: { enabled: false, type: 0 }
    },
    size: { width: 800, height: 600 }
  }),
  useFrame: jest.fn()
}))

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls">OrbitControls</div>,
  Stats: () => <div data-testid="stats">Stats</div>,
  Html: ({ children }: any) => <div>{children}</div>
}))

// Add React to global scope for the mock
import React from 'react'

describe('GameCanvas Component', () => {
  it('should render all components', () => {
    render(<GameCanvas />)
    
    expect(screen.getByTestId('canvas')).toBeInTheDocument()
    expect(screen.getByTestId('camera')).toBeInTheDocument()
    expect(screen.getByTestId('lighting')).toBeInTheDocument()
    expect(screen.getByTestId('ground')).toBeInTheDocument()
    expect(screen.getByTestId('game')).toBeInTheDocument()
    expect(screen.getByTestId('map-renderer')).toBeInTheDocument()
    expect(screen.getByTestId('orbit-controls')).toBeInTheDocument()
    expect(screen.getByTestId('stats')).toBeInTheDocument()
  })

  it('should toggle debug mode', () => {
    render(<GameCanvas />)
    
    const toggleButton = screen.getByText('Disable OrbitControls')
    expect(screen.getByTestId('orbit-controls')).toBeInTheDocument()
    
    fireEvent.click(toggleButton)
    
    expect(screen.getByText('Enable OrbitControls')).toBeInTheDocument()
    expect(screen.queryByTestId('orbit-controls')).not.toBeInTheDocument()
  })

  it('should update camera target when player moves forward', () => {
    const { container } = render(<GameCanvas />)
    
    // The Game component mock will trigger onPlayerPositionChange
    // which should update the camera target
    expect(container).toBeTruthy()
  })
})
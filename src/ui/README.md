# UI Module

The UI module contains React components for the game's user interface, including menus, HUD, and game screens. This module is separate from the 3D rendering and focuses on 2D UI elements.

## Structure

### `/screens`
Full-screen UI states:
- `MainMenuScreen`: Game start screen
- `GameScreen`: In-game UI overlay
- `GameOverScreen`: Score display and restart
- `PauseScreen`: Pause menu
- `LoadingScreen`: Asset loading indicator

### `/components`
Reusable UI components:
- `ScoreDisplay`: Current and high score
- `Button`: Styled game buttons
- `Modal`: Popup dialogs
- `TouchControls`: On-screen touch controls
- `PressureIndicator`: Time pressure warning

### `/controls`
Input control components:
- `VirtualJoystick`: Mobile touch controls
- `SwipeHandler`: Gesture recognition
- `KeyboardIndicator`: Control hints

## Styling Approach

Uses CSS-in-JS for component-based styling:
- Responsive design for all screen sizes
- Theme support for consistent styling
- Animation support for transitions
- Performance-optimized rendering

## State Management

UI state is managed through:
- Local component state for UI-only concerns
- Game state subscription for game data
- Event bus for game events

## Usage

```typescript
// Main app component
function App() {
  const gameState = useGameState();
  
  return (
    <>
      {gameState.currentState === 'menu' && <MainMenuScreen />}
      {gameState.currentState === 'playing' && <GameScreen />}
      {gameState.currentState === 'gameOver' && <GameOverScreen />}
      <GameCanvas /> {/* 3D game rendering */}
    </>
  );
}

// Score display component
function ScoreDisplay({ score, highScore }: ScoreProps) {
  return (
    <div className="score-container">
      <div className="current-score">Score: {score}</div>
      <div className="high-score">Best: {highScore}</div>
    </div>
  );
}
```

## Responsive Design

- Mobile-first approach
- Breakpoints for different screen sizes
- Touch-optimized controls
- Adaptive layout based on aspect ratio

## Accessibility

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Configurable text size

## Integration

- Subscribes to game events
- Sends input commands to game
- Reads from game state
- Independent of rendering layer
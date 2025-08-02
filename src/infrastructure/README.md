# Infrastructure Module

The infrastructure module provides platform-specific implementations for common services like input, audio, storage, and configuration. These implementations can be swapped out when porting to different platforms.

## Structure

### `/input`
Input handling implementations:
- `WebInputManager`: Browser-based input (keyboard, mouse, touch)
- Input mapping and configuration
- Gesture recognition for mobile

### `/audio`
Audio system (future implementation):
- Sound effect management
- Music playback
- 3D spatial audio

### `/storage`
Persistent storage implementations:
- `LocalStorageManager`: Browser localStorage for web
- Save game management
- Settings persistence

### `/config`
Configuration management:
- Game settings
- Performance profiles
- Platform-specific configs

## Key Interfaces

### IInputManager
Platform-agnostic input interface that abstracts input sources and provides unified input events.

### IStorageManager
Abstraction for persistent storage across platforms.

### IAudioManager (future)
Audio playback abstraction.

## Platform Implementations

### Web Platform
- Keyboard: Arrow keys and WASD
- Mouse: Click for forward movement
- Touch: Swipe gestures and tap
- Storage: localStorage API
- Audio: Web Audio API

### Mobile (future)
- Touch-optimized controls
- Accelerometer support
- Platform-specific storage

### Desktop (future)
- Gamepad support
- File-based storage
- Enhanced audio

## Usage

```typescript
// Create platform-specific implementations
const inputManager = new WebInputManager();
const storageManager = new LocalStorageManager();

// Initialize
inputManager.initialize();

// Use through interfaces
inputManager.onInput((event) => {
  console.log(`Input received: ${event.action}`);
});

// Platform switching
const createInputManager = (platform: string): IInputManager => {
  switch (platform) {
    case 'web':
      return new WebInputManager();
    case 'mobile':
      return new MobileInputManager();
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
};
```

## Design Principles

1. **Abstraction**: All platform-specific code hidden behind interfaces
2. **Swappability**: Easy to replace implementations
3. **Testability**: Mock implementations for testing
4. **Performance**: Platform-optimized implementations
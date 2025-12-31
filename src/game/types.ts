// Game Types

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface GameState {
  isPlaying: boolean;
  isVictory: boolean;
  isGameOver: boolean;
}

export interface BoatState {
  position: Position;
  velocity: number; // Speed in the direction the boat is facing
  rotationVelocity: number;
  rotation: number;
  health: number;
  maxHealth: number;
}

export interface WakeParticle {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  size: number;
  alpha: number;
  offsetX: number; // Spread offset
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export interface CameraState {
  y: number;
  targetY: number;
}


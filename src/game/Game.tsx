import { Application, extend, useTick } from '@pixi/react';
import { useCallback, useRef, useState } from 'react';
import { Container, Graphics, Text } from 'pixi.js';
import { CONFIG } from '../config';
import type { BoatState, CameraState, GameState, InputState, WakeParticle } from './types';
import { useKeyboard } from './hooks/useKeyboard';
import {
  Boat,
  Dock,
  Land,
  Water,
  Wake,
  HealthBar,
  VictoryScreen,
  Instructions,
} from './components';

// Extend pixi.js classes so they can be used as JSX elements
extend({ Container, Graphics, Text });

function getInitialBoatState(): BoatState {
  return {
    position: {
      x: CONFIG.WORLD_WIDTH / 2,
      y: CONFIG.WORLD_HEIGHT - CONFIG.BOAT.START_OFFSET_Y,
    },
    velocity: 0,
    rotationVelocity: 0,
    rotation: 0,
    health: CONFIG.BOAT.MAX_HEALTH,
    maxHealth: CONFIG.BOAT.MAX_HEALTH,
  };
}

function getInitialCameraState(): CameraState {
  return {
    y: CONFIG.WORLD_HEIGHT - CONFIG.CANVAS_HEIGHT,
    targetY: CONFIG.WORLD_HEIGHT - CONFIG.CANVAS_HEIGHT,
  };
}

function getInitialGameState(): GameState {
  return {
    isPlaying: true,
    isVictory: false,
    isGameOver: false,
  };
}

// Inner component that uses the useTick hook (must be inside Application)
function GameContent({
  inputState,
  onVictory,
  onRestart,
  showVictory,
}: {
  inputState: React.MutableRefObject<InputState>;
  onVictory: () => void;
  onRestart: () => void;
  showVictory: boolean;
}) {
  const boatStateRef = useRef<BoatState>(getInitialBoatState());
  const cameraStateRef = useRef<CameraState>(getInitialCameraState());
  const gameStateRef = useRef<GameState>(getInitialGameState());
  const wakeParticlesRef = useRef<WakeParticle[]>([]);
  const hasWon = useRef(false);
  const frameCount = useRef(0);
  
  const [renderState, setRenderState] = useState({
    boat: getInitialBoatState(),
    camera: getInitialCameraState(),
    wakeParticles: [] as WakeParticle[],
  });

  // Reset game when restart is triggered
  const handleRestart = useCallback(() => {
    boatStateRef.current = getInitialBoatState();
    cameraStateRef.current = getInitialCameraState();
    gameStateRef.current = getInitialGameState();
    wakeParticlesRef.current = [];
    hasWon.current = false;
    setRenderState({
      boat: getInitialBoatState(),
      camera: getInitialCameraState(),
      wakeParticles: [],
    });
    onRestart();
  }, [onRestart]);

  useTick({
    callback: () => {
      if (!gameStateRef.current.isPlaying) return;

      const boat = boatStateRef.current;
      const camera = cameraStateRef.current;
      const input = inputState.current;
      frameCount.current++;

      // Handle rotation - turn rate scales with speed (boats can't turn when stationary)
      // Calculate turn effectiveness based on current speed
      const speed = Math.abs(boat.velocity);
      const turnFactor = Math.min(1, speed / (CONFIG.BOAT.MAX_SPEED * CONFIG.BOAT.TURN_SPEED_THRESHOLD));
      
      if (input.left) {
        boat.rotationVelocity -= CONFIG.BOAT.ROTATION_SPEED * turnFactor;
      }
      if (input.right) {
        boat.rotationVelocity += CONFIG.BOAT.ROTATION_SPEED * turnFactor;
      }
      
      // Apply rotation drag
      boat.rotationVelocity *= CONFIG.BOAT.ROTATION_DRAG;
      
      // Clamp rotation velocity (also scales with speed for tighter control at low speeds)
      const maxRotVel = CONFIG.BOAT.ROTATION_SPEED * 3 * Math.max(0.1, turnFactor);
      boat.rotationVelocity = Math.max(-maxRotVel, Math.min(maxRotVel, boat.rotationVelocity));
      
      // Apply rotation
      boat.rotation += boat.rotationVelocity;

      // Handle acceleration/deceleration
      if (input.up) {
        // Accelerate forward
        boat.velocity += CONFIG.BOAT.ACCELERATION;
      } else if (input.down) {
        // Accelerate backward (slower)
        boat.velocity -= CONFIG.BOAT.REVERSE_ACCELERATION;
      } else {
        // Decelerate (coast to stop)
        if (Math.abs(boat.velocity) < CONFIG.BOAT.DECELERATION) {
          boat.velocity = 0;
        } else if (boat.velocity > 0) {
          boat.velocity -= CONFIG.BOAT.DECELERATION;
        } else {
          boat.velocity += CONFIG.BOAT.DECELERATION;
        }
      }

      // Clamp velocity
      boat.velocity = Math.max(-CONFIG.BOAT.MAX_SPEED * 0.4, Math.min(CONFIG.BOAT.MAX_SPEED, boat.velocity));

      // Apply velocity to position
      // Forward direction vector for a boat pointing "up" at rotation=0 is (sin(θ), -cos(θ))
      boat.position.x += Math.sin(boat.rotation) * boat.velocity;
      boat.position.y -= Math.cos(boat.rotation) * boat.velocity;

      // Clamp position to world bounds
      const halfWidth = CONFIG.BOAT.WIDTH / 2;
      const halfHeight = CONFIG.BOAT.HEIGHT / 2;
      
      boat.position.x = Math.max(halfWidth, Math.min(CONFIG.WORLD_WIDTH - halfWidth, boat.position.x));
      boat.position.y = Math.max(halfHeight, Math.min(CONFIG.WORLD_HEIGHT - halfHeight, boat.position.y));

      // Update wake particles
      const wakeParticles = wakeParticlesRef.current;
      
      // Spawn new wake particles based on speed (reuse speed from turn calculation)
      if (speed > CONFIG.WAKE.MIN_SPEED_FOR_WAKE && frameCount.current % 3 === 0) {
        const intensity = speed / CONFIG.BOAT.MAX_SPEED;
        const numParticles = Math.ceil(intensity * 3);
        
        for (let i = 0; i < numParticles; i++) {
          if (wakeParticles.length < CONFIG.WAKE.MAX_PARTICLES) {
            // Position behind the boat
            const backOffset = CONFIG.BOAT.HEIGHT / 2 + 5;
            const spreadAngle = (Math.random() - 0.5) * CONFIG.WAKE.SPREAD_ANGLE;
            const adjustedRotation = boat.rotation + spreadAngle;
            
            wakeParticles.push({
              x: boat.position.x - Math.sin(boat.rotation) * backOffset,
              y: boat.position.y + Math.cos(boat.rotation) * backOffset,
              age: 0,
              maxAge: CONFIG.WAKE.PARTICLE_LIFETIME * (0.7 + Math.random() * 0.6),
              size: 3 + Math.random() * 4 * intensity,
              alpha: 0.5 + intensity * 0.5,
              offsetX: Math.sin(adjustedRotation) * (Math.random() * 15 - 7.5),
            });
          }
        }
      }
      
      // Update existing particles
      for (let i = wakeParticles.length - 1; i >= 0; i--) {
        wakeParticles[i].age++;
        if (wakeParticles[i].age >= wakeParticles[i].maxAge) {
          wakeParticles.splice(i, 1);
        }
      }

      // Update camera
      const boatScreenY = boat.position.y - camera.y;
      
      if (boatScreenY < CONFIG.CAMERA.SCROLL_MARGIN) {
        camera.targetY = boat.position.y - CONFIG.CAMERA.SCROLL_MARGIN;
      } else if (boatScreenY > CONFIG.CANVAS_HEIGHT - CONFIG.CAMERA.SCROLL_MARGIN) {
        camera.targetY = boat.position.y - (CONFIG.CANVAS_HEIGHT - CONFIG.CAMERA.SCROLL_MARGIN);
      }

      camera.targetY = Math.max(0, Math.min(CONFIG.WORLD_HEIGHT - CONFIG.CANVAS_HEIGHT, camera.targetY));
      camera.y += (camera.targetY - camera.y) * CONFIG.CAMERA.SMOOTH_FACTOR;

      // Check victory
      if (boat.position.y <= CONFIG.LAND.HEIGHT + CONFIG.LAND.BEACH_HEIGHT && !hasWon.current) {
        hasWon.current = true;
        gameStateRef.current.isVictory = true;
        gameStateRef.current.isPlaying = false;
        onVictory();
      }

      // Update render state
      setRenderState({
        boat: { ...boat },
        camera: { ...camera },
        wakeParticles: [...wakeParticles],
      });
    },
  });

  const { boat, camera, wakeParticles } = renderState;

  return (
    <pixiContainer>
      {/* World container */}
      <pixiContainer>
        <Water cameraY={camera.y} />
        <Land cameraY={camera.y} />
        <Dock cameraY={camera.y} />
        <Wake particles={wakeParticles} cameraY={camera.y} />
        <Boat
          x={boat.position.x}
          y={boat.position.y}
          rotation={boat.rotation}
          cameraY={camera.y}
        />
      </pixiContainer>

      {/* UI container - fixed position */}
      <pixiContainer>
        <HealthBar health={boat.health} maxHealth={boat.maxHealth} />
        <Instructions />
        {showVictory && <VictoryScreen onRestart={handleRestart} />}
      </pixiContainer>
    </pixiContainer>
  );
}

export function Game() {
  const inputState = useKeyboard();
  const [showVictory, setShowVictory] = useState(false);

  const handleVictory = useCallback(() => {
    setShowVictory(true);
  }, []);

  const handleRestart = useCallback(() => {
    setShowVictory(false);
  }, []);

  return (
    <Application
      width={CONFIG.CANVAS_WIDTH}
      height={CONFIG.CANVAS_HEIGHT}
      background={CONFIG.COLORS.WATER_DEEP}
      antialias={true}
    >
      <GameContent
        inputState={inputState}
        onVictory={handleVictory}
        onRestart={handleRestart}
        showVictory={showVictory}
      />
    </Application>
  );
}

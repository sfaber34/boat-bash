// Game Configuration
export const CONFIG = {
  // Canvas & World
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  WORLD_WIDTH: 800,
  WORLD_HEIGHT: 2000,

  // Colors
  COLORS: {
    WATER: 0x1a5f7a,
    WATER_DEEP: 0x0d3d4d,
    DOCK: 0x8b4513,
    DOCK_PLANKS: 0xa0522d,
    LAND: 0x2d5a27,
    LAND_BEACH: 0xd4b896,
    BOAT_HULL: 0x654321,
    BOAT_DECK: 0x8b6914,
    BOAT_SAIL: 0xfaf0e6,
    HEALTH_BAR_BG: 0x333333,
    HEALTH_BAR_FILL: 0x22c55e,
    HEALTH_BAR_LOW: 0xef4444,
    UI_TEXT: 0xffffff,
  },

  // Boat
  BOAT: {
    WIDTH: 24,
    HEIGHT: 80,
    MAX_SPEED: 5,
    ACCELERATION: 0.04,
    DECELERATION: 0.04, // How fast it slows when not accelerating
    REVERSE_ACCELERATION: 0.04,
    ROTATION_SPEED: 0.01,
    ROTATION_DRAG: 0.92, // Rotation momentum decay
    TURN_SPEED_THRESHOLD: 0.7, // Fraction of max speed needed for full turning ability
    MAX_HEALTH: 100,
    START_OFFSET_Y: 160, // Distance from bottom of world
  },

  // Wake effect
  WAKE: {
    MAX_PARTICLES: 20,
    PARTICLE_LIFETIME: 60, // frames
    SPREAD_ANGLE: 0.4, // radians
    MIN_SPEED_FOR_WAKE: 0.5,
  },

  // Dock
  DOCK: {
    WIDTH: 120,
    HEIGHT: 80,
    Y_POSITION: 1900, // Near bottom of world
  },

  // Land (Victory Zone)
  LAND: {
    HEIGHT: 200,
    BEACH_HEIGHT: 40,
    Y_POSITION: 0, // Top of world
  },

  // Camera
  CAMERA: {
    SCROLL_MARGIN: 250, // Start scrolling when boat is this far from edge
    SMOOTH_FACTOR: 0.08,
  },

  // UI
  UI: {
    HEALTH_BAR_WIDTH: 200,
    HEALTH_BAR_HEIGHT: 20,
    HEALTH_BAR_X: 20,
    HEALTH_BAR_Y: 20,
    PADDING: 10,
  },
} as const;

// Input key mappings
export const KEYS = {
  UP: ['ArrowUp', 'KeyW'],
  DOWN: ['ArrowDown', 'KeyS'],
  LEFT: ['ArrowLeft', 'KeyA'],
  RIGHT: ['ArrowRight', 'KeyD'],
} as const;


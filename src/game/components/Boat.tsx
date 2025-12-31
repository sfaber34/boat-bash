import { useCallback } from 'react';
import { Graphics as PixiGraphics } from 'pixi.js';
import { CONFIG } from '../../config';

interface BoatProps {
  x: number;
  y: number;
  rotation: number;
  cameraY: number;
}

export function Boat({ x, y, rotation, cameraY }: BoatProps) {
  const draw = useCallback((g: PixiGraphics) => {
    g.clear();
    
    const screenY = y - cameraY;
    const { WIDTH, HEIGHT } = CONFIG.BOAT;
    
    // Position and rotate
    g.position.set(x, screenY);
    g.rotation = rotation;
    
    const halfW = WIDTH / 2;
    const halfH = HEIGHT / 2;
    
    // Wood colors
    const hullDark = 0x5c3d2e;    // Dark wood
    const hullMid = 0x8b5a2b;     // Medium wood
    const hullLight = 0xa67c52;   // Light wood
    const plankLine = 0x4a2f23;   // Dark lines between planks
    
    // === HULL - Wooden speedboat shape ===
    // Pointed bow, curved sides, flat stern
    g.moveTo(0, -halfH);                    // Bow point (front)
    g.lineTo(halfW * 0.5, -halfH + 12);     // Right bow curve
    g.lineTo(halfW, -halfH + 30);           // Right side front
    g.lineTo(halfW + 1, halfH - 5);         // Right side back
    g.lineTo(halfW + 1, halfH);             // Right stern corner
    g.lineTo(-halfW - 1, halfH);            // Left stern corner (flat back)
    g.lineTo(-halfW - 1, halfH - 5);        // Left side back
    g.lineTo(-halfW, -halfH + 30);          // Left side front
    g.lineTo(-halfW * 0.5, -halfH + 12);    // Left bow curve
    g.closePath();
    g.fill({ color: hullDark });
    
    // === HULL OUTER RIM / GUNWALE ===
    g.moveTo(0, -halfH);
    g.lineTo(halfW * 0.5, -halfH + 12);
    g.lineTo(halfW, -halfH + 30);
    g.lineTo(halfW + 1, halfH);
    g.stroke({ color: hullLight, width: 3 });
    
    g.moveTo(0, -halfH);
    g.lineTo(-halfW * 0.5, -halfH + 12);
    g.lineTo(-halfW, -halfH + 30);
    g.lineTo(-halfW - 1, halfH);
    g.stroke({ color: hullLight, width: 3 });
    
    // === INTERIOR DECK (wooden planks) ===
    g.moveTo(0, -halfH + 8);
    g.lineTo(halfW * 0.35, -halfH + 16);
    g.lineTo(halfW - 3, -halfH + 32);
    g.lineTo(halfW - 3, halfH - 3);
    g.lineTo(-halfW + 3, halfH - 3);
    g.lineTo(-halfW + 3, -halfH + 32);
    g.lineTo(-halfW * 0.35, -halfH + 16);
    g.closePath();
    g.fill({ color: hullMid });
    
    // Plank lines (horizontal)
    const plankSpacing = 10;
    for (let py = -halfH + 25; py < halfH - 5; py += plankSpacing) {
      // Calculate width at this y position
      let plankHalfWidth: number;
      if (py < -halfH + 32) {
        // In the bow taper area
        const t = (py - (-halfH + 8)) / 24;
        plankHalfWidth = (halfW - 3) * t * 0.8;
      } else {
        plankHalfWidth = halfW - 4;
      }
      
      g.moveTo(-plankHalfWidth, py);
      g.lineTo(plankHalfWidth, py);
      g.stroke({ color: plankLine, width: 1, alpha: 0.5 });
    }
    
    // Center plank line
    g.moveTo(0, -halfH + 20);
    g.lineTo(0, halfH - 5);
    g.stroke({ color: plankLine, width: 1, alpha: 0.4 });
    
    // === BENCH SEATS (wooden) ===
    // Front bench
    g.rect(-halfW + 5, -halfH + 38, WIDTH - 10, 6);
    g.fill({ color: hullLight });
    g.rect(-halfW + 5, -halfH + 38, WIDTH - 10, 6);
    g.stroke({ color: plankLine, width: 1 });
    
    // Rear bench
    g.rect(-halfW + 4, halfH - 18, WIDTH - 8, 6);
    g.fill({ color: hullLight });
    g.rect(-halfW + 4, halfH - 18, WIDTH - 8, 6);
    g.stroke({ color: plankLine, width: 1 });
    
    // === OUTBOARD MOTOR (compact, no visible prop) ===
    // Motor mount / transom reinforcement
    g.rect(-5, halfH - 2, 10, 4);
    g.fill({ color: hullDark });
    
    // Motor cowling
    g.moveTo(-4, halfH + 2);
    g.lineTo(-5, halfH + 14);
    g.lineTo(-3, halfH + 16);
    g.lineTo(3, halfH + 16);
    g.lineTo(5, halfH + 14);
    g.lineTo(4, halfH + 2);
    g.closePath();
    g.fill({ color: 0x222222 }); // Black motor
    
    // Motor accent stripe
    g.rect(-3, halfH + 7, 6, 2);
    g.fill({ color: 0xcc0000 }); // Red stripe
    
    // === BOW DETAIL ===
    // Bow cap / stem
    g.moveTo(0, -halfH);
    g.lineTo(2, -halfH + 6);
    g.lineTo(-2, -halfH + 6);
    g.closePath();
    g.fill({ color: hullLight });
    
    // Bow cleat
    g.rect(-2, -halfH + 8, 4, 3);
    g.fill({ color: 0x666666 });
    
  }, [x, y, rotation, cameraY]);

  return <pixiGraphics draw={draw} />;
}

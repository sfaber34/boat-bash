import { useCallback } from 'react';
import { Graphics as PixiGraphics } from 'pixi.js';
import { CONFIG } from '../../config';

interface WaterProps {
  cameraY: number;
}

export function Water({ cameraY }: WaterProps) {
  const draw = useCallback((g: PixiGraphics) => {
    g.clear();
    
    // Draw water background
    g.rect(0, -cameraY, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
    g.fill({ color: CONFIG.COLORS.WATER });

    // Draw some wave patterns for visual interest
    const waveCount = 20;
    const waveSpacing = CONFIG.WORLD_HEIGHT / waveCount;
    
    for (let i = 0; i < waveCount; i++) {
      const y = i * waveSpacing - cameraY;
      const alpha = 0.1 + (i % 3) * 0.05;
      
      g.moveTo(0, y);
      
      // Create wavy line
      for (let x = 0; x <= CONFIG.WORLD_WIDTH; x += 40) {
        const waveOffset = Math.sin((x + i * 50) * 0.02) * 10;
        g.lineTo(x, y + waveOffset);
      }
      
      g.stroke({ color: CONFIG.COLORS.WATER_DEEP, width: 2, alpha });
    }
  }, [cameraY]);

  return <pixiGraphics draw={draw} />;
}

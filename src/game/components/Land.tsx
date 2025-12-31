import { useCallback } from 'react';
import { Graphics as PixiGraphics } from 'pixi.js';
import { CONFIG } from '../../config';

interface LandProps {
  cameraY: number;
}

export function Land({ cameraY }: LandProps) {
  const draw = useCallback((g: PixiGraphics) => {
    g.clear();
    
    const landY = CONFIG.LAND.Y_POSITION - cameraY;

    // Draw beach/sand strip
    g.rect(0, landY + CONFIG.LAND.HEIGHT - CONFIG.LAND.BEACH_HEIGHT, CONFIG.WORLD_WIDTH, CONFIG.LAND.BEACH_HEIGHT);
    g.fill({ color: CONFIG.COLORS.LAND_BEACH });

    // Draw main land (grass)
    g.rect(0, landY, CONFIG.WORLD_WIDTH, CONFIG.LAND.HEIGHT - CONFIG.LAND.BEACH_HEIGHT);
    g.fill({ color: CONFIG.COLORS.LAND });

    // Draw some trees/vegetation
    const treePositions = [80, 200, 350, 500, 650, 750];
    
    treePositions.forEach((x, i) => {
      const treeY = landY + 40 + (i % 3) * 20;
      const treeSize = 25 + (i % 2) * 10;
      
      // Tree trunk
      g.rect(x - 4, treeY, 8, 30);
      g.fill({ color: 0x5c4033 });
      
      // Tree foliage (triangle)
      g.moveTo(x, treeY - treeSize);
      g.lineTo(x - treeSize, treeY);
      g.lineTo(x + treeSize, treeY);
      g.closePath();
      g.fill({ color: 0x228b22 });
    });

    // Draw a victory flag
    const flagX = CONFIG.WORLD_WIDTH / 2;
    const flagY = landY + 30;
    
    // Flag pole
    g.rect(flagX - 2, flagY, 4, 60);
    g.fill({ color: 0x8b8b8b });
    
    // Flag
    g.moveTo(flagX + 2, flagY);
    g.lineTo(flagX + 40, flagY + 15);
    g.lineTo(flagX + 2, flagY + 30);
    g.closePath();
    g.fill({ color: 0xff4444 });

    // "FINISH" indicator
    g.rect(flagX - 30, flagY - 20, 60, 18);
    g.fill({ color: 0x000000 });
  }, [cameraY]);

  return <pixiGraphics draw={draw} />;
}

import { useCallback } from 'react';
import { Graphics as PixiGraphics } from 'pixi.js';
import { CONFIG } from '../../config';

interface DockProps {
  cameraY: number;
}

export function Dock({ cameraY }: DockProps) {
  const draw = useCallback((g: PixiGraphics) => {
    g.clear();
    
    const dockX = (CONFIG.WORLD_WIDTH - CONFIG.DOCK.WIDTH) / 2;
    const dockY = CONFIG.DOCK.Y_POSITION - cameraY;

    // Draw dock base
    g.rect(dockX, dockY, CONFIG.DOCK.WIDTH, CONFIG.DOCK.HEIGHT);
    g.fill({ color: CONFIG.COLORS.DOCK });

    // Draw dock planks
    const plankCount = 6;
    const plankWidth = CONFIG.DOCK.WIDTH / plankCount;
    
    for (let i = 0; i < plankCount; i++) {
      const plankX = dockX + i * plankWidth;
      g.rect(plankX + 2, dockY + 2, plankWidth - 4, CONFIG.DOCK.HEIGHT - 4);
      g.fill({ color: CONFIG.COLORS.DOCK_PLANKS });
    }

    // Draw dock posts (pillars going into water)
    const postWidth = 12;
    const postHeight = 30;
    
    g.rect(dockX + 10, dockY + CONFIG.DOCK.HEIGHT, postWidth, postHeight);
    g.fill({ color: CONFIG.COLORS.DOCK });
    
    g.rect(dockX + CONFIG.DOCK.WIDTH - 22, dockY + CONFIG.DOCK.HEIGHT, postWidth, postHeight);
    g.fill({ color: CONFIG.COLORS.DOCK });

    // Draw ropes/cleats
    g.circle(dockX + 15, dockY + 15, 5);
    g.fill({ color: 0x444444 });
    
    g.circle(dockX + CONFIG.DOCK.WIDTH - 15, dockY + 15, 5);
    g.fill({ color: 0x444444 });
  }, [cameraY]);

  return <pixiGraphics draw={draw} />;
}

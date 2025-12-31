import { useCallback } from 'react';
import { Graphics as PixiGraphics } from 'pixi.js';
import { CONFIG } from '../../config';
import type { WakeParticle } from '../types';

interface WakeProps {
  particles: WakeParticle[];
  cameraY: number;
}

export function Wake({ particles, cameraY }: WakeProps) {
  const draw = useCallback((g: PixiGraphics) => {
    g.clear();
    
    particles.forEach((particle) => {
      const screenY = particle.y - cameraY;
      const progress = particle.age / particle.maxAge;
      const alpha = (1 - progress) * 0.6 * particle.alpha;
      const size = particle.size * (1 + progress * 2); // Grow as it ages
      
      // Draw wake bubble/foam
      g.circle(particle.x + particle.offsetX, screenY, size);
      g.fill({ color: 0xffffff, alpha });
      
      // Add a subtle blue ring
      g.circle(particle.x + particle.offsetX, screenY, size * 1.3);
      g.stroke({ color: 0x87ceeb, width: 1, alpha: alpha * 0.5 });
    });
  }, [particles, cameraY]);

  return <pixiGraphics draw={draw} />;
}


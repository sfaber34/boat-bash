import { useCallback } from 'react';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';
import { CONFIG } from '../../config';

interface VictoryScreenProps {
  onRestart: () => void;
}

export function VictoryScreen({ onRestart }: VictoryScreenProps) {
  const draw = useCallback((g: PixiGraphics) => {
    g.clear();
    
    // Dark overlay
    g.rect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    g.fill({ color: 0x000000, alpha: 0.7 });
    
    // Victory panel
    const panelWidth = 400;
    const panelHeight = 200;
    const panelX = (CONFIG.CANVAS_WIDTH - panelWidth) / 2;
    const panelY = (CONFIG.CANVAS_HEIGHT - panelHeight) / 2;
    
    g.roundRect(panelX, panelY, panelWidth, panelHeight, 16);
    g.fill({ color: 0x1a3a1a });
    g.stroke({ color: 0x4ade80, width: 4 });
  }, []);

  const titleStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 48,
    fontWeight: 'bold',
    fill: 0x4ade80,
    dropShadow: {
      alpha: 0.5,
      angle: Math.PI / 4,
      blur: 4,
      color: 0x000000,
      distance: 4,
    },
  });

  const subtitleStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 18,
    fill: 0xffffff,
  });

  const restartStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 20,
    fontWeight: 'bold',
    fill: 0xffd700,
  });

  return (
    <pixiContainer>
      <pixiGraphics draw={draw} eventMode="static" onClick={onRestart} />
      <pixiText
        text="VICTORY!"
        x={CONFIG.CANVAS_WIDTH / 2}
        y={CONFIG.CANVAS_HEIGHT / 2 - 50}
        anchor={0.5}
        style={titleStyle}
      />
      <pixiText
        text="You reached the shore safely!"
        x={CONFIG.CANVAS_WIDTH / 2}
        y={CONFIG.CANVAS_HEIGHT / 2 + 10}
        anchor={0.5}
        style={subtitleStyle}
      />
      <pixiText
        text="Click anywhere to play again"
        x={CONFIG.CANVAS_WIDTH / 2}
        y={CONFIG.CANVAS_HEIGHT / 2 + 50}
        anchor={0.5}
        style={restartStyle}
      />
    </pixiContainer>
  );
}

import { useCallback } from 'react';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';
import { CONFIG } from '../../config';

export function Instructions() {
  const draw = useCallback((g: PixiGraphics) => {
    g.clear();
    
    // Background panel
    const panelWidth = 180;
    const panelHeight = 80;
    const panelX = CONFIG.CANVAS_WIDTH - panelWidth - 20;
    const panelY = 20;
    
    g.roundRect(panelX, panelY, panelWidth, panelHeight, 8);
    g.fill({ color: 0x000000, alpha: 0.6 });
  }, []);

  const titleStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 14,
    fontWeight: 'bold',
    fill: 0xffd700,
  });

  const textStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 12,
    fill: 0xffffff,
  });

  const panelX = CONFIG.CANVAS_WIDTH - 180 - 20;

  return (
    <pixiContainer>
      <pixiGraphics draw={draw} />
      <pixiText
        text="Controls"
        x={panelX + 90}
        y={30}
        anchor={{ x: 0.5, y: 0 }}
        style={titleStyle}
      />
      <pixiText
        text="↑/W - Forward"
        x={panelX + 10}
        y={50}
        style={textStyle}
      />
      <pixiText
        text="↓/S - Backward"
        x={panelX + 10}
        y={66}
        style={textStyle}
      />
      <pixiText
        text="←/A →/D - Rotate"
        x={panelX + 10}
        y={82}
        style={textStyle}
      />
    </pixiContainer>
  );
}

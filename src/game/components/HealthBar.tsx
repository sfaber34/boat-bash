import { useCallback } from 'react';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';
import { CONFIG } from '../../config';

interface HealthBarProps {
  health: number;
  maxHealth: number;
}

export function HealthBar({ health, maxHealth }: HealthBarProps) {
  const healthPercent = health / maxHealth;
  const isLow = healthPercent <= 0.3;

  const draw = useCallback((g: PixiGraphics) => {
    g.clear();
    
    const { HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT, HEALTH_BAR_X, HEALTH_BAR_Y, PADDING } = CONFIG.UI;
    
    // Background
    g.roundRect(
      HEALTH_BAR_X - PADDING,
      HEALTH_BAR_Y - PADDING,
      HEALTH_BAR_WIDTH + PADDING * 2,
      HEALTH_BAR_HEIGHT + PADDING * 2 + 20,
      8
    );
    g.fill({ color: 0x000000, alpha: 0.6 });
    
    // Health bar background
    g.roundRect(HEALTH_BAR_X, HEALTH_BAR_Y + 20, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT, 4);
    g.fill({ color: CONFIG.COLORS.HEALTH_BAR_BG });
    
    // Health bar fill
    const fillWidth = HEALTH_BAR_WIDTH * healthPercent;
    if (fillWidth > 0) {
      g.roundRect(HEALTH_BAR_X, HEALTH_BAR_Y + 20, fillWidth, HEALTH_BAR_HEIGHT, 4);
      g.fill({ color: isLow ? CONFIG.COLORS.HEALTH_BAR_LOW : CONFIG.COLORS.HEALTH_BAR_FILL });
    }
    
    // Health bar border
    g.roundRect(HEALTH_BAR_X, HEALTH_BAR_Y + 20, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT, 4);
    g.stroke({ color: 0xffffff, width: 2, alpha: 0.5 });
  }, [healthPercent, isLow]);

  const textStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 14,
    fontWeight: 'bold',
    fill: CONFIG.COLORS.UI_TEXT,
  });

  return (
    <pixiContainer>
      <pixiGraphics draw={draw} />
      <pixiText
        text={`Hull: ${health}/${maxHealth}`}
        x={CONFIG.UI.HEALTH_BAR_X}
        y={CONFIG.UI.HEALTH_BAR_Y}
        style={textStyle}
      />
    </pixiContainer>
  );
}

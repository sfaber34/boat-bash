import { useEffect, useRef, useCallback } from 'react';
import { KEYS } from '../../config';
import type { InputState } from '../types';

export function useKeyboard() {
  const inputState = useRef<InputState>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((KEYS.UP as readonly string[]).includes(e.code)) inputState.current.up = true;
    if ((KEYS.DOWN as readonly string[]).includes(e.code)) inputState.current.down = true;
    if ((KEYS.LEFT as readonly string[]).includes(e.code)) inputState.current.left = true;
    if ((KEYS.RIGHT as readonly string[]).includes(e.code)) inputState.current.right = true;
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if ((KEYS.UP as readonly string[]).includes(e.code)) inputState.current.up = false;
    if ((KEYS.DOWN as readonly string[]).includes(e.code)) inputState.current.down = false;
    if ((KEYS.LEFT as readonly string[]).includes(e.code)) inputState.current.left = false;
    if ((KEYS.RIGHT as readonly string[]).includes(e.code)) inputState.current.right = false;
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return inputState;
}

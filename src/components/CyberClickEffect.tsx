import React, { useEffect, useState, useCallback, useRef } from 'react';
import { cyberAudio } from '../utils/cyberAudio';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const CyberClickEffect: React.FC = () => {
  const [ripples, setRipples] = useState<ClickRipple[]>([]);
  const nextId = useRef(0);
  const lastSoundTime = useRef(0);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    // Only handle primary button clicks (left click / touch)
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const x = e.clientX;
    const y = e.clientY;
    
    // Check if clicked element or its parent is interactive
    const target = e.target as HTMLElement | null;
    const isInteractive = Boolean(
      target?.closest('button') || 
      target?.closest('[role="button"]') || 
      target?.closest('a') || 
      target?.closest('.cursor-pointer') ||
      target?.closest('input') ||
      target?.closest('textarea')
    );

    const newId = ++nextId.current;
    const size = isInteractive ? 44 : 32;
    const color = isInteractive ? '#38bdf8' : '#818cf8';

    setRipples((prev) => {
      // Keep max 5 ripples at any time for zero overhead
      const filtered = prev.slice(-4);
      return [...filtered, { id: newId, x, y, size, color }];
    });

    // Auto-remove ripple after 380ms
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newId));
    }, 380);

    // Audio feedback on interactive elements with 80ms throttle
    if (isInteractive) {
      const now = performance.now();
      if (now - lastSoundTime.current > 80) {
        lastSoundTime.current = now;
        cyberAudio.playClick();
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [handlePointerDown]);

  if (ripples.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          style={{
            left: ripple.x,
            top: ripple.y,
            position: 'absolute',
          }}
          className="pointer-events-none -translate-x-1/2 -translate-y-1/2"
        >
          {/* Expanding Neon Cyber Ring */}
          <div
            style={{
              width: ripple.size * 1.6,
              height: ripple.size * 1.6,
              borderColor: ripple.color,
              boxShadow: `0 0 12px ${ripple.color}, inset 0 0 8px ${ripple.color}`,
            }}
            className="rounded-full border-2 animate-cyber-ring opacity-90"
          />

          {/* Center High-Energy Spark */}
          <div
            style={{
              backgroundColor: '#ffffff',
              boxShadow: `0 0 10px #ffffff, 0 0 16px ${ripple.color}`,
            }}
            className="w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 animate-cyber-spark"
          />

          {/* 4-Axis Cyber Crosshair Reticle Outlines */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 animate-cyber-crosshair pointer-events-none">
            {/* Top tick */}
            <span
              style={{ backgroundColor: ripple.color }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 rounded-full"
            />
            {/* Bottom tick */}
            <span
              style={{ backgroundColor: ripple.color }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-2 rounded-full"
            />
            {/* Left tick */}
            <span
              style={{ backgroundColor: ripple.color }}
              className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-0.5 rounded-full"
            />
            {/* Right tick */}
            <span
              style={{ backgroundColor: ripple.color }}
              className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-0.5 rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

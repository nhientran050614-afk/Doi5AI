import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

export const CyberCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const points: TrailPoint[] = [];
    const maxPoints = 22; // smooth length
    let lastX = -1;
    let lastY = -1;
    let animId: number | null = null;
    let isMouseActive = false;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Fade existing points
      for (let i = points.length - 1; i >= 0; i--) {
        const pt = points[i];
        pt.alpha *= 0.88;
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.size *= 0.94;

        if (pt.alpha < 0.02 || pt.size < 0.5) {
          points.splice(i, 1);
        }
      }

      // Draw glowing cyber stream
      if (points.length > 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Outer neon glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#06b6d4';

        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          // Water-blue to electric cyan gradient alpha
          ctx.strokeStyle = `rgba(34, 211, 238, ${p1.alpha * 0.7})`;
          ctx.lineWidth = Math.max(1, p1.size);
          ctx.stroke();
        }

        // Inner bright white/cyan core
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#ffffff';
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          ctx.strokeStyle = `rgba(224, 242, 254, ${p1.alpha * 0.9})`;
          ctx.lineWidth = Math.max(0.6, p1.size * 0.4);
          ctx.stroke();
        }

        // Tiny floating cyber spark nodes along path
        for (let i = 0; i < points.length; i += 3) {
          const pt = points[i];
          ctx.fillStyle = `rgba(103, 232, 249, ${pt.alpha})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, Math.max(1, pt.size * 0.45), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Continue animation loop as long as points exist or mouse is moving
      if (points.length > 0 || isMouseActive) {
        animId = requestAnimationFrame(render);
      } else {
        animId = null;
      }
    };

    const startLoop = () => {
      if (!animId) {
        animId = requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Only trigger for mouse / fine pointers (not rough mobile touch to preserve mobile UX)
      if (e.pointerType && e.pointerType !== 'mouse') return;

      const x = e.clientX;
      const y = e.clientY;

      let vx = 0;
      let vy = 0;

      if (lastX !== -1 && lastY !== -1) {
        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.hypot(dx, dy);

        // Add drifting momentum to trail particles
        if (dist > 1) {
          vx = -dx * 0.04;
          vy = -dy * 0.04;
        }

        // Interpolate extra point if mouse moved fast
        if (dist > 15) {
          points.push({
            x: lastX + dx * 0.5,
            y: lastY + dy * 0.5,
            vx,
            vy,
            alpha: 0.75,
            size: 4.5,
          });
        }
      }

      lastX = x;
      lastY = y;
      isMouseActive = true;

      points.push({
        x,
        y,
        vx,
        vy,
        alpha: 0.95,
        size: 5.5,
      });

      if (points.length > maxPoints) {
        points.shift();
      }

      startLoop();
    };

    const handleMouseLeave = () => {
      lastX = -1;
      lastY = -1;
      isMouseActive = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9990] overflow-hidden"
      aria-hidden="true"
    />
  );
};

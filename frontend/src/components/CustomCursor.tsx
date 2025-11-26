'use client';

import { useEffect, useState, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface TrailPoint extends Position {
  id: number;
}

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  
  const rafId = useRef<number>();
  const lastTrailTime = useRef<number>(0);
  const trailCounter = useRef<number>(0);

  useEffect(() => {
    // Check if device has fine pointer (desktop)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    let isUpdating = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (isUpdating) return;
      isUpdating = true;

      if (rafId.current) cancelAnimationFrame(rafId.current);
      
      rafId.current = requestAnimationFrame(() => {
        const newPosition = { x: e.clientX, y: e.clientY };
        
        // Update mouse position
        setMousePosition(newPosition);
        setIsVisible(true);

        // Check if hovering over clickable element (cached)
        const target = e.target as HTMLElement;
        const isClickable = target.tagName === 'A' || 
                           target.tagName === 'BUTTON' || 
                           target.onclick !== null ||
                           target.closest('button, a, [role="button"]') !== null;
        setIsPointer(isClickable);

        // Add trail point with throttling (every 50ms)
        const now = Date.now();
        if (now - lastTrailTime.current > 50) {
          lastTrailTime.current = now;
          setTrail(prev => {
            const newTrail = [
              { x: newPosition.x, y: newPosition.y, id: trailCounter.current++ },
              ...prev
            ].slice(0, 8); // Reduced to 8 points for better performance
            return newTrail;
          });
        }

        isUpdating = false;
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Trail Points - Reduced and optimized */}
      {trail.map((point, index) => {
        const opacity = 1 - (index / trail.length);
        const scale = 1 - (index / trail.length) * 0.4;
        
        return (
          <div
            key={point.id}
            className="fixed pointer-events-none z-[9998] will-change-transform"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: opacity * 0.5,
              transition: 'opacity 0.3s ease-out',
            }}
          >
            <div 
              className="w-1 h-1 rounded-full bg-orange-500"
              style={{
                filter: 'blur(1px)',
              }}
            />
          </div>
        );
      })}

      {/* Outer Glow Halo */}
      <div
        className="fixed pointer-events-none z-[9999] will-change-transform"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.3 : 1})`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <div 
          className="w-10 h-10 rounded-full bg-orange-500/15"
          style={{
            filter: 'blur(12px)',
            opacity: isPointer ? 0.35 : 0.2,
            transition: 'opacity 0.2s ease-out',
          }}
        />
      </div>

      {/* Middle Ring (only visible on hover) */}
      {isPointer && (
        <div
          className="fixed pointer-events-none z-[9999] will-change-transform"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div 
            className="w-7 h-7 rounded-full border border-orange-400/30 animate-pulse"
          />
        </div>
      )}

      {/* Inner Dot */}
      <div
        className="fixed pointer-events-none z-[9999] will-change-transform"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: `translate(-50%, -50%) scale(${isPointer ? 0.7 : 1})`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div 
          className="w-1.5 h-1.5 rounded-full bg-orange-400"
          style={{
            boxShadow: '0 0 8px rgba(251, 146, 60, 0.7)',
          }}
        />
      </div>
    </>
  );
}

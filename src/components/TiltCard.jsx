import React, { useEffect, useRef, useState } from 'react';

const MAX_TILT = 16; // degrees

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function TiltCard({ src, alt }) {
  const wrapRef = useRef(null);
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const updateFromPoint = (clientX, clientY) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = clamp01((clientX - rect.left) / rect.width);
    const py = clamp01((clientY - rect.top) / rect.height);

    setTilt({
      x: (0.5 - py) * MAX_TILT * 2, // rotateX: up/down
      y: (px - 0.5) * MAX_TILT * 2, // rotateY: left/right
    });
    setGlare({ x: px * 100, y: py * 100, opacity: 0.55 });
  };

  const handlePointerMove = (e) => {
    setActive(true);
    updateFromPoint(e.clientX, e.clientY);
  };

  const resetTilt = () => {
    setActive(false);
    setTilt({ x: 0, y: 0 });
    setGlare((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <div className="tilt-card-scene">
      <div
        ref={wrapRef}
        className={`tilt-card ${entered ? 'tilt-card--entered' : ''} ${active ? 'tilt-card--active' : ''}`}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          touchAction: 'none',
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        onPointerUp={resetTilt}
        onPointerCancel={resetTilt}
      >
        <img className="card-image" src={src} alt={alt} draggable={false} />
        <div
          className="tilt-card-glare"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.9), rgba(255,255,255,0) 55%)`,
            opacity: glare.opacity,
          }}
        />
      </div>
    </div>
  );
}

export default TiltCard;

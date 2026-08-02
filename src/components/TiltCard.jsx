import React, { useEffect, useRef, useState } from 'react';

const MAX_TILT = 16; // degrees
const DEVICE_TILT_RANGE = 18; // degrees of physical phone tilt that maps to full MAX_TILT

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function TiltCard({ src, placeholderSrc, alt, backText, attribution, glowKey = 'major' }) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const baselineRef = useRef(null);
  const activeRef = useRef(false);
  const [entered, setEntered] = useState(false);
  const [fullLoaded, setFullLoaded] = useState(false);
  const [active, setActive] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const motionEnabledRef = useRef(false);

  // The placeholder is an inline data URI (no network round trip), so the
  // card can enter as soon as it mounts — no need to wait on the full
  // image here.
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleFullImageLoad = () => {
    // Some mobile WebKit builds fail to repaint content inside a
    // perspective/preserve-3d element once an async image finishes
    // loading, until something else forces a reflow — read a layout
    // property here to nudge that reflow before we fade the full image in.
    // eslint-disable-next-line no-unused-expressions
    wrapRef.current?.offsetHeight;
    setFullLoaded(true);
  };

  useEffect(() => {
    if (imgRef.current?.complete) {
      handleFullImageLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOrientation = (e) => {
    if (activeRef.current) return; // an active touch-drag takes priority
    if (e.beta === null || e.gamma === null) return;
    if (baselineRef.current === null) {
      baselineRef.current = { beta: e.beta, gamma: e.gamma };
    }
    const dBeta = e.beta - baselineRef.current.beta;
    const dGamma = e.gamma - baselineRef.current.gamma;
    setTilt({
      x: clamp(-(dBeta / DEVICE_TILT_RANGE) * MAX_TILT, -MAX_TILT, MAX_TILT),
      y: clamp((dGamma / DEVICE_TILT_RANGE) * MAX_TILT, -MAX_TILT, MAX_TILT),
    });
  };

  const startMotion = () => {
    if (motionEnabledRef.current) return;
    motionEnabledRef.current = true;
    window.addEventListener('deviceorientation', handleOrientation);
  };

  useEffect(() => {
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (!isCoarsePointer || typeof window.DeviceOrientationEvent === 'undefined') return;

    // Skip entirely where this would require an explicit permission
    // prompt (iOS Safari) — not worth the extra friction/dialog here.
    if (typeof DeviceOrientationEvent.requestPermission === 'function') return;

    startMotion();

    return () => window.removeEventListener('deviceorientation', handleOrientation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    activeRef.current = true;
    setActive(true);
    updateFromPoint(e.clientX, e.clientY);
  };

  const resetTilt = () => {
    activeRef.current = false;
    setActive(false);
    setGlare((g) => ({ ...g, opacity: 0 }));
    if (!motionEnabledRef.current) {
      setTilt({ x: 0, y: 0 });
    }
  };

  const handleClick = () => {
    setFlipped((f) => !f);
  };

  return (
    <div className={`tilt-card-scene tilt-card-scene--${glowKey}`}>
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
        onClick={handleClick}
      >
        <div className={`flip-card-inner ${flipped ? 'flip-card-inner--flipped' : ''}`}>
          <div className="flip-card-face flip-card-front">
            {placeholderSrc && (
              <img
                className="card-image card-image--placeholder"
                src={placeholderSrc}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
            )}
            <img
              ref={imgRef}
              className={`card-image card-image--full ${fullLoaded ? 'card-image--full-visible' : ''}`}
              src={src}
              alt={alt}
              draggable={false}
              onLoad={handleFullImageLoad}
            />
          </div>
          <div className="flip-card-face flip-card-back">
            <div className="flip-card-back-content">
              <p>{backText}</p>
              {attribution && <p className="flip-card-attribution">— {attribution}</p>}
            </div>
          </div>
        </div>
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

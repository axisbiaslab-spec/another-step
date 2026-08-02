import React, { useEffect, useRef, useState } from 'react';
import ActivateCard from './ActivateCard';

const MAX_TILT = 16; // degrees
const DEVICE_TILT_RANGE = 18; // degrees of physical phone tilt that maps to full MAX_TILT
const SPARK_COUNT = 14;
const CELEBRATE_SPIN_DEG = 900; // 2.5 extra full turns — always lands back on a "front visible" angle
const CELEBRATE_DURATION_MS = 1100;
const FLASH_DURATION_MS = 550;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function isAlreadyUnlocked(cardCode) {
  if (!cardCode) return true; // no activation gate at all without a code
  try {
    return localStorage.getItem(`card-activated:${cardCode}`) === '1';
  } catch {
    return false;
  }
}

function TiltCard({ src, placeholderSrc, alt, backText, attribution, glowKey = 'major', cardId, cardCode, lang }) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const baselineRef = useRef(null);
  const activeRef = useRef(false);
  const [entered, setEntered] = useState(false);
  const [fullLoaded, setFullLoaded] = useState(false);
  const [active, setActive] = useState(false);
  const [rotation, setRotation] = useState(0); // multiples of 180 = flip state; keeps climbing, never resets
  const [peekOffset, setPeekOffset] = useState(0);
  const [hasFlippedOnce, setHasFlippedOnce] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [unlocked, setUnlocked] = useState(() => isAlreadyUnlocked(cardCode));
  const [glowBoost, setGlowBoost] = useState(() => isAlreadyUnlocked(cardCode) && Boolean(cardCode));
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

  // Nudges the card via the same `transition: transform` path that drives
  // real flips (rather than a separate CSS `animation`), so the very first
  // click never collides with a still-running keyframe animation on the
  // same property — that collision was making the first flip snap instead
  // of transitioning.
  useEffect(() => {
    if (hasFlippedOnce || celebrating || !entered) return;
    const loop = setInterval(() => {
      setPeekOffset(-22);
      setTimeout(() => setPeekOffset(0), 500);
    }, 4500);
    return () => clearInterval(loop);
  }, [hasFlippedOnce, celebrating, entered]);

  const handleClick = () => {
    if (celebrating) return;
    setPeekOffset(0);
    setRotation((r) => r + 180);
    setHasFlippedOnce(true);
  };

  const handleActivated = ({ replay } = {}) => {
    if (replay) {
      // Restored from a previous visit — already unlocked, no fireworks.
      setUnlocked(true);
      setGlowBoost(true);
      return;
    }
    setCelebrating(true);
    setShowFlash(true);
    setUnlocked(true); // un-blurs the image over the course of the spin
    setRotation((r) => r + CELEBRATE_SPIN_DEG);
    setTimeout(() => setShowFlash(false), FLASH_DURATION_MS);
    setTimeout(() => {
      setCelebrating(false);
      setGlowBoost(true); // stays boosted permanently once activated
    }, CELEBRATE_DURATION_MS);
  };

  return (
    <div
      className={`tilt-card-scene tilt-card-scene--${glowKey} ${glowBoost ? 'tilt-card-scene--boost' : ''}`}
      style={
        !unlocked
          ? { '--card-glow': 'rgba(190, 190, 190, 0.4)', '--card-glow-soft': 'rgba(190, 190, 190, 0.1)' }
          : undefined
      }
    >
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
        <div
          className={`flip-card-inner ${celebrating ? 'flip-card-inner--celebrating' : ''}`}
          style={{ transform: `rotateY(${rotation + peekOffset}deg)` }}
        >
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
              className={`card-image card-image--full ${fullLoaded ? 'card-image--full-visible' : ''} ${
                !unlocked ? 'card-image--locked' : ''
              }`}
              src={src}
              alt={alt}
              draggable={false}
              onLoad={handleFullImageLoad}
            />
            {!unlocked && (
              <div className="card-lock-badge" aria-hidden="true">
                <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="flip-card-face flip-card-back">
            <div className="flip-card-back-content">
              <p>{backText}</p>
              {attribution && <p className="flip-card-attribution">— {attribution}</p>}
            </div>
            <div className="flip-card-activate-slot" onClick={(e) => e.stopPropagation()}>
              <ActivateCard id={cardId} code={cardCode} lang={lang} onActivated={handleActivated} />
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
        {showFlash && <div className="tilt-card-flash" />}
        {celebrating && (
          <div className="tilt-card-sparks">
            {Array.from({ length: SPARK_COUNT }).map((_, i) => (
              <span
                key={i}
                className="tilt-card-spark"
                style={{ '--angle': `${(360 / SPARK_COUNT) * i}deg`, '--delay': `${(i % 4) * 0.03}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TiltCard;

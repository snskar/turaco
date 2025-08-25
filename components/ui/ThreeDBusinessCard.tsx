'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';
import OptimizedImage from './OptimizedImage';

/**
 * ThreeDBusinessCard
 * A realistic, mobile‑first 3D business card with pointer + gyroscope tilt,
 * parallax layers, dynamic specular glare (gloss/spot‑UV), and thickness/edge rendering.
 *
 * Goals vs. the original HolographicCard:
 * - Realistic proportions (ISO/IEC 7810 ID‑1 credit card: 85.6 × 54 mm → ~1.586 ratio)
 * - Feels like an actual physical card: thickness, edges, soft shadows
 * - Unifies input (pointer/touch) + optional device orientation for mobile
 * - Uses MotionValues for perf (no setState per frame); springy resets
 * - Respects prefers‑reduced‑motion
 * - Optional finishes: matte | gloss | holo (subtle by default)
 * - Optional spot‑UV via mask image (e.g., your logo) for premium shine
 */

export type CardFinish = 'matte' | 'gloss' | 'holo';

interface ThreeDBusinessCardProps {
  src: string; // front artwork/photo of the card
  alt: string;
  /**
   * Design width in px (used as an upper bound; component is responsive down to mobile)
   */
  width?: number; // default 360
  /**
   * Card aspect ratio (width / height). Real card ≈ 85.6/54 ≈ 1.586
   */
  aspectRatio?: number; // default 1.586
  className?: string;
  /**
   * Paper edge/thickness in CSS px (visual only)
   */
  thickness?: number; // default 2
  /**
   * Max tilt angle in degrees
   */
  maxTilt?: number; // default 16
  /**
   * Finish controls overall specular/glare strength and color treatment
   */
  finish?: CardFinish; // default 'matte'
  /**
   * Optional back image; if provided, tap toggles flip
   */
  backSrc?: string;
  /**
   * Optional image used as a mask to simulate spot‑UV (e.g., your logo). White = shiny area.
   */
  spotUvMaskSrc?: string;
  /**
   * Enable DeviceOrientation‑based tilt on mobile (user‑permissioned on iOS)
   */
  enableGyro?: boolean; // default true
  /**
   * Corner radius in px
   */
  borderRadius?: number; // default 14
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const supportsDeviceOrientation = () =>
  typeof window !== 'undefined' &&
  typeof window.DeviceOrientationEvent !== 'undefined';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ThreeDBusinessCard: React.FC<ThreeDBusinessCardProps> = ({
  src,
  alt,
  width = 360,
  aspectRatio = 85.6 / 54, // ≈1.586
  className = '',
  thickness = 2,
  maxTilt = 16,
  finish = 'matte',
  backSrc,
  spotUvMaskSrc,
  enableGyro = true,
  borderRadius = 14,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [gyroReady, setGyroReady] = useState(false);

  // Motion values for normalized tilt (-1 .. 1)
  const tiltX = useMotionValue(0); // left (-1) to right (1)
  const tiltY = useMotionValue(0); // top (-1) to bottom (1)

  // Derived transforms
  const rotateX = useTransform(tiltY, [-1, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(tiltX, [-1, 1], [-maxTilt, maxTilt]);
  const distance = useTransform([tiltX, tiltY], (values: number[]) =>
    Math.min(Math.hypot(values[0] || 0, values[1] || 0), 1)
  );
  const translateZ = useTransform(distance, [0, 1], [0, 20]);

  const shadowX = useTransform(tiltX, [-1, 1], [14, -14]);
  const shadowY = useTransform(tiltY, [-1, 1], [16, -6]);
  const shadowBlur = useTransform(distance, [0, 1], [24, 48]);
  const shadowOpacity = useTransform(distance, [0, 1], [0.22, 0.35]);

  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity})`;

  // Dynamic glare (specular highlight moves with tilt)
  const glarePosX = useTransform(tiltX, [-1, 1], [0, 100]);
  const glarePosY = useTransform(tiltY, [-1, 1], [0, 100]);
  const glareOpacity = useTransform(
    distance,
    [0, 1],
    [finish === 'matte' ? 0.08 : 0.16, finish === 'matte' ? 0.18 : 0.35]
  );
  const glare = useMotionTemplate`radial-gradient( circle at ${glarePosX}% ${glarePosY}%, rgba(255,255,255,${glareOpacity}) 0%, rgba(255,255,255,0) 45% )`;

  // Subtle color shift for holo (kept tasteful)
  const holoGradient = useMotionTemplate`conic-gradient(from 0deg at ${glarePosX}% ${glarePosY}%, rgba(255,0,102,0.18), rgba(255,200,0,0.15), rgba(0,220,255,0.18), rgba(180,90,255,0.18), rgba(255,0,102,0.18))`;

  // Paper micro‑texture: very subtle noise via SVG turbulence data URI
  const noiseDataUri = useMemo(() => {
    const svg = encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>\n  <filter id='n'>\n    <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/>\n    <feColorMatrix type='saturate' values='0'/>\n    <feComponentTransfer>\n      <feFuncA type='table' tableValues='0 0 0 0 0 0.03 0.06 0.03 0'/>\n    </feComponentTransfer>\n  </filter>\n  <rect width='100%' height='100%' filter='url(%23n)'/>\n</svg>`
    );
    return `url("data:image/svg+xml;utf8,${svg}")`;
  }, []);

  // const cardHeight = useMemo(() => Math.round(width / aspectRatio), [width, aspectRatio]);

  const resetTilt = () => {
    const spring = { type: 'spring', stiffness: 200, damping: 20 } as const;
    animate(tiltX, 0, spring);
    animate(tiltY, 0, spring);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1
    const nx = clamp(x * 2 - 1, -1, 1);
    const ny = clamp(y * 2 - 1, -1, 1);
    tiltX.set(nx);
    tiltY.set(ny);
  };

  const onPointerLeave = () => {
    setIsHovering(false);
    resetTilt();
  };

  const onPointerEnter = () => setIsHovering(true);

  // Gyroscope (user‑permissioned on iOS). We enable only when user taps the card once.
  useEffect(() => {
    if (!enableGyro || !supportsDeviceOrientation() || prefersReducedMotion())
      return;

    let listening = false;
    let cleanup: (() => void) | null = null;

    const start = async () => {
      try {
        // iOS requires explicit permission
        // @ts-expect-error - requestPermission not in TS lib for some targets
        if (
          typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
          // We wait for the first user gesture (pointerdown) to request permission
          const ask = async () => {
            // @ts-expect-error - DeviceOrientationEvent.requestPermission is not in standard types
            const res = await DeviceOrientationEvent.requestPermission();
            if (res === 'granted') {
              window.removeEventListener('pointerdown', ask);
              attach();
              setGyroReady(true);
            }
          };
          window.addEventListener('pointerdown', ask, { once: true });
          cleanup = () => window.removeEventListener('pointerdown', ask);
        } else {
          // Android / desktop Safari etc.
          attach();
          setGyroReady(true);
        }
      } catch {
        // silently ignore; user can still use pointer tilt
      }
    };

    const attach = () => {
      if (listening) return;
      listening = true;
      const handler = (evt: DeviceOrientationEvent) => {
        const b = evt.beta ?? 0; // front/back tilt (-180..180)
        const g = evt.gamma ?? 0; // left/right tilt (-90..90)
        // Normalize to ~phone in portrait held in front of user
        const nx = clamp(g / 30, -1, 1);
        const ny = clamp((b - 45) / 30, -1, 1); // shift by ~45° as neutral holding angle
        if (!isHovering) {
          tiltX.set(nx);
          tiltY.set(ny);
        }
      };
      window.addEventListener('deviceorientation', handler, { passive: true });
      cleanup = () => window.removeEventListener('deviceorientation', handler);
    };

    start();
    return () => {
      if (cleanup) cleanup();
    };
  }, [enableGyro, isHovering, tiltX, tiltY]);

  // Prefer reduced motion: keep it flat
  const reduced = prefersReducedMotion();

  // Finish presets
  const finishMixBlend =
    finish === 'matte'
      ? 'overlay'
      : finish === 'gloss'
        ? 'screen'
        : 'color-dodge';
  const finishOpacity =
    finish === 'matte' ? 0.08 : finish === 'gloss' ? 0.18 : 0.22;

  // Responsive sizing: use min(92vw, width)
  const cssW = `min(92vw, ${width}px)`;
  const cssH = `calc(${cssW} / ${aspectRatio})`;

  // Edge shade intensity varies with tilt
  const edgeOpacityLeft = useTransform(tiltX, [-1, 1], [0.22, 0.02]);
  const edgeOpacityRight = useTransform(tiltX, [-1, 1], [0.02, 0.22]);
  const edgeOpacityTop = useTransform(tiltY, [-1, 1], [0.22, 0.02]);
  const edgeOpacityBottom = useTransform(tiltY, [-1, 1], [0.02, 0.22]);

  // Flip handling (if backSrc provided)
  const onTap = () => {
    if (backSrc) setIsFlipped(s => !s);
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative select-none ${className}`}
      style={{
        width: cssW,
        height: cssH,
        perspective: 1400,
        WebkitPerspective: 1400 as React.CSSProperties['WebkitPerspective'],
      }}
      aria-label="3D business card"
    >
      <motion.div
        ref={cardRef}
        role="img"
        aria-label={alt}
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={() => setIsHovering(true)}
        onPointerUp={() => setIsHovering(false)}
        onClick={onTap}
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          borderRadius,
          touchAction: 'none',
          willChange: 'transform',
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          translateZ: reduced ? 0 : translateZ,
          boxShadow: reduced ? undefined : boxShadow,
          backgroundColor: '#0b0d13',
        }}
        className="relative overflow-visible cursor-pointer"
      >
        {/* CARD STACK (front/back) */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility:
              'hidden' as React.CSSProperties['WebkitBackfaceVisibility'],
            transformStyle: 'preserve-3d',
            rotateY: isFlipped ? 180 : 0,
          }}
        >
          {/* Paper core (adds thickness color) */}
          <div
            className="absolute inset-0 rounded-[inherit]"
            style={{
              background: '#f2f2f2',
              opacity: 0.9,
              mixBlendMode: 'multiply',
              zIndex: 0,
            }}
          />

          {/* Front artwork */}
          <div className="absolute inset-0 rounded-[inherit] overflow-hidden z-[1]">
            <OptimizedImage
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 92vw, 360px"
              priority
              loading="eager"
              useCloudinary={false}
              style={{ transform: 'translateZ(0.01px)' }}
            />
          </div>

          {/* Paper micro‑texture */}
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-[2]"
            style={{
              backgroundImage:
                noiseDataUri as React.CSSProperties['backgroundImage'],
              opacity: 0.08,
              mixBlendMode: 'multiply',
            }}
          />

          {/* Spot‑UV gloss (masked by provided logo graphic) */}
          {spotUvMaskSrc && (
            <motion.div
              className="absolute inset-0 rounded-[inherit] pointer-events-none z-[3]"
              style={{
                backgroundImage: glare,
                mixBlendMode: 'screen',
                opacity: 0.55,
                WebkitMaskImage: `url(${spotUvMaskSrc})`,
                maskImage: `url(${spotUvMaskSrc})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
              }}
            />
          )}

          {/* Global finish (gloss/matte/holo) */}
          <motion.div
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-[4]"
            style={{
              backgroundImage: finish === 'holo' ? holoGradient : glare,
              mixBlendMode:
                finishMixBlend as React.CSSProperties['mixBlendMode'],
              opacity: finishOpacity,
              filter: finish === 'gloss' ? 'blur(0.2px)' : undefined,
            }}
          />
        </motion.div>

        {/* BACK side (if provided) */}
        {backSrc && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility:
                'hidden' as React.CSSProperties['WebkitBackfaceVisibility'],
              transformStyle: 'preserve-3d',
              rotateY: isFlipped ? 0 : -180,
            }}
          >
            <OptimizedImage
              src={backSrc}
              alt={`${alt} (back)`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 92vw, 360px"
              priority={false}
              loading="lazy"
              useCloudinary={false}
              style={{ transform: 'translateZ(0.01px)' }}
            />

            {/* Apply subtle global finish to back as well */}
            <motion.div
              className="absolute inset-0 rounded-[inherit] pointer-events-none"
              style={{
                backgroundImage: finish === 'holo' ? holoGradient : glare,
                mixBlendMode:
                  finishMixBlend as React.CSSProperties['mixBlendMode'],
                opacity: finish === 'matte' ? 0.06 : 0.14,
              }}
            />
          </motion.div>
        )}

        {/* Edges to suggest thickness */}
        <motion.div
          aria-hidden
          className="absolute left-0 top-0 bottom-0"
          style={{
            width: thickness,
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.05))',
            opacity: edgeOpacityLeft,
            transform: 'translateZ(-0.5px)',
          }}
        />
        <motion.div
          aria-hidden
          className="absolute right-0 top-0 bottom-0"
          style={{
            width: thickness,
            borderTopRightRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.3))',
            opacity: edgeOpacityRight,
            transform: 'translateZ(-0.5px)',
          }}
        />
        <motion.div
          aria-hidden
          className="absolute left-0 right-0 top-0"
          style={{
            height: thickness,
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.25), rgba(0,0,0,0.05))',
            opacity: edgeOpacityTop,
            transform: 'translateZ(-0.5px)',
          }}
        />
        <motion.div
          aria-hidden
          className="absolute left-0 right-0 bottom-0"
          style={{
            height: thickness,
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.05), rgba(0,0,0,0.25))',
            opacity: edgeOpacityBottom,
            transform: 'translateZ(-0.5px)',
          }}
        />
      </motion.div>

      {/* Hint / helper badges */}
      {enableGyro &&
        supportsDeviceOrientation() &&
        !gyroReady &&
        !prefersReducedMotion() && (
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-neutral-400">
            Tap once to enable motion tilt
          </div>
        )}
      {backSrc && (
        <div className="absolute -bottom-7 right-0 text-xs text-neutral-400">
          Tap to flip
        </div>
      )}
    </div>
  );
};

export default ThreeDBusinessCard;

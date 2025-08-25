'use client';

import React, { useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

/**
 * MobileDeviceFrame
 * ----------------------------------------------------------------------------
 * Drop-in React component to showcase any website or React component inside a
 * realistic, responsive mobile phone frame. Built for Next.js + Tailwind.
 *
 * Features
 * - Works with either an external URL (iframe) or your own React component
 * - True rounded screen with safe-area padding and camera notch
 * - Subtle 3D parallax tilt on hover/touch (can be disabled)
 * - High-DPI look: crisp bezels, soft inner shadows, reflection layer
 * - Fully responsive: control width; height follows phone aspect ratio
 * - Production-friendly iframe defaults (sandbox + allow attrs)
 * - Loading shimmer until iframe is ready
 *
 * Example usage (URL embed):
 *   <MobileDeviceFrame url="https://example.com/demo" title="Product demo" />
 *
 * Example usage (your own component):
 *   <MobileDeviceFrame>
 *     <MyDigitalProductDemo />
 *   </MobileDeviceFrame>
 */

export type MobileDeviceFrameProps = {
  /** If provided, renders an interactive iframe. Otherwise, renders children. */
  url?: string;
  /** Accessible title for the iframe embed */
  title?: string;
  /** Optional React content to render instead of an iframe */
  children?: React.ReactNode;
  /** Outer width in pixels; the frame is responsive so use Tailwind width classes too */
  width?: number;
  /** Phone aspect ratio (width / height). Default is 9 / 19.5 (modern phones). */
  aspectRatio?: number;
  /** Show camera notch + status bar garnish */
  showNotch?: boolean;
  /** Enable subtle 3D hover tilt */
  tilt?: boolean;
  /** Additional Tailwind classes on container */
  className?: string;
  /** iframe permissions (when url is used) */
  allow?: string;
  /** iframe sandbox flags (when url is used) */
  sandbox?: string;
  /** Lazy-load iframe (when url is used). Default: 'lazy' */
  loading?: 'lazy' | 'eager';
  /** Allow fullscreen for iframe embeds */
  allowFullScreen?: boolean;
};

export default function MobileDeviceFrame({
  url,
  title,
  children,
  width = 360,
  aspectRatio = 9 / 19.5,
  showNotch = true,
  tilt = true,
  className,
  allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
  sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups allow-downloads',
  loading = 'lazy',
  allowFullScreen = true,
}: MobileDeviceFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Motion values for parallax tilt
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useTransform(rx, [0, 1], [8, -8]); // invert Y for natural tilt
  const rotateY = useTransform(ry, [0, 1], [-8, 8]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tilt || !containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    rx.set(y);
    ry.set(x);
  };

  const handlePointerLeave = () => {
    rx.set(0.5);
    ry.set(0.5);
  };

  // Initialize center tilt so it relaxes to neutral
  React.useEffect(() => {
    rx.set(0.5);
    ry.set(0.5);
  }, [rx, ry]);

  const style = useMemo<React.CSSProperties>(
    () => ({
      width,
      aspectRatio: `${aspectRatio}`,
    }),
    [width, aspectRatio]
  );

  const Screen = (
    <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-black shadow-inner">
      {/* Subtle glass reflection */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5" />

      {/* Optional notch */}
      {showNotch && (
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-20 h-6 w-40 -translate-x-1/2 rounded-b-2xl bg-black/95 shadow-[0_6px_12px_-6px_rgba(0,0,0,0.6)]"
          aria-hidden
        >
          <div className="mx-auto mt-1 h-1.5 w-12 rounded-full bg-zinc-700/80" />
        </div>
      )}

      {/* Safe-area padding under the notch so your content isn't hidden when not using iframe */}
      {!url && showNotch && <div className="h-6" aria-hidden />}

      {/* Content area */}
      <div className="absolute inset-0">
        {url ? (
          <>
            {!loaded && <ShimmerOverlay />}
            <iframe
              title={title || 'Embedded demo'}
              src={url}
              className="h-full w-full border-0"
              loading={loading}
              allow={allow}
              sandbox={sandbox}
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen={allowFullScreen}
              onLoad={() => setLoaded(true)}
            />
          </>
        ) : (
          <div className="h-full w-full">{children}</div>
        )}
      </div>

      {/* Inner drop shadow for bezel depth */}
      <div className="pointer-events-none absolute inset-0 rounded-[2.2rem] ring-1 ring-black/20" />
    </div>
  );

  return (
    <motion.div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={tilt ? { ...style, rotateX, rotateY } : style}
      className={[
        'relative select-none',
        'will-change-transform',
        'drop-shadow-xl',
        className || '',
      ].join(' ')}
      transition={{ type: 'spring', stiffness: 120, damping: 12, mass: 0.6 }}
      role="figure"
      aria-label={
        title ? `Mobile device showing ${title}` : 'Mobile device preview'
      }
    >
      {/* Outer chrome / body */}
      <div className="absolute inset-0 rounded-[2.6rem] bg-gradient-to-br from-zinc-800 to-zinc-900" />
      <div className="absolute inset-[6px] rounded-[2.4rem] bg-gradient-to-br from-zinc-700 to-zinc-800" />

      {/* Side buttons (decorative) */}
      <div className="absolute left-[-4px] top-20 h-16 w-1.5 rounded-r bg-zinc-600/80" />
      <div className="absolute right-[-4px] top-28 h-10 w-1.5 rounded-l bg-zinc-600/80" />

      {/* Actual screen inset */}
      <div className="absolute inset-[14px] rounded-[2.2rem] bg-black">
        {Screen}
      </div>

      {/* Floor shadow */}
      <div
        className="pointer-events-none absolute -bottom-4 left-6 right-6 h-6 rounded-full opacity-50 blur-md"
        style={{
          background:
            'radial-gradient(closest-side, rgba(0,0,0,0.25), transparent)',
        }}
      />
    </motion.div>
  );
}

function ShimmerOverlay() {
  return (
    <div
      className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.06)_,45%,rgba(255,255,255,0.18)_,55%,rgba(255,255,255,0.06)_)] bg-[length:200%_100%]"
      aria-hidden
    />
  );
}

/** -------------------------------------------------------------------------
 * Optional: Quick demo component
 * You can delete the part below. It’s provided so the Canvas preview shows
 * something useful, and as a reference for your homepage usage.
 * --------------------------------------------------------------------------*/
export function DemoShowcase() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-rose-50 to-sky-50 p-8 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Interactable URL
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            This phone renders an actual website inside an iframe with sensible
            permissions enabled.
          </p>
          <MobileDeviceFrame
            url="https://www.wikipedia.org/"
            title="Wikipedia"
            width={360}
            className="mx-auto"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Your React component
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Drop your digital product component as children for a fully local,
            SSR-friendly demo.
          </p>
          <MobileDeviceFrame width={360} className="mx-auto">
            <FakeDigitalProduct />
          </MobileDeviceFrame>
        </div>
      </div>
    </div>
  );
}

function FakeDigitalProduct() {
  // A tiny placeholder component to emulate your digital product
  const [count, setCount] = useState(0);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-zinc-900 to-black p-6 text-white">
      <div className="text-center">
        <div className="text-xs uppercase tracking-widest text-zinc-300">
          Turaco Ink
        </div>
        <div className="text-2xl font-semibold">Heartlink Preview</div>
      </div>
      <button
        className="rounded-xl bg-white/10 px-4 py-2 text-sm backdrop-blur transition hover:bg-white/20"
        onClick={() => setCount(c => c + 1)}
      >
        Tap Me ({count})
      </button>
      <div className="text-xs text-zinc-400">
        This is running as a local React child.
      </div>
    </div>
  );
}

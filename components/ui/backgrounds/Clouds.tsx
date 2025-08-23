'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface CloudProps {
  children?: React.ReactNode;
  density?: number;
  minSize?: number;
  maxSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
  zIndex?: number;
  opacity?: number;
  staticRatio?: number; // Ratio of static vs animated clouds (0-1)
}

interface Cloud {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  imageIndex: number;
  direction: 1 | -1;
  opacity: number;
  isStatic: boolean; // Whether this cloud is static or animated
}

const CLOUD_IMAGES = [
  '/assets/clouds/cloud1.png',
  '/assets/clouds/cloud2.png',
  '/assets/clouds/cloud3.png',
  '/assets/clouds/cloud4.png',
  '/assets/clouds/cloud5.png',
  '/assets/clouds/cloud6.png',
];

function debounce<T extends (...args: unknown[]) => void>(fn: T, wait: number) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function generateCloud(
  id: number,
  width: number,
  height: number,
  minSize: number,
  maxSize: number,
  minSpeed: number,
  maxSpeed: number,
  baseOpacity: number,
  staticRatio: number = 0.5
): Cloud {
  const size = minSize + Math.random() * (maxSize - minSize);
  const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
  const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
  const isStatic = Math.random() < staticRatio;

  // Static clouds are positioned randomly across the screen
  // Animated clouds start off-screen, but some start partially visible for immediate effect
  const x = isStatic
    ? Math.random() * width
    : direction === 1
      ? -size + Math.random() * 0.3 * width // Some start partially visible from left
      : width + size - Math.random() * 0.3 * width; // Some start partially visible from right
  const y = Math.random() * height;

  return {
    id,
    x,
    y,
    size,
    speed,
    imageIndex: Math.floor(Math.random() * CLOUD_IMAGES.length),
    direction,
    opacity: baseOpacity * (0.7 + Math.random() * 0.3),
    isStatic,
  };
}

const CloudItem = React.memo(
  ({
    cloud,
    dimensions,
    regenerate,
  }: {
    cloud: Cloud;
    dimensions: { width: number; height: number };
    regenerate: (id: number) => void;
  }) => {
    const controls = useAnimation();

    useEffect(() => {
      if (cloud.isStatic) {
        // Static clouds just stay in place with no animations
        controls.set({ x: cloud.x, y: cloud.y });
        console.log(
          `Static cloud ${cloud.id} positioned at (${cloud.x.toFixed(0)}, ${cloud.y.toFixed(0)})`
        );
        return;
      }

      // Animated clouds have movement animations
      const { x, y, size, speed, direction, id } = cloud;
      const toX = direction === 1 ? dimensions.width + size : -size;

      controls.set({ x, y });
      console.log(
        `Animated cloud ${cloud.id} starting at (${x.toFixed(0)}, ${y.toFixed(0)}) moving to ${toX.toFixed(0)}, speed: ${speed.toFixed(1)}`
      );

      // Subtle vertical bobbing for animated clouds only
      controls.start({
        y: [y, y + Math.sin(x) * 15, y], // Reduced amplitude
        transition: {
          duration: 15 + Math.random() * 10, // Faster animation for more visible movement
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        },
      });

      // Horizontal movement - faster for more visible effect
      const duration = Math.max(
        5,
        (dimensions.width + size * 2) / (speed * 1.5)
      ); // 50% faster movement
      controls
        .start({
          x: toX,
          transition: {
            duration,
            ease: 'linear',
          },
        })
        .then(() => {
          console.log(
            `Animated cloud ${cloud.id} completed movement, regenerating`
          );
          regenerate(id);
        });
    }, [cloud, dimensions, controls, regenerate]);

    return (
      <motion.div
        animate={controls}
        className="absolute will-change-transform"
        style={{
          width: cloud.size,
          height: cloud.size,
          transform: 'translate3d(0,0,0)', // Force hardware acceleration
        }}
      >
        <OptimizedImage
          src={CLOUD_IMAGES[cloud.imageIndex]}
          alt="Cloud"
          fill
          className="object-contain"
          style={{ opacity: cloud.opacity }}
          priority={cloud.id < 2}
          loading={cloud.id < 2 ? 'eager' : 'lazy'}
          sizes="(max-width: 400px) 200px, 300px"
          quality={70}
          useCloudinary={true}
        />
      </motion.div>
    );
  }
);

CloudItem.displayName = 'CloudItem';

export const Clouds: React.FC<CloudProps> = ({
  children,
  density = 8, // Increased from 5 to 8 for higher density
  minSize = 100,
  maxSize = 300,
  minSpeed = 10,
  maxSpeed = 30,
  zIndex = -1,
  opacity = 0.3,
  staticRatio = 0.6, // 60% static, 40% animated for better performance
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [clouds, setClouds] = useState<Cloud[]>([]);

  const initializeClouds = useCallback(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    setDimensions({ width, height });

    const area = width * height;
    const count = Math.max(1, Math.floor((area / 1_000_000) * density));

    const newClouds: Cloud[] = [];
    for (let i = 0; i < count; i++) {
      newClouds.push(
        generateCloud(
          i,
          width,
          height,
          minSize,
          maxSize,
          minSpeed,
          maxSpeed,
          opacity,
          staticRatio
        )
      );
    }

    // Debug logging
    const staticCount = newClouds.filter(c => c.isStatic).length;
    const animatedCount = newClouds.filter(c => !c.isStatic).length;
    console.log(
      `Generated ${count} clouds: ${staticCount} static, ${animatedCount} animated (${((animatedCount / count) * 100).toFixed(1)}% animated)`
    );

    setClouds(newClouds);
  }, [density, minSize, maxSize, minSpeed, maxSpeed, opacity, staticRatio]);

  const regenerate = useCallback(
    (id: number) => {
      setClouds(prev =>
        prev.map(c => {
          if (c.id !== id) return c;

          // Don't regenerate static clouds - they stay in place
          if (c.isStatic) return c;

          // Only regenerate animated clouds
          return generateCloud(
            id,
            dimensions.width,
            dimensions.height,
            minSize,
            maxSize,
            minSpeed,
            maxSpeed,
            opacity,
            0 // Force new clouds to be animated (staticRatio = 0) to replace the one that just exited
          );
        })
      );
    },
    [dimensions, minSize, maxSize, minSpeed, maxSpeed, opacity]
  );

  useEffect(() => {
    initializeClouds();
    const debounced = debounce(initializeClouds, 200);
    const observer = new ResizeObserver(debounced);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [initializeClouds]);

  useEffect(() => {
    CLOUD_IMAGES.forEach(src => (new window.Image().src = src));
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ zIndex }}
    >
      {clouds.map(cloud => (
        <CloudItem
          key={cloud.id}
          cloud={cloud}
          dimensions={dimensions}
          regenerate={regenerate}
        />
      ))}
      {children}
    </div>
  );
};

export default Clouds;

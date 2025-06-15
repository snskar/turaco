"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CloudProps {
  children?: React.ReactNode;
  density?: number; // Number of clouds per 1000px² (default: 3)
  minSize?: number; // Minimum cloud size in pixels (default: 100)
  maxSize?: number; // Maximum cloud size in pixels (default: 300)
  minSpeed?: number; // Minimum drift speed in pixels per second (default: 10)
  maxSpeed?: number; // Maximum drift speed in pixels per second (default: 30)
  zIndex?: number; // z-index for the clouds layer (default: -1)
  opacity?: number; // Opacity of clouds (default: 0.3)
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
  key: string; // Add a unique key for regeneration
}

const CLOUD_IMAGES = [
  '/assets/clouds/cloud1.png',
  '/assets/clouds/cloud2.png',
  '/assets/clouds/cloud3.png',
  '/assets/clouds/cloud4.png',
  '/assets/clouds/cloud5.png',
  '/assets/clouds/cloud6.png',
];

const generateCloud = (
  id: number,
  width: number,
  height: number,
  minSize: number,
  maxSize: number,
  minSpeed: number,
  maxSpeed: number,
  opacity: number,
  direction: 1 | -1,
  forceSection?: number
): Cloud => {
  const size = minSize + Math.random() * (maxSize - minSize);
  const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
  
  // If forceSection is provided, use it for vertical positioning
  let y;
  if (typeof forceSection === 'number') {
    const sectionSize = height / 3;
    const sectionStart = sectionSize * forceSection;
    y = sectionStart + Math.random() * sectionSize;
  } else {
    y = Math.random() * height;
  }

  return {
    id,
    // Start position based on direction
    x: direction === 1 ? -size : width,
    y,
    size,
    speed,
    imageIndex: Math.floor(Math.random() * CLOUD_IMAGES.length),
    direction,
    opacity: opacity * (0.7 + Math.random() * 0.3),
    key: `cloud-${id}-${Date.now()}`, // Unique key for regeneration
  };
};

export const Clouds: React.FC<CloudProps> = ({
  children,
  density = 5,
  minSize = 100,
  maxSize = 300,
  minSpeed = 10,
  maxSpeed = 30,
  zIndex = -1,
  opacity = 0.3,
}) => {
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });
  const isInitialized = useRef(false);

  // Preload cloud images
  useEffect(() => {
    CLOUD_IMAGES.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const initializeClouds = useCallback(() => {
    if (!containerRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    setDimensions({ width, height });

    const area = width * height;
    const numberOfClouds = Math.max(1, Math.floor((area / 1000000) * density));

    const newClouds: Cloud[] = [];
    const verticalSections = 3;
    const cloudsPerSection = Math.ceil(numberOfClouds / verticalSections);
    
    for (let section = 0; section < verticalSections; section++) {
      for (let i = 0; i < cloudsPerSection; i++) {
        const id = section * cloudsPerSection + i;
        const direction = Math.random() > 0.5 ? 1 : -1;
        const cloud = generateCloud(
          id,
          width,
          height,
          minSize,
          maxSize,
          minSpeed,
          maxSpeed,
          opacity,
          direction,
          section
        );
        newClouds.push(cloud);
      }
    }

    setClouds(newClouds);
    isInitialized.current = true;
  }, [density, minSize, maxSize, minSpeed, maxSpeed, opacity]);

  const regenerateCloud = useCallback((cloud: Cloud) => {
    if (!containerRef.current) return cloud;

    const { width, height } = dimensions;
    return generateCloud(
      cloud.id,
      width,
      height,
      minSize,
      maxSize,
      minSpeed,
      maxSpeed,
      opacity,
      cloud.direction * -1 as 1 | -1,
      Math.floor(Math.random() * 3)
    );
  }, [dimensions, minSize, maxSize, minSpeed, maxSpeed, opacity]);

  const handleAnimationComplete = useCallback((cloud: Cloud) => {
    setClouds(prevClouds => 
      prevClouds.map(c => 
        c.key === cloud.key ? regenerateCloud(cloud) : c
      )
    );
  }, [regenerateCloud]);

  useEffect(() => {
    if (!isInitialized.current) {
      initializeClouds();
    }

    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        initializeClouds();
      }
    });

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
      observer.disconnect();
    };
  }, [initializeClouds]);

  const cloudAnimations = useMemo(() => 
    clouds.map((cloud) => ({
      initial: { x: cloud.x, y: cloud.y },
      animate: {
        x: cloud.direction === 1
          ? [cloud.x, dimensions.width + cloud.size]
          : [cloud.x, -cloud.size],
        y: [
          cloud.y,
          cloud.y + Math.sin(cloud.x) * 50,
          cloud.y,
        ],
      },
      transition: {
        x: {
          duration: (dimensions.width + cloud.size * 2) / cloud.speed,
          ease: "linear",
          repeat: 0,
        },
        y: {
          duration: 20 + Math.random() * 10,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        },
      },
    })), [clouds, dimensions]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ zIndex }}
    >
      {clouds.map((cloud, index) => (
        <motion.div
          key={cloud.key}
          className="absolute"
          style={{
            width: cloud.size,
            height: cloud.size,
          }}
          {...cloudAnimations[index]}
          onAnimationComplete={() => handleAnimationComplete(cloud)}
        >
          <Image
            src={CLOUD_IMAGES[cloud.imageIndex]}
            alt="Cloud"
            fill
            className="object-contain select-none pointer-events-none"
            style={{ opacity: cloud.opacity }}
            priority={index < 3} // Prioritize loading first few clouds
            unoptimized
          />
        </motion.div>
      ))}
      {children}
    </div>
  );
};

export default Clouds; 
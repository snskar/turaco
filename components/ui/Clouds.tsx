"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
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
}

const CLOUD_IMAGES = [
  '/assets/clouds/cloud1.png',
  '/assets/clouds/cloud2.png',
  '/assets/clouds/cloud3.png',
  '/assets/clouds/cloud4.png',
  '/assets/clouds/cloud5.png',
  '/assets/clouds/cloud6.png',
];

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
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 }); // Default size to prevent initial flash

  const initializeClouds = useCallback(() => {
    if (!containerRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    if (width === 0 || height === 0) return; // Don't initialize if container has no size

    setDimensions({ width, height });

    // Calculate number of clouds based on density and area
    const area = width * height;
    const numberOfClouds = Math.max(1, Math.floor((area / 1000000) * density));

    const newClouds: Cloud[] = Array.from({ length: numberOfClouds }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: minSize + Math.random() * (maxSize - minSize),
      speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
      imageIndex: Math.floor(Math.random() * CLOUD_IMAGES.length),
      direction: Math.random() > 0.5 ? 1 : -1,
      opacity: opacity * (0.7 + Math.random() * 0.3),
    }));

    setClouds(newClouds);
  }, [density, minSize, maxSize, minSpeed, maxSpeed, opacity]);

  useEffect(() => {
    // Initial setup
    initializeClouds();

    // Setup resize observer
    const observer = new ResizeObserver(() => {
      initializeClouds();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      observer.disconnect();
    };
  }, [initializeClouds]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ zIndex }}
    >
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute"
          style={{
            width: cloud.size,
            height: cloud.size,
          }}
          initial={{ x: cloud.x, y: cloud.y }}
          animate={{
            x: [
              cloud.x,
              cloud.direction === 1
                ? dimensions.width + cloud.size
                : -cloud.size,
            ],
            y: [
              cloud.y,
              cloud.y + Math.sin(cloud.x) * 50,
              cloud.y,
            ],
          }}
          transition={{
            x: {
              duration: (dimensions.width + cloud.size * 2) / cloud.speed,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            },
            y: {
              duration: 20 + Math.random() * 10,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            },
          }}
        >
          <Image
            src={CLOUD_IMAGES[cloud.imageIndex]}
            alt="Cloud"
            fill
            className="object-contain select-none pointer-events-none"
            style={{ opacity: cloud.opacity }}
            priority={false}
            unoptimized // Use this to prevent Next.js image optimization which might cause issues with cloud images
          />
        </motion.div>
      ))}
      {children}
    </div>
  );
};

export default Clouds; 
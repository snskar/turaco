"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

interface CloudProps {
  children?: React.ReactNode;
  density?: number;
  minSize?: number;
  maxSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
  zIndex?: number;
  opacity?: number;
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
  "/assets/clouds/cloud1.png",
  "/assets/clouds/cloud2.png",
  "/assets/clouds/cloud3.png",
  "/assets/clouds/cloud4.png",
  "/assets/clouds/cloud5.png",
  "/assets/clouds/cloud6.png",
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
  baseOpacity: number
): Cloud {
  const size = minSize + Math.random() * (maxSize - minSize);
  const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
  const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
  const x = direction === 1 ? -size : width + size;
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
      const { x, y, size, speed, direction, id } = cloud;
      const toX = direction === 1
        ? dimensions.width + size
        : -size;

      controls.set({ x, y });

      controls.start({
        y: [y, y + Math.sin(x) * 30, y],
        transition: {
          duration: 15 + Math.random() * 10,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        },
      });

      controls
        .start({
          x: toX,
          transition: {
            duration: (dimensions.width + size * 2) / speed,
            ease: "linear",
          },
        })
        .then(() => regenerate(id));
    }, [cloud, dimensions, controls, regenerate]);

    return (
      <motion.div
        animate={controls}
        className="absolute"
        style={{
          width: cloud.size,
          height: cloud.size,
        }}
      >
        <Image
          src={CLOUD_IMAGES[cloud.imageIndex]}
          alt="Cloud"
          fill
          className="object-contain select-none pointer-events-none"
          style={{ opacity: cloud.opacity }}
          priority={cloud.id < 3}
          unoptimized
        />
      </motion.div>
    );
  }
);

CloudItem.displayName = 'CloudItem';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [clouds, setClouds] = useState<Cloud[]>([]);

  const initializeClouds = useCallback(() => {
    if (!containerRef.current) return;
    const { width, height } =
      containerRef.current.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    setDimensions({ width, height });

    const area = width * height;
    const count = Math.max(
      1,
      Math.floor((area / 1_000_000) * density)
    );

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
          opacity
        )
      );
    }
    setClouds(newClouds);
  }, [density, minSize, maxSize, minSpeed, maxSpeed, opacity]);

  const regenerate = useCallback(
    (id: number) => {
      setClouds((prev) =>
        prev.map((c) =>
          c.id !== id
            ? c
            : generateCloud(
                id,
                dimensions.width,
                dimensions.height,
                minSize,
                maxSize,
                minSpeed,
                maxSpeed,
                opacity
              )
        )
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
    CLOUD_IMAGES.forEach((src) => new window.Image().src = src);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ zIndex }}
    >
      {clouds.map((cloud) => (
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

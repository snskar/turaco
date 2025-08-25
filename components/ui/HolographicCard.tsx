'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

interface HolographicCardProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  color1?: string;
  color2?: string;
}

/**
 * HolographicCard component with interactive holographic effects
 * Inspired by Pokemon card holo effects with modern React/TypeScript implementation
 * Features:
 * - Mouse tracking for dynamic holographic effects
 * - Touch support for mobile devices
 * - Automatic animations when not interacting
 * - Performance optimized with hardware acceleration
 * - Responsive design with mobile-first approach
 */
const HolographicCard: React.FC<HolographicCardProps> = ({
  src,
  alt,
  width = 400,
  height = 267, // 3:2 aspect ratio (400:267)
  className = '',
  color1 = 'rgb(0, 231, 255)',
  color2 = 'rgb(255, 0, 231)',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [transforms, setTransforms] = useState({
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    translateZ: 0,
    gradientX: 50,
    gradientY: 50,
    sparkleX: 50,
    sparkleY: 50,
    opacity: 0.5,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate normalized positions (-1 to 1)
    const normalizedX = (x - centerX) / centerX;
    const normalizedY = (y - centerY) / centerY;

    // Calculate enhanced rotation values for more dramatic effect
    const rotateY = normalizedX * 25; // Increased from 15
    const rotateX = -normalizedY * 20; // Increased from 15, negative for natural feel
    const rotateZ = normalizedX * 5; // Add slight Z rotation for more dynamic feel

    // Calculate Z translation for depth effect
    const distance = Math.sqrt(
      normalizedX * normalizedX + normalizedY * normalizedY
    );
    const translateZ = Math.min(distance * 30, 30); // Max 30px forward

    // Calculate gradient positions with enhanced range
    const gradientX = 50 + normalizedX * 40; // Increased from 25
    const gradientY = 50 + normalizedY * 40; // Increased from 25

    // Calculate sparkle positions with enhanced movement
    const sparkleX = 50 + normalizedX * 35;
    const sparkleY = 50 + normalizedY * 35;

    // Enhanced opacity calculation
    const opacity = 0.6 + (1 - Math.min(distance, 1)) * 0.4;

    setTransforms({
      rotateX,
      rotateY,
      rotateZ,
      translateZ,
      gradientX,
      gradientY,
      sparkleX,
      sparkleY,
      opacity,
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || e.touches.length === 0) return;

    e.preventDefault(); // Prevent scrolling during touch interaction

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Use same enhanced calculation as mouse move
    const normalizedX = (x - centerX) / centerX;
    const normalizedY = (y - centerY) / centerY;

    const rotateY = normalizedX * 25;
    const rotateX = -normalizedY * 20;
    const rotateZ = normalizedX * 5;

    const distance = Math.sqrt(
      normalizedX * normalizedX + normalizedY * normalizedY
    );
    const translateZ = Math.min(distance * 30, 30);

    const gradientX = 50 + normalizedX * 40;
    const gradientY = 50 + normalizedY * 40;
    const sparkleX = 50 + normalizedX * 35;
    const sparkleY = 50 + normalizedY * 35;

    const opacity = 0.6 + (1 - Math.min(distance, 1)) * 0.4;

    setTransforms({
      rotateX,
      rotateY,
      rotateZ,
      translateZ,
      gradientX,
      gradientY,
      sparkleX,
      sparkleY,
      opacity,
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTransforms({
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      translateZ: 0,
      gradientX: 50,
      gradientY: 50,
      sparkleX: 50,
      sparkleY: 50,
      opacity: 0.5,
    });
  };

  const cardStyle: React.CSSProperties = {
    '--color1': color1,
    '--color2': color2,
    width: `min(80vw, ${width}px)`,
    height: `min(53.33vw, ${height}px)`, // Maintain 3:2 aspect ratio (80vw * 2/3)
    perspective: '1500px', // Increased for more dramatic 3D effect
    transformStyle: 'preserve-3d',
  } as React.CSSProperties;

  return (
    <div className="relative touch-none" style={{ width: 'fit-content' }}>
      <motion.div
        ref={cardRef}
        className={`relative overflow-hidden cursor-pointer ${className}`}
        style={cardStyle}
        animate={{
          rotateX: transforms.rotateX,
          rotateY: transforms.rotateY,
          rotateZ: transforms.rotateZ,
          translateZ: transforms.translateZ,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          mass: 0.8,
        }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        {/* Card base with rounded corners and shadow */}
        <div
          className="relative w-full h-full rounded-xl overflow-hidden"
          style={{
            borderRadius: '1rem', // More rounded for landscape orientation
            boxShadow: isHovering
              ? `
                -20px -20px 30px -25px ${color1}40,
                20px 20px 30px -25px ${color2}40,
                -7px -7px 10px -5px ${color1}80,
                7px 7px 10px -5px ${color2}80,
                0 0 13px 4px rgba(255,255,255,0.3),
                0 55px 35px -20px rgba(0, 0, 0, 0.5)
              `
              : `
                -5px -5px 5px -5px ${color1}40,
                5px 5px 5px -5px ${color2}40,
                0 55px 35px -20px rgba(0, 0, 0, 0.5)
              `,
            transition: 'box-shadow 0.2s ease',
            backgroundColor: '#040712',
            willChange: 'transform, filter',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translate3d(0,0,0)',
          }}
        >
          {/* Card Image */}
          <OptimizedImage
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 71.5vw, 300px"
            priority
            loading="eager"
            useCloudinary={false}
            style={{
              transformOrigin: 'center',
            }}
          />

          {/* Holographic gradient overlay */}
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              background: `linear-gradient(
                115deg,
                transparent 0%,
                ${color1} 25%,
                transparent 47%,
                transparent 53%,
                ${color2} 75%,
                transparent 100%
              )`,
              backgroundPosition: `${transforms.gradientX}% ${transforms.gradientY}%`,
              backgroundSize: '300% 300%',
              mixBlendMode: 'color-dodge',
              filter: 'brightness(0.5) contrast(1)',
              transition: isHovering ? 'none' : 'all 0.33s ease',
              zIndex: 1,
            }}
          />

          {/* Sparkle and holo effect overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 50%),
                linear-gradient(125deg, 
                  rgba(255, 0, 132, 0.3) 15%, 
                  rgba(252, 164, 0, 0.25) 30%, 
                  rgba(255, 255, 0, 0.2) 40%, 
                  rgba(0, 255, 138, 0.15) 60%, 
                  rgba(0, 207, 255, 0.25) 70%, 
                  rgba(204, 76, 250, 0.3) 85%
                )
              `,
              backgroundPosition: `${transforms.sparkleX}% ${transforms.sparkleY}%`,
              backgroundSize: '160%',
              backgroundBlendMode: 'overlay',
              mixBlendMode: 'color-dodge',
              opacity: transforms.opacity,
              filter: 'brightness(1) contrast(1)',
              transition: isHovering ? 'none' : 'all 0.33s ease',
              zIndex: 2,
            }}
          />

          {/* Auto-animation when not hovering */}
          {!isHovering && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: [
                  'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                  'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 40% 60%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                mixBlendMode: 'color-dodge',
                zIndex: 3,
              }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HolographicCard;

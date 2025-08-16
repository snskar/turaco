import React from 'react';

interface FancyDividerProps {
  label?: string;
  className?: string;
  variant?: 'start' | 'end';
}

const FancyDivider: React.FC<FancyDividerProps> = ({
  label,
  className,
  variant = 'start',
}) => (
  <div className={`relative flex items-center my-8 ${className || ''}`}>
    {/* Start variant: two stars on the left, mirrored */}
    {variant === 'start' && (
      <span className="mr-3 flex flex-col items-center">
        {/* Large star */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 3 L22.5 18 L37 20 L22.5 22 L20 37 L17.5 22 L3 20 L17.5 18 Z"
            fill="white"
            opacity="0.95"
          />
        </svg>
        {/* Small star above, staggered to the left */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          className="mt-[-6px] mr-4"
        >
          <path
            d="M11 2 L12.2 9.5 L20 11 L12.2 12.5 L11 20 L9.8 12.5 L2 11 L9.8 9.5 Z"
            fill="white"
            opacity="0.8"
          />
        </svg>
      </span>
    )}
    {/* Divider line */}
    <div className="flex-1 h-0.25 bg-gradient-to-r from-white/90 to-white/60" />
    {/* Optional label */}
    {label && (
      <span className="absolute left-1/2 -translate-x-1/2 -top-6 text-white text-lg font-semibold drop-shadow">
        {label}
      </span>
    )}
    {/* End variant: two stars on the right, horizontally staggered */}
    {variant === 'end' && (
      <span className="ml-3 flex flex-col items-center">
        {/* Large star */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 3 L22.5 18 L37 20 L22.5 22 L20 37 L17.5 22 L3 20 L17.5 18 Z"
            fill="white"
            opacity="0.95"
          />
        </svg>
        {/* Small star below, staggered to the right */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          className="mt-[-6px] ml-4"
        >
          <path
            d="M11 2 L12.2 9.5 L20 11 L12.2 12.5 L11 20 L9.8 12.5 L2 11 L9.8 9.5 Z"
            fill="white"
            opacity="0.8"
          />
        </svg>
      </span>
    )}
  </div>
);

export { FancyDivider };

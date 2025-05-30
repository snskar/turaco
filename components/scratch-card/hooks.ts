import { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface UseScratchCardProps {
  width: number;
  height: number;
  isInteractive: boolean;
  onComplete?: () => void;
}

export const useScratchCard = ({
  width,
  height,
  isInteractive,
  onComplete
}: UseScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [cleared, setCleared] = useState(false);
  const hasCalledComplete = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#FFD6F3');    // Light pastel pink
gradient.addColorStop(0.25, '#F7B3E5'); // Warm bubblegum pink
gradient.addColorStop(0.5, '#D0B7FF');  // Lavender-violet
gradient.addColorStop(0.75, '#A6D3FA'); // Baby blue
gradient.addColorStop(1, '#C7F1FF');    // Very light cyan blue

    // Draw gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'destination-out';

    const scratchHandler = (e: TouchEvent | MouseEvent) => {
      if (!isInteractive) return;
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fill();
      checkScratchCompletion();
    };

    const touchMove = (e: TouchEvent) => {
      e.preventDefault();
      scratchHandler(e);
    };

    const mouseMove = (e: MouseEvent) => {
      if (e.buttons !== 1) return;
      scratchHandler(e);
    };

    canvas.addEventListener('touchmove', touchMove);
    canvas.addEventListener('mousemove', mouseMove);

    return () => {
      canvas.removeEventListener('touchmove', touchMove);
      canvas.removeEventListener('mousemove', mouseMove);
    };
  }, [width, height, isInteractive]);

  const checkScratchCompletion = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || isScratched) return;

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;

    for (let i = 3; i < pixels.data.length; i += 4) {
      if (pixels.data[i] < 128) transparentPixels++;
    }

    const transparency = transparentPixels / (canvas.width * canvas.height);
    if (transparency > 0.5) {
      setIsScratched(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti();

      if (!hasCalledComplete.current && onComplete) {
        hasCalledComplete.current = true;
        onComplete();
      }

      setTimeout(() => setCleared(true), 300);
    }
  };

  return {
    canvasRef,
    containerRef,
    isScratched,
    cleared,
  };
};

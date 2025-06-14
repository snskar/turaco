import { useRef, useState, useEffect, useCallback } from 'react';
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
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const triggerConfetti = useCallback(() => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = (rect.left + rect.right) / 2 / window.innerWidth;
    const centerY = (rect.top + rect.bottom) / 2 / window.innerHeight;
    
    const duration = 1500;
    const end = Date.now() + duration;
    const colors = ['#ffd6eb', '#d6f5ff', '#f9c8d9', '#a5b4fc'];

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 45,
        origin: { x: centerX - 0.15, y: centerY },
        colors: colors,
        ticks: 200,
        gravity: 1.2,
        scalar: 0.8,
        drift: 0,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 45,
        origin: { x: centerX + 0.15, y: centerY },
        colors: colors,
        ticks: 200,
        gravity: 1.2,
        scalar: 0.8,
        drift: 0,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [containerRef]);

  const checkScratchCompletion = useCallback(() => {
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
      triggerConfetti();

      if (!hasCalledComplete.current && onComplete) {
        hasCalledComplete.current = true;
        onComplete();
      }

      setTimeout(() => setCleared(true), 300);
    }
  }, [canvasRef, isScratched, onComplete, triggerConfetti, setIsScratched, setCleared, hasCalledComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
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

    const drawLine = (startX: number, startY: number, endX: number, endY: number) => {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = 40;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    const scratchHandler = (e: TouchEvent | MouseEvent) => {
      if (!isInteractive) return;
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

      if (lastPoint.current) {
        drawLine(lastPoint.current.x, lastPoint.current.y, x, y);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fill();
      }

      lastPoint.current = { x, y };
      checkScratchCompletion();
    };

    const touchStart = (e: TouchEvent) => {
      e.preventDefault();
      lastPoint.current = null;
      scratchHandler(e);
    };

    const mouseStart = (e: MouseEvent) => {
      if (e.buttons !== 1) return;
      lastPoint.current = null;
      scratchHandler(e);
    };

    const touchMove = (e: TouchEvent) => {
      e.preventDefault();
      scratchHandler(e);
    };

    const mouseMove = (e: MouseEvent) => {
      if (e.buttons !== 1) {
        lastPoint.current = null;
        return;
      }
      scratchHandler(e);
    };

    const endHandler = () => {
      lastPoint.current = null;
    };

    canvas.addEventListener('touchstart', touchStart, { passive: false });
    canvas.addEventListener('touchmove', touchMove, { passive: false });
    canvas.addEventListener('touchend', endHandler);
    canvas.addEventListener('mousedown', mouseStart);
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('mouseup', endHandler);
    canvas.addEventListener('mouseleave', endHandler);

    return () => {
      canvas.removeEventListener('touchstart', touchStart);
      canvas.removeEventListener('touchmove', touchMove);
      canvas.removeEventListener('touchend', endHandler);
      canvas.removeEventListener('mousedown', mouseStart);
      canvas.removeEventListener('mousemove', mouseMove);
      canvas.removeEventListener('mouseup', endHandler);
      canvas.removeEventListener('mouseleave', endHandler);
    };
  }, [width, height, isInteractive, checkScratchCompletion]);

  return {
    canvasRef,
    containerRef,
    isScratched,
    cleared,
  };
};

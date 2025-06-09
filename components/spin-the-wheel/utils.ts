import { useState, useRef, useCallback, useEffect } from "react";
import confetti from "canvas-confetti";

interface UseSpinTheWheelProps {
  options: string[];
  onWin?: (winner: string) => void;
  minSpins?: number;
  maxSpins?: number;
}

export const useSpinTheWheel = ({ 
  options, 
  onWin,
  minSpins = 5,
  maxSpins = 7 
}: UseSpinTheWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [wheelSize, setWheelSize] = useState(300);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sectorAngle = 360 / options.length;
  const radius = wheelSize / 2;

  // Calculate optimal text size based on number of options
  const getFontSize = useCallback(() => {
    const baseSize = 14;
    if (options.length <= 12) return baseSize;
    if (options.length <= 24) return baseSize * 0.8;
    if (options.length <= 36) return baseSize * 0.6;
    return baseSize * 0.5;
  }, [options.length]);

  // Responsive wheel size
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = window.innerHeight * 0.7;
      const newSize = Math.min(containerWidth * 0.9, containerHeight, 500);
      setWheelSize(newSize);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const getWinningOptionIndex = useCallback((currentRotation: number) => {
    // Normalize the rotation to 0-360 degrees
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    
    // Find which sector contains exactly 90 degrees after rotation
    // We subtract the rotation because we rotate clockwise
    const targetAngle = (360 - normalizedRotation + 270) % 360;
    
    // Calculate which sector contains this angle
    const sectorIndex = Math.floor(targetAngle / sectorAngle);
    return sectorIndex;
  }, [sectorAngle]);

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
  }, []);

  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    // Get the current rotation and normalize it
    const currentRotation = rotation % 360;
    
    // Choose a random winning index first
    const targetIndex = Math.floor(Math.random() * options.length);
    
    // Calculate spins
    const fullSpins = minSpins + Math.random() * (maxSpins - minSpins);
    
    // Calculate how much we need to rotate from the current position
    const baseAngle = 360 - (targetIndex * sectorAngle);
    const finalRotation = (fullSpins * 360) + baseAngle - 90 + (360 - currentRotation);
    
    setRotation(prevRotation => prevRotation + finalRotation);

    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 8s cubic-bezier(0.2, 0.1, 0.1, 1)";
      wheelRef.current.style.transform = `rotate(${rotation + finalRotation}deg)`;
    }

    setTimeout(() => {
      const winningIndex = getWinningOptionIndex(rotation + finalRotation);
      const winningOption = options[winningIndex];
      
      setWinner(winningOption);
      onWin?.(winningOption);
      triggerConfetti();
      setIsSpinning(false);
    }, 8000);
  }, [isSpinning, options, sectorAngle, getWinningOptionIndex, onWin, triggerConfetti, rotation, minSpins, maxSpins]);

  const renderSectors = useCallback(() => {
    return options.map((option, i) => {
      // Calculate sector angles for clockwise rotation
      const startAngle = Number((i * sectorAngle).toFixed(2));
      const endAngle = Number(((i + 1) * sectorAngle).toFixed(2));
      const largeArcFlag = sectorAngle > 180 ? 1 : 0;

      // Calculate sector path with fixed precision
      const x1 = Number((radius + radius * Math.cos((startAngle * Math.PI) / 180)).toFixed(2));
      const y1 = Number((radius + radius * Math.sin((startAngle * Math.PI) / 180)).toFixed(2));
      const x2 = Number((radius + radius * Math.cos((endAngle * Math.PI) / 180)).toFixed(2));
      const y2 = Number((radius + radius * Math.sin((endAngle * Math.PI) / 180)).toFixed(2));

      const pathData = `M ${radius.toFixed(2)} ${radius.toFixed(2)} L ${x1} ${y1} A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      // Calculate text position and rotation with fixed precision
      const midAngle = Number((startAngle + (sectorAngle / 2)).toFixed(2));
      const textRadius = Number((radius * 0.65).toFixed(2));
      const textX = Number((radius + textRadius * Math.cos((midAngle * Math.PI) / 180)).toFixed(2));
      const textY = Number((radius + textRadius * Math.sin((midAngle * Math.PI) / 180)).toFixed(2));

      // Calculate text rotation to be radial with fixed precision
      let textRotation = Number(((midAngle + 180) % 360).toFixed(2));
      // Flip text when it would be upside down
      if (textRotation > 90 && textRotation < 270) {
        textRotation = Number((textRotation + 180).toFixed(2));
      }

      return {
        pathData,
        textX,
        textY,
        textRotation,
        option,
        fontSize: Number(getFontSize().toFixed(2))
      };
    });
  }, [options, sectorAngle, radius, getFontSize]);

  return {
    isSpinning,
    winner,
    wheelSize,
    rotation,
    wheelRef,
    containerRef,
    radius,
    spin,
    renderSectors
  };
};

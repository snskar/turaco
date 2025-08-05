import { useState, useRef, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';

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
  maxSpins = 7,
}: UseSpinTheWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [isWonState, setIsWonState] = useState(false);
  const [winningSectorIndex, setWinningSectorIndex] = useState<number | null>(
    null
  );
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

  const getWinningOptionIndex = useCallback(
    (currentRotation: number) => {
      // Normalize the rotation to 0-360 degrees
      const normalizedRotation = ((currentRotation % 360) + 360) % 360;

      // Find which sector contains exactly 90 degrees after rotation
      // We subtract the rotation because we rotate clockwise
      const targetAngle = (360 - normalizedRotation + 270) % 360;

      // Calculate which sector contains this angle
      const sectorIndex = Math.floor(targetAngle / sectorAngle);
      return sectorIndex;
    },
    [sectorAngle]
  );

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

  const resetWheel = useCallback(() => {
    if (wheelRef.current) {
      wheelRef.current.style.transition =
        'transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
      wheelRef.current.style.transform = 'rotate(0deg) translateZ(0)';
    }
    setRotation(0);
    setWinner(null);
    setIsWonState(false);
    setWinningSectorIndex(null);
  }, []);

  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    // Get the current rotation and normalize it
    const currentRotation = rotation % 360;

    // Choose a random winning index first
    const targetIndex = Math.floor(Math.random() * options.length);

    // Calculate spins (more controlled range)
    const fullSpins = minSpins + Math.random() * (maxSpins - minSpins);

    // Calculate final rotation with better precision
    const baseAngle = 360 - targetIndex * sectorAngle;
    const finalRotation = Math.floor(
      fullSpins * 360 + baseAngle - 90 + (360 - currentRotation)
    );

    // Update wheel with optimized animation
    if (wheelRef.current) {
      wheelRef.current.style.transition = `transform 8s cubic-bezier(0.32, 0.06, 0.15, 1)`;
      wheelRef.current.style.transform = `rotate(${rotation + finalRotation}deg) translateZ(0)`;
    }

    // Update state
    setRotation(prevRotation => prevRotation + finalRotation);

    // Delay winner announcement slightly
    setTimeout(() => {
      const winningIndex = getWinningOptionIndex(rotation + finalRotation);
      const winningOption = options[winningIndex];

      setWinner(winningOption);
      setWinningSectorIndex(winningIndex);
      setIsWonState(true);
      onWin?.(winningOption);
      triggerConfetti();

      // Small delay before allowing next spin
      setTimeout(() => {
        setIsSpinning(false);
      }, 500);
    }, 8200);
  }, [
    isSpinning,
    options,
    sectorAngle,
    getWinningOptionIndex,
    onWin,
    triggerConfetti,
    rotation,
    minSpins,
    maxSpins,
  ]);

  // Debounced interaction handler
  const handleInteraction = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (isSpinning) {
        e.preventDefault();
        return;
      }

      // If in won state, reset the wheel
      if (isWonState) {
        e.preventDefault();
        e.stopPropagation();
        resetWheel();
        return;
      }

      // Prevent any default behavior
      e.preventDefault();
      e.stopPropagation();

      // Add small delay to prevent accidental double triggers
      requestAnimationFrame(() => {
        spin();
      });
    },
    [isSpinning, isWonState, spin, resetWheel]
  );

  // Clean up function
  useEffect(() => {
    return () => {
      // No cleanup needed since we're not locking scroll anymore
    };
  }, []);

  const renderSectors = useCallback(() => {
    return options.map((option, i) => {
      let startAngle, endAngle, largeArcFlag;

      if (isWonState && winningSectorIndex === i) {
        // Expand the winning sector to fill the entire wheel
        startAngle = 0;
        endAngle = 360;
        largeArcFlag = 1;
      } else if (isWonState) {
        // Hide other sectors when in won state
        startAngle = 0;
        endAngle = 0;
        largeArcFlag = 0;
      } else {
        // Normal sector calculation
        startAngle = Number((i * sectorAngle).toFixed(2));
        endAngle = Number(((i + 1) * sectorAngle).toFixed(2));
        largeArcFlag = sectorAngle > 180 ? 1 : 0;
      }

      // Calculate sector path with fixed precision
      const x1 = Number(
        (radius + radius * Math.cos((startAngle * Math.PI) / 180)).toFixed(2)
      );
      const y1 = Number(
        (radius + radius * Math.sin((startAngle * Math.PI) / 180)).toFixed(2)
      );
      const x2 = Number(
        (radius + radius * Math.cos((endAngle * Math.PI) / 180)).toFixed(2)
      );
      const y2 = Number(
        (radius + radius * Math.sin((endAngle * Math.PI) / 180)).toFixed(2)
      );

      const pathData = `M ${radius.toFixed(2)} ${radius.toFixed(2)} L ${x1} ${y1} A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      // Calculate text position and rotation with fixed precision
      let midAngle, textX, textY, textRotation, textRadius;

      if (isWonState && winningSectorIndex === i) {
        // Center the text for the expanded winning sector
        midAngle = 180; // Center at bottom
        textRadius = Number((radius * 0.4).toFixed(2)); // Closer to center
        textX = Number(
          (radius + textRadius * Math.cos((midAngle * Math.PI) / 180)).toFixed(
            2
          )
        );
        textY = Number(
          (radius + textRadius * Math.sin((midAngle * Math.PI) / 180)).toFixed(
            2
          )
        );
        textRotation = 0; // Horizontal text
      } else if (isWonState) {
        // Hide text for other sectors - position at center but don't render
        midAngle = 0;
        textRadius = Number((radius * 0.1).toFixed(2)); // Small radius to avoid division by zero
        textX = radius;
        textY = radius;
        textRotation = 0;
      } else {
        // Normal text positioning
        midAngle = Number((startAngle + sectorAngle / 2).toFixed(2));
        textRadius = Number((radius * 0.65).toFixed(2));
        textX = Number(
          (radius + textRadius * Math.cos((midAngle * Math.PI) / 180)).toFixed(
            2
          )
        );
        textY = Number(
          (radius + textRadius * Math.sin((midAngle * Math.PI) / 180)).toFixed(
            2
          )
        );

        // Calculate text rotation to be radial with fixed precision
        textRotation = Number(((midAngle + 180) % 360).toFixed(2));
        // Flip text when it would be upside down
        if (textRotation > 90 && textRotation < 270) {
          textRotation = Number((textRotation + 180).toFixed(2));
        }
      }

      return {
        pathData,
        textX,
        textY,
        textRotation,
        option,
        fontSize: Number(getFontSize().toFixed(2)),
        isWinningSector: isWonState && winningSectorIndex === i,
        shouldRender: !isWonState || winningSectorIndex === i,
      };
    });
  }, [
    options,
    sectorAngle,
    radius,
    getFontSize,
    isWonState,
    winningSectorIndex,
  ]);

  return {
    isSpinning,
    winner,
    isWonState,
    winningSectorIndex,
    wheelSize,
    rotation,
    wheelRef,
    containerRef,
    radius,
    spin,
    handleInteraction,
    resetWheel,
    renderSectors,
  };
};

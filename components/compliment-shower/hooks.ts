import { useState, useRef, useEffect } from 'react';
import { DROP_INTERVAL, DROP_SPEED, JAR_SIZE, DROP_SIZE } from './constants';
import {DropType} from './Drop';


interface Viewport {
  width: number;
  height: number;
}

export const useGameState = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [drops, setDrops] = useState<DropType[]>([]);
  const [jarXRatio, setJarXRatio] = useState(0.5);
  const [score, setScore] = useState(0);
  const [compliment, setCompliment] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });

  return {
    hasMounted,
    setHasMounted,
    drops,
    setDrops,
    jarXRatio,
    setJarXRatio,
    score,
    setScore,
    compliment,
    setCompliment,
    playing,
    setPlaying,
    viewport,
    setViewport
  };
};

export const useGameRefs = () => {
  const dropId = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const complimentTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(0);
  const jarMovementRef = useRef<number>(0.5);

  return {
    dropId,
    animationFrameRef,
    complimentTimeoutRef,
    lastTimeRef,
    jarMovementRef
  };
};

export const useJarMovement = (
  lastTimeRef: React.RefObject<number>,
  jarMovementRef: React.RefObject<number>,
  setJarXRatio: (ratio: number) => void
) => {
  const setJarPosition = (newRatio: number): void => {
    const now = Date.now();
    if (now - lastTimeRef.current! > 16) {
      jarMovementRef.current = newRatio;
      setJarXRatio(newRatio);
      lastTimeRef.current = now;
    }
  };

  return setJarPosition;
};

export const useGameInitialization = (
  setHasMounted: (mounted: boolean) => void,
  jarMovementRef: React.RefObject<number>,
  jarXRatio: number,
  setViewport: (viewport: Viewport) => void
) => {
  useEffect(() => {
    setHasMounted(true);
    jarMovementRef.current = jarXRatio;
    
    const updateSize = (): void => {
      if (typeof window !== 'undefined') {
        setViewport({ 
          width: window.innerWidth, 
          height: window.innerHeight 
        });
      }
    };
    
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [jarXRatio, setHasMounted, setViewport, jarMovementRef]);
};

export const useDropGeneration = (
  playing: boolean,
  viewport: Viewport,
  dropId: React.RefObject<number>,
  setDrops: (drops: DropType[] | ((prev: DropType[]) => DropType[])) => void
) => {
  useEffect(() => {
    if (!playing || !viewport.width) return;
    
    const interval = setInterval(() => {
      setDrops((prev) => [
        ...prev,
        {
          id: dropId.current++,
          xRatio: Math.random(),
          yRatio: 0,
          lastUpdate: Date.now(),
        },
      ]);
    }, DROP_INTERVAL);
    
    return () => clearInterval(interval);
  }, [playing, viewport.width, dropId, setDrops]);
};

export const useVisibilityPause = (setPlaying: (playing: boolean) => void) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setPlaying]);
};

export const useGameAnimation = (
  playing: boolean,
  viewport: Viewport,
  jarXRatio: number,
  setDrops: (drops: DropType[] | ((prev: DropType[]) => DropType[])) => void,
  setScore: (score: number | ((prev: number) => number)) => void,
  setCompliment: (compliment: string | null) => void,
  compliments: string[],
  complimentTimeoutRef: React.RefObject<NodeJS.Timeout | null>,
  animationFrameRef: React.RefObject<number | null>
) => {
  useEffect(() => {
    if (!playing) return;

    let lastFrameTime = Date.now();

    const animate = (): void => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastFrameTime) / 1000;
      lastFrameTime = currentTime;

      setDrops((prev) => {
        return prev
          .map((drop) => {
            const timeSinceLastUpdate = (currentTime - drop.lastUpdate) / 1000;
            const pixelsToMove = DROP_SPEED * timeSinceLastUpdate;
            const ratioToMove = pixelsToMove / viewport.height;
            
            return {
              ...drop,
              yRatio: drop.yRatio + ratioToMove,
              lastUpdate: currentTime,
            };
          })
          .filter((drop) => {
            const dropX = drop.xRatio * viewport.width;
            const dropY = drop.yRatio * viewport.height;
            const jarX = jarXRatio * (viewport.width - JAR_SIZE.width);
            
            const caught =
              dropY > viewport.height - JAR_SIZE.height - 16 &&
              dropY < viewport.height - 16 &&
              dropX + DROP_SIZE.width > jarX &&
              dropX < jarX + JAR_SIZE.width;
            
            if (caught) {
              setScore((s) => s + 1);
              setCompliment(
                compliments[Math.floor(Math.random() * compliments.length)]
              );
              if (complimentTimeoutRef.current) {
                clearTimeout(complimentTimeoutRef.current);
              }
              complimentTimeoutRef.current = setTimeout(
                () => setCompliment(null), 
                2000
              );
            }
            return dropY < viewport.height && !caught;
          });
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [jarXRatio, playing, viewport, setDrops, setScore, setCompliment, compliments, complimentTimeoutRef, animationFrameRef]);
};

export const useKeyboardControls = (
  playing: boolean,
  jarMovementRef: React.RefObject<number>,
  setJarPosition: (ratio: number) => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!playing) return;
      
      const delta = 0.05;
      const currentRatio = jarMovementRef.current!;
      
      if (e.key === "ArrowLeft") {
        setJarPosition(Math.max(0, currentRatio - delta));
      } else if (e.key === "ArrowRight") {
        setJarPosition(Math.min(1, currentRatio + delta));
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playing, jarMovementRef, setJarPosition]);
};

export const useTouchControls = (
  playing: boolean,
  viewport: Viewport,
  setJarPosition: (ratio: number) => void
) => {
  const handleTouchMove = (e: React.TouchEvent): void => {
    if (!playing) return;
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const newRatio = (touchX - JAR_SIZE.width / 2) / (viewport.width - JAR_SIZE.width);
    setJarPosition(Math.max(0, Math.min(1, newRatio)));
  };

  return handleTouchMove;
};

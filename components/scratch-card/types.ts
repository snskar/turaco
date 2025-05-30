export interface ScratchCardProps {
    width?: number;
    height?: number;
    coverColor?: string;
    text?: string;
    revealText?: string;
    onComplete?: () => void;
    isInteractive?: boolean;
    isScratched?: boolean;
};
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Heartlink, Compliment, ScratchCard, Activity, Photo } from "../app/types/heartlink";
import { DEFAULT_COMPLIMENTS } from "@/components/compliment-shower/constants";
import { DEFAULT_WHEEL_OPTIONS } from "@/components/spin-the-wheel/constants";
import { OCCASION_CONTENT_MAPPING } from "@/components/ui/splash-title/constants";
import { DEFAULT_SCRATCH_CARD_OPTIONS } from "@/components/scratch-card/constants";

// Type definitions for function returns
export interface TitleContent {
  title: string;
  name: string;
  message: string;
  img: string;
}

export interface ComplimentResult {
  content: string[];
  source: 'custom' | 'default';
}

export interface WheelOptionsResult {
  options: string[];
  source: 'custom' | 'default';
}

// Type definitions for slideshow
export interface SlideshowImage {
  src: string;
  alt: string;
}

export interface SlideshowResult {
  images: SlideshowImage[];
  width?: string | number;
  height?: string | number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

interface ComplimentShowerProps {
  compliments: string[];
  autoStart?: boolean;
}

interface SpinTheWheelProps {
  options: string[];
  centerImageSrc: string;
  onWin?: (winner: string) => void;
}

// Type for the return value of getScratchCard to match CardStack props
export interface ScratchCardStackProps {
  cards: string[];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to pick n random values from an array
export function pickRandomValues<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// get title, name, message, img from the heartlink object to map to the splash title component

export function getTitleContent(heartlink: Heartlink): TitleContent {
  if (!heartlink) {
    throw new Error('Heartlink object is required for getting title content');
  }

  const { occasion, recipientName, senderName, message } = heartlink;

  try {
    let { title, displayMessage, img } = OCCASION_CONTENT_MAPPING.OTHER;

    if (occasion && occasion in OCCASION_CONTENT_MAPPING) {
      const content = OCCASION_CONTENT_MAPPING[occasion as keyof typeof OCCASION_CONTENT_MAPPING];
      title = content.title;
      displayMessage = content.displayMessage;
      img = content.img;
    }

    return {
      title,
      name: recipientName ?? 'My Favourite Person',
      message: message ?? displayMessage,
      img
    };
  } catch (error) {
    console.error('Error processing title content:', error);
    return {
      ...OCCASION_CONTENT_MAPPING.OTHER,
      name: 'My Favourite Person',
      message: OCCASION_CONTENT_MAPPING.OTHER.displayMessage
    };
  }
}

// Get slideshow content from the heartlink object
export function getSlideshowContent(
  heartlink: Heartlink,
  options: Partial<Omit<SlideshowResult, 'images'>> = {}
): SlideshowResult {
  if (!heartlink) {
    throw new Error('Heartlink object is required for getting slideshow content');
  }

  try {
    const { photos } = heartlink;
    const defaultOptions = {
      width: '100%',
      height: 400,
      autoPlay: true,
      autoPlayInterval: 3000,
      ...options
    };

    // If no photos, return empty state but with default options
    if (!photos?.length) {
      return {
        images: [],
        ...defaultOptions
      };
    }

    // Map photos to slideshow format
    const images = photos.map((photo: Photo) => ({
      src: photo.url,
      alt: `Photo shared by ${heartlink.senderName}`
    }));

    return {
      images,
      ...defaultOptions
    };
  } catch (error) {
    console.error('Error processing slideshow content:', error);
    // Return empty state with default options on error
    return {
      images: [],
      width: '100%',
      height: 400,
      autoPlay: true,
      autoPlayInterval: 3000,
      ...options
    };
  }
}

// Get compliments from the heartlink object to map to the compliment shower 
export function getCompliments(heartlink: Heartlink): ComplimentShowerProps {
  if (!heartlink) {
    throw new Error('Heartlink object is required for getting compliments');
  }

  const { relation, compliments: heartlinkCompliments } = heartlink;

  try {
    if (!heartlinkCompliments || !Array.isArray(heartlinkCompliments) || heartlinkCompliments.length === 0) {
      if (relation && relation in DEFAULT_COMPLIMENTS) {
        return {
          compliments: DEFAULT_COMPLIMENTS[relation as keyof typeof DEFAULT_COMPLIMENTS],
          autoStart: false
        };
      }
      return {
        compliments: DEFAULT_COMPLIMENTS.OTHER,
        autoStart: false
      };
    }

    return {
      compliments: heartlinkCompliments.map((c: Compliment) => c.content),
      autoStart: false
    };
  } catch (error) {
    console.error('Error processing compliments:', error);
    return {
      compliments: DEFAULT_COMPLIMENTS.OTHER,
      autoStart: false
    };
  }
}


// get scratch card from the heartlink object to map to the scratch card component 
export function getScratchCards(heartlink: Heartlink | null): ScratchCardStackProps {
  // Validate input
  if (!heartlink) {
    console.warn('No heartlink provided, using default scratch cards');
    return {
      cards: pickRandomValues(DEFAULT_SCRATCH_CARD_OPTIONS.OTHER, 5)
    };
  }

  const { relation, scratchCard } = heartlink;

  try {
    // Case 1: Custom scratch cards from heartlink
    if (scratchCard && Array.isArray(scratchCard) && scratchCard.length > 0) {
      return {
        cards: pickRandomValues(scratchCard.map((card: ScratchCard) => card.content), 5)
      };
    }

    // Case 2: Default cards based on relation
    if (relation && relation in DEFAULT_SCRATCH_CARD_OPTIONS) {
      return {
        cards: pickRandomValues(DEFAULT_SCRATCH_CARD_OPTIONS[relation as keyof typeof DEFAULT_SCRATCH_CARD_OPTIONS], 5)
      };
    }

    // Case 3: Fallback to OTHER category
    return {
      cards: pickRandomValues(DEFAULT_SCRATCH_CARD_OPTIONS.OTHER, 5)
    };
  } catch (error) {
    console.error('Error processing scratch cards:', error);
    // Safe fallback in case of any error
    return {
      cards: pickRandomValues(DEFAULT_SCRATCH_CARD_OPTIONS.OTHER, 5)
    };
  }
}

// get wheel options from the heartlink object to map to the spin the wheel component

export function getWheelOptions(heartlink: Heartlink): SpinTheWheelProps {
  if (!heartlink) {
    throw new Error('Heartlink object is required for getting wheel options');
  }

  const { relation, activities } = heartlink;

  try {
    if (!activities?.length) {
      if (relation && relation in DEFAULT_WHEEL_OPTIONS) {
        return {
          options: DEFAULT_WHEEL_OPTIONS[relation as keyof typeof DEFAULT_WHEEL_OPTIONS],
          centerImageSrc: "/assets/art/hamster.png",
          onWin: undefined
        };
      }
      return {
        options: DEFAULT_WHEEL_OPTIONS.OTHER,
        centerImageSrc: "/assets/art/hamster.png",
        onWin: undefined
      };
    }

    return {
      options: activities.map((a: Activity) => a.content),
      centerImageSrc: "/assets/art/hamster.png",
      onWin: undefined
    };
  } catch (error) {
    console.error('Error processing wheel options:', error);
    return {
      options: DEFAULT_WHEEL_OPTIONS.OTHER,
      centerImageSrc: "/assets/art/hamster.png",
      onWin: undefined
    };
  }
}
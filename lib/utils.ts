import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Heartlink, Compliment, ScratchCard, Activity, Photo } from "../app/types/heartlink";
import { DEFAULT_COMPLIMENTS } from "@/components/compliment-shower/constants";
import { DEFAULT_WHEEL_OPTIONS } from "@/components/spin-the-wheel/constants";
import { OCCASION_CONTENT_MAPPING } from "@/components/ui/splash-title/constants";
import { DEFAULT_SCRATCH_CARD_OPTIONS } from "@/components/scratch-card/constants";
import { SpinTheWheelProps } from "@/components/spin-the-wheel/types";
import { SplashTitleProps } from "@/components/ui/splash-title/types";
import { SlideshowProps } from "@/components/slideshow/types";
import { ComplimentShowerProps } from "@/components/compliment-shower/types";
import { CardStackProps } from "@/components/scratch-card/types";

export interface PropifiedHeartlink {
  splashTitleProps: SplashTitleProps, 
  slideshowProps: SlideshowProps,
  complimentShowerProps: ComplimentShowerProps, 
  cardStackProps: CardStackProps, 
  spinTheWheelProps: SpinTheWheelProps, 
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
export function getTitleContent(heartlink: Heartlink): SplashTitleProps {
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
      imgSource: img
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
): SlideshowProps {
  if (!heartlink) {
    throw new Error('Heartlink object is required for getting slideshow content');
  }

  try {
    const { photos } = heartlink;

    // If no photos, return empty state but with default options
    if (!photos?.length) {
      return {
        images: [],
      };
    }

    // Map photos to slideshow format
    const images = photos.map((photo: Photo) => ({
      src: photo.url,
      alt: `Photo shared by ${heartlink.senderName}`
    }));

    return {
      images,
    };
  } catch (error) {
    console.error('Error processing slideshow content:', error);
    // Return empty state with default options on error
    return {
      images: []
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
export function getScratchCards(heartlink: Heartlink | null): CardStackProps {
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

// A function that gets all the props from the heartlink object and makes digestible packs for the comps
export function getPropifiedHeartlink(heartlink: Heartlink): PropifiedHeartlink {
  
  if (!heartlink) {
    throw new Error('Heartlink object is required for getting wheel options');
  }

  const splashTitleProps = getTitleContent(heartlink);
  const slideshowProps = getSlideshowContent(heartlink);
  const complimentShowerProps = getCompliments(heartlink);
  const cardStackProps = getScratchCards(heartlink);
  const spinTheWheelProps = getWheelOptions(heartlink);

  return {
    splashTitleProps, 
    slideshowProps, 
    complimentShowerProps,
    cardStackProps, 
    spinTheWheelProps, 
  };
}


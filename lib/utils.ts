import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Heartlink, Compliment, ScratchCard, Activity } from "../app/types/heartlink";
import { DEFAULT_COMPLIMENTS } from "@/components/compliment-shower/constants";
import { DEFAULT_WHEEL_OPTIONS } from "@/components/spin-the-wheel/constants";
import { OCCASION_CONTENT_MAPPING } from "@/components/ui/splash-title/constants";

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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

// Get compliments from the heartlink object to map to the compliment shower 
export function getCompliments(heartlink: Heartlink): ComplimentResult {
  if (!heartlink) {
    throw new Error('Heartlink object is required for getting compliments');
  }

  const { relation, compliments } = heartlink;

  try {
    if (!compliments?.length) {
      if (relation && relation in DEFAULT_COMPLIMENTS) {
        return {
          content: DEFAULT_COMPLIMENTS[relation as keyof typeof DEFAULT_COMPLIMENTS],
          source: 'default'
        };
      }
      return {
        content: DEFAULT_COMPLIMENTS.OTHER,
        source: 'default'
      };
    }

    return {
      content: compliments.map((c: Compliment) => c.content),
      source: 'custom'
    };
  } catch (error) {
    console.error('Error processing compliments:', error);
    return {
      content: DEFAULT_COMPLIMENTS.OTHER,
      source: 'default'
    };
  }
}

// get scratch card from the heartlink object to map to the scratch card component 
// export function getScratchCard(heartlink: Heartlink) {
//   if(!heartlink.scratchCard || heartlink.scratchCard.length === 0) {
//     return [];
//   }
//   return heartlink.scratchCard.map((c: ScratchCard) => c.content);
// }

// get wheel options from the heartlink object to map to the spin the wheel component

export function getWheelOptions(heartlink: Heartlink): WheelOptionsResult {
  if (!heartlink) {
    throw new Error('Heartlink object is required for getting wheel options');
  }

  const { relation, activities } = heartlink;

  try {
    if (!activities?.length) {
      if (relation && relation in DEFAULT_WHEEL_OPTIONS) {
        return {
          options: DEFAULT_WHEEL_OPTIONS[relation as keyof typeof DEFAULT_WHEEL_OPTIONS],
          source: 'default'
        };
      }
      return {
        options: DEFAULT_WHEEL_OPTIONS.OTHER,
        source: 'default'
      };
    }

    return {
      options: activities.map((a: Activity) => a.content),
      source: 'custom'
    };
  } catch (error) {
    console.error('Error processing wheel options:', error);
    return {
      options: DEFAULT_WHEEL_OPTIONS.OTHER,
      source: 'default'
    };
  }
}
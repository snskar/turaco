import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Heartlink, Compliment, ScratchCard, Activity } from "../app/types/heartlink";
import { DEFAULT_COMPLIMENTS } from "@/components/compliment-shower/constants";
import { DEFAULT_WHEEL_OPTIONS } from "@/components/spin-the-wheel/constants";
import { OCCASION_CONTENT_MAPPING } from "@/components/ui/splash-title/constants";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 

// get title, name, message, img from the heartlink object to map to the splash title component

export function getTitleContent(heartlink: Heartlink) {
  const {occasion, recipientName, senderName, message} = heartlink;

  let {title, displayMessage, img} = OCCASION_CONTENT_MAPPING.OTHER;

  if(occasion in OCCASION_CONTENT_MAPPING) {
    const content = OCCASION_CONTENT_MAPPING[occasion as keyof typeof OCCASION_CONTENT_MAPPING];
    title = content.title;
    displayMessage = content.displayMessage;
    img = content.img;
  };

  displayMessage = message ?? displayMessage;

  return {
    title,
    name: recipientName ?? 'My Favourite Person',
    message: displayMessage,
    img
  }
}

// Get compliments from the heartlink object to map to the compliment shower 
export function getCompliments(heartlink: Heartlink) {
    const {relation} = heartlink;

      if(!heartlink.compliments || heartlink.compliments.length === 0) {
        if(relation in DEFAULT_COMPLIMENTS) {
          return DEFAULT_COMPLIMENTS[relation as keyof typeof DEFAULT_COMPLIMENTS];
        }
        return DEFAULT_COMPLIMENTS.OTHER;
      }

      return heartlink.compliments.map((c: Compliment) => c.content);
}

// get scratch card from the heartlink object to map to the scratch card component 
// export function getScratchCard(heartlink: Heartlink) {
//   if(!heartlink.scratchCard || heartlink.scratchCard.length === 0) {
//     return [];
//   }
//   return heartlink.scratchCard.map((c: ScratchCard) => c.content);
// }

// get wheel options from the heartlink object to map to the spin the wheel component

export function getWheelOptions(heartlink: Heartlink) {
  const {relation} = heartlink;

  if(!heartlink.activities || heartlink.activities.length === 0) {
    
     if(relation in DEFAULT_WHEEL_OPTIONS) {
      return DEFAULT_WHEEL_OPTIONS[relation as keyof typeof DEFAULT_WHEEL_OPTIONS];
    }
    return DEFAULT_WHEEL_OPTIONS.OTHER;
  }
  return heartlink.activities.map((a: Activity) => a.content);
}




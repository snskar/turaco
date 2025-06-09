import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Gift } from "@/app/types/gift";
import { DEFAULT_COMPLIMENTS } from "@/components/compliment-shower/constants";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 

// Get compliments from the gift object to map to the compliment shower 
export function getCompliments(gift: Gift) {
    const {relation} = gift;

      if(!gift.compliments || gift.compliments.length === 0) {
        if(relation in DEFAULT_COMPLIMENTS) {
          return DEFAULT_COMPLIMENTS[relation as keyof typeof DEFAULT_COMPLIMENTS];
        }
        return DEFAULT_COMPLIMENTS.OTHER;
      }

      return gift.compliments.map(c => c.content);
}

// get scratch card from the gift object to map to the scratch card component 
export function getScratchCard(gift: Gift) {
  if(!gift.scratchCard || gift.scratchCard.length === 0) {
    return [];
  }
  return gift.scratchCard.map(c => c.content);
}

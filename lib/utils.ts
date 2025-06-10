import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Heartlink, Compliment, ScratchCard } from "@/app/types/heartlink";
import { DEFAULT_COMPLIMENTS } from "@/components/compliment-shower/constants";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
export function getScratchCard(heartlink: Heartlink) {
  if(!heartlink.scratchCard || heartlink.scratchCard.length === 0) {
    return [];
  }
  return heartlink.scratchCard.map((c: ScratchCard) => c.content);
}

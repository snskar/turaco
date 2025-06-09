export interface Photo {
  id: string;
  url: string;
}

export interface SpotifyTrack {
  id: string;
  spotifyId: string;
  type: 'track' | 'playlist';
  name: string;
  artist?: string;
  imageUrl?: string;
  previewUrl?: string;
}

export interface Activity {
  id: string;
  content: string;
  isCustom: boolean;
}

export interface Compliment {
  id: string;
  content: string;
  isCustom: boolean;
}

export interface ScratchCard {
  id: string;
  content: string;
  isCustom: boolean;
}

export enum GiftRelation {
  COUPLE = "COUPLE",
  FATHER = "FATHER",
  MOTHER = "MOTHER",
  SISTER = "SISTER",
  BROTHER = "BROTHER",
  FRIEND = "FRIEND",
  OTHER = "OTHER"
}

export enum GiftOccasion {
  BIRTHDAY = "BIRTHDAY",
  NEW_YEAR = "NEW_YEAR",
  DIWALI = "DIWALI",
  RAKSHA_BANDHAN = "RAKSHA_BANDHAN",
  CHRISTMAS = "CHRISTMAS",
  VALENTINES = "VALENTINES",
  ANNIVERSARY = "ANNIVERSARY",
  CONGRATULATIONS = "CONGRATULATIONS",
  GET_WELL_SOON = "GET_WELL_SOON",
  I_AM_SORRY = "I_AM_SORRY",
  I_LOVE_YOU = "I_LOVE_YOU",
  OTHER = "OTHER"
}

export interface Gift {
  id: string;
  slug: string;
  gifterName: string;
  gifteeName: string;
  occasion: GiftOccasion;
  relation: GiftRelation;
  message?: string;
  photos?: Photo[];
  spotifyTrack?: SpotifyTrack;
  activities?: Activity[];
  compliments?: Compliment[];
  scratchCard?: ScratchCard;
  createdAt: string;
  updatedAt: string;
} 
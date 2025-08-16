export enum HeartlinkOccasion {
  BIRTHDAY = 'BIRTHDAY',
  NEW_YEAR = 'NEW_YEAR',
  DIWALI = 'DIWALI',
  RAKSHA_BANDHAN = 'RAKSHA_BANDHAN',
  CHRISTMAS = 'CHRISTMAS',
  VALENTINES = 'VALENTINES',
  ANNIVERSARY = 'ANNIVERSARY',
  CONGRATULATIONS = 'CONGRATULATIONS',
  GET_WELL_SOON = 'GET_WELL_SOON',
  I_AM_SORRY = 'I_AM_SORRY',
  I_LOVE_YOU = 'I_LOVE_YOU',
  OTHER = 'OTHER',
  FATHERS_DAY = 'FATHERS_DAY',
}

export enum HeartlinkRelation {
  COUPLE = 'COUPLE',
  FATHER = 'FATHER',
  MOTHER = 'MOTHER',
  SISTER = 'SISTER',
  BROTHER = 'BROTHER',
  FRIEND = 'FRIEND',
  OTHER = 'OTHER',
}

export interface Photo {
  id: string;
  url: string;
  heartlinkId: string;
}

export interface SpotifyTrack {
  id: string;
  spotifyId: string;
  type: string;
  name: string;
  artist?: string;
  imageUrl?: string;
  previewUrl?: string;
  heartlinkId: string;
}

export interface Activity {
  id: string;
  content: string;

  heartlinkId: string;
}

export interface Compliment {
  id: string;
  content: string;

  heartlinkId: string;
}

export interface ScratchCard {
  id: string;
  content: string;

  heartlinkId: string;
}

export interface Heartlink {
  id: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  senderName: string;
  recipientName: string;
  occasion: HeartlinkOccasion;
  relation: HeartlinkRelation;
  message?: string;
  photos?: Photo[];
  spotifyTrack?: SpotifyTrack;
  activities?: Activity[];
  compliments?: Compliment[];
  scratchCard?: ScratchCard[];
}

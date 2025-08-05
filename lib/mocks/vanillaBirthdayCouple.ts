import { HeartlinkOccasion, HeartlinkRelation } from './types';

export const vanillaBirthdayCouple = {
  id: 'mock-id',
  slug: 'mock-slug',
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'active',
  type: 'birthday',
  senderName: 'Boeing',
  recipientName: 'Manhattan',
  gifterName: 'Boeing',
  gifteeName: 'Manhattan',
  occasion: HeartlinkOccasion.BIRTHDAY,
  relation: HeartlinkRelation.COUPLE,
  message:
    'Happy Birthday, legend! May your wrinkles be few, your snacks never end, and your group chats always spicy. Keep being fabulously weird—like glitter in a world full of beige!',

  photos: [
    {
      id: 'photo-1',
      url: '/sample_photos/g_prime_1.jpg',
      heartlinkId: 'mock-id',
    },
    {
      id: 'photo-2',
      url: '/sample_photos/g_prime_2.jpg',
      heartlinkId: 'mock-id',
    },
    {
      id: 'photo-3',
      url: '/sample_photos/g_prime_3.jpg',
      heartlinkId: 'mock-id',
    },
    {
      id: 'photo-4',
      url: '/sample_photos/g_prime_4.jpg',
      heartlinkId: 'mock-id',
    },
  ],

  spotifyTrack: {
    id: 'spotify-1',
    spotifyId: '7ouMYWpwJ422jRcDASZB7P',
    type: 'track',
    name: 'All of Me',
    artist: 'John Legend',
    imageUrl: 'https://i.scdn.co/image/...',
    previewUrl: 'https://p.scdn.co/mp3-preview/...',
  },

  activities: [
    { id: 'activity-1', content: 'Movie Night', isCustom: false },
    { id: 'activity-2', content: 'Cooking Together', isCustom: false },
  ],

  compliments: [
    { id: 'compliment-1', content: "You're amazing!", isCustom: false },
    { id: 'compliment-2', content: 'You light up my world!', isCustom: false },
  ],

  scratchCard: [
    { id: 'scratch-1', content: 'Free Hug Coupon!', isCustom: false },
    { id: 'scratch-2', content: 'Breakfast in Bed', isCustom: false },
  ],
};

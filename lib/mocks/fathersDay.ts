import { HeartlinkOccasion, HeartlinkRelation } from './types';

export const fathersDay = {
  id: 'mock-id',
  slug: 'mock-slug',
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'active',
  type: 'birthday',
  senderName: 'Gopika',
  recipientName: 'Papa',
  gifterName: 'Gopika',
  gifteeName: 'Papa',
  occasion: HeartlinkOccasion.FATHERS_DAY,
  relation: HeartlinkRelation.FATHER,
  message:
    "To the best papa in the universe, happy father's day! Thank you for always being so loving, so kind and so involved in my education - from having all those maths classes, telling me how much fun it will be when I'm in IIT Delhi to actually teaching me maths and physics (when I understood nothing in Fiitjee) - you're the reason I'm the person I am. Thank you for sending me to all those classes - yoga, golf, horse riding, swimming, sunderkand and so many more. You've worked tirelessly and exceeded expectations in each role you've been in, be it a really awesome father or a phenomenal police officer and I'm so grateful to you and also so proud to call you my papa <3",

  photos: [
    {
      id: 'photo-1',
      url: '/sample_photos/father/father_1.JPG',
      heartlinkId: 'mock-id',
    },
    {
      id: 'photo-2',
      url: '/sample_photos/father/father_2.JPG',
      heartlinkId: 'mock-id',
    },
    {
      id: 'photo-3',
      url: '/sample_photos/father/father_3.JPG',
      heartlinkId: 'mock-id',
    },
    {
      id: 'photo-4',
      url: '/sample_photos/father/father_4.JPG',
      heartlinkId: 'mock-id',
    },
    {
      id: 'photo-5',
      url: '/sample_photos/father/father_5.JPG',
      heartlinkId: 'mock-id',
    },
    {
      id: 'photo-6',
      url: '/sample_photos/father/father_6.JPG',
      heartlinkId: 'mock-id',
    },
    {
      id: 'photo-7',
      url: '/sample_photos/father/father_7.JPG',
      heartlinkId: 'mock-id',
    },
    {
      id: 'photo-8',
      url: '/sample_photos/father/father_8.JPG',
      heartlinkId: 'mock-id',
    },
    {
      id: 'photo-9',
      url: '/sample_photos/father/father_9.JPG',
      heartlinkId: 'mock-id',
    },
    {
      id: 'photo-10',
      url: '/sample_photos/father/father_10.jpg',
      heartlinkId: 'mock-id',
    },
  ],

  // spotifyTrack: {
  //   id: "spotify-1",
  //   spotifyId: "7ouMYWpwJ422jRcDASZB7P",
  //   type: "track",
  //   name: "All of Me",
  //   artist: "John Legend",
  //   imageUrl: "https://i.scdn.co/image/...",
  //   previewUrl: "https://p.scdn.co/mp3-preview/..."
  // },

  activities: [
    {
      id: 'activity-1',
      content: 'Go to a pottery class',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-2',
      content: 'Go to a cat cafe',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-3',
      content: 'Go to a dog cafe',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-4',
      content:
        'Go to a sunset cinema club - outdoor movie night (remember to carry insect repellent)',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-5',
      content: 'Go to an amusement park',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-6',
      content: 'Go to an indoor rock climbing gym',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-7',
      content: 'Go on a photo walk',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-8',
      content:
        'Go on a colour walk - choose a colour, take a walk and click pictures of everything you find in your colour',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-9',
      content: 'Go to the gym together',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-10',
      content: 'Attend a concert',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-11',
      content: 'Go to a restaurant with live music',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-12',
      content: 'Trip to vietnam',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-13',
      content: 'Trip to europe',
      heartlinkId: 'fathers-day-2024',
    },
    { id: 'activity-14', content: 'Goa trip', heartlinkId: 'fathers-day-2024' },
    {
      id: 'activity-15',
      content: 'Weekend trip',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-16',
      content: 'Immersive show exhibition',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-17',
      content: 'Attend a dance class',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-18',
      content: 'Italian restaurant',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-19',
      content: 'Burmese restaurant',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-20',
      content: 'Cafe hopping',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-21',
      content: 'Learn crochet',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-22',
      content: 'Picnic in a park',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-23',
      content: 'Book a badminton court (and play)',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-24',
      content: 'Trampoline park outing',
      heartlinkId: 'fathers-day-2024',
    },
    { id: 'activity-25', content: 'Art cafe', heartlinkId: 'fathers-day-2024' },
    {
      id: 'activity-26',
      content: 'Go paragliding',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-27',
      content: 'Go skydiving',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-28',
      content: 'Scuba diving',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-29',
      content: 'Attend a stand-up comedy',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-30',
      content: 'Water park',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-31',
      content: 'Build a lego set',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-32',
      content: 'Attend a Theatre Play',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-33',
      content: 'Go bowling',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-34',
      content: 'Go karting',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-35',
      content: 'Put your detective hat on and visit mystery rooms',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-36',
      content: 'Tote bag painting',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-37',
      content: 'Try canvas painting',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-38',
      content: 'Make clay models',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-39',
      content: 'Visit a zoo',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-40',
      content: 'Visit a wildlife sanctuary',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-41',
      content: 'Visit a monument',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-42',
      content: "5k run (spin again if you're lazy)",
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-43',
      content: 'Sufi music night',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-44',
      content: 'Jamming session',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-45',
      content: 'Board game night',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-46',
      content: 'Barsana Trek',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'activity-47',
      content: 'Football at home',
      heartlinkId: 'fathers-day-2024',
    },
  ],

  compliments: [
    {
      id: 'compliment-1',
      content: 'Very smart papa',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-2',
      content: 'Took us to ambani wedding',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-3',
      content: 'Very jolly',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-4',
      content: 'Loves outdoors',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-5',
      content: 'Softest Hands',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-6',
      content: 'Very kind heart',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-7',
      content: 'Very practical',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-8',
      content: 'Endless energy',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-9',
      content: 'Very encouraging',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-10',
      content: 'Confident',
      heartlinkId: 'fathers-day-2024',
    },
    { id: 'compliment-11', content: 'Loving', heartlinkId: 'fathers-day-2024' },
    {
      id: 'compliment-12',
      content: 'Cheerful',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-13',
      content: 'Heart of gold',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-14',
      content: 'Remembers everything ever studied',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-15',
      content: 'Master of maths, physics',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-16',
      content: 'Teaches very well',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-17',
      content: 'Great leader',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-18',
      content: 'Cutest Papa',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-19',
      content: 'Human teddybear',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-20',
      content: 'Gentle spirit',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-21',
      content: 'Great storyteller',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-22',
      content: 'Cute dimples',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-23',
      content: 'Joyful soul',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-24',
      content: 'Infectious laugh',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-25',
      content: 'Very hardworking',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-26',
      content: 'Never says no',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-27',
      content: 'Inspiration (to all my friends)',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-28',
      content: 'Role model',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-29',
      content: 'Best papa ever',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-30',
      content: 'Very trusting',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-31',
      content: 'Never scolds',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-32',
      content: 'Always happy',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'compliment-33',
      content: 'Never stressed even though very busy',
      heartlinkId: 'fathers-day-2024',
    },
  ],

  scratchCard: [
    {
      id: 'scratch-1',
      content: 'Head scratches',
      heartlinkId: 'fathers-day-2024',
    },
    {
      id: 'scratch-2',
      content: 'Mandir cleaning service',
      heartlinkId: 'fathers-day-2024',
    },
    { id: 'scratch-3', content: 'Hug Coupon', heartlinkId: 'fathers-day-2024' },
    {
      id: 'scratch-4',
      content: "I'll be chef",
      heartlinkId: 'fathers-day-2024',
    },
  ],
};

const sampleGift = {
  gifterName: 'John Doe',
  gifteeName: 'Jane Smith',
  occasion: 'BIRTHDAY',
  relation: 'FRIEND',
  message: "Happy birthday! Here's a special gift just for you.",

  photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],

  spotifyTrack: {
    spotifyId: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
    type: 'track',
    name: 'Starboy',
    artist: 'The Weeknd',
    imageUrl: 'https://i.scdn.co/image/example',
    previewUrl: 'https://p.scdn.co/mp3-preview/example',
  },

  activities: [
    {
      content: 'Go for a picnic in the park',
    },
    {
      content: 'Watch the sunset at our favorite spot',
    },
  ],

  compliments: [
    {
      content: "Your smile brightens everyone's day",
    },
    {
      content: "You're the most thoughtful person I know",
    },
  ],

  scratchCard: {
    content: "You've won a special dinner date!",
  },
};

module.exports = { sampleGift };

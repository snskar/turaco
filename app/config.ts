export const config = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  api: {
    gift: {
      create: '/api/gift',
      get: '/api/gift',
    }
  },
  defaultImages: {
    placeholder: '/assets/placeholder.jpg',
    kawaiiBg: '/assets/kawaii-bg.jpg'
  }
} 
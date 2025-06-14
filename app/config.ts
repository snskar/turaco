export const config = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  api: {
    heartlink: {
      create: '/api/heartlink',
      get: '/api/heartlink',
    }
  },
  defaultImages: {
    placeholder: '/assets/placeholder.jpg',
    kawaiiBg: '/assets/kawaii-bg.jpg'
  }
} 
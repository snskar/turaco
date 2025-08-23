import type { Metadata } from 'next';
import { Baloo_2 } from 'next/font/google';
import './globals.css';

const baloo2 = Baloo_2({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Heartlink',
  description: 'A delightful app for daily positivity',
  icons: {
    icon: [
      { url: '/assets/branding/favico/favicon.ico' },
      {
        url: '/assets/branding/favico/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/assets/branding/favico/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/assets/branding/favico/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/assets/branding/favico/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: '/assets/branding/favico/apple-touch-icon.png',
  },
  manifest: '/assets/branding/favico/site.webmanifest',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`antialiased min-h-screen ${baloo2.className}`}>
        {children}
      </body>
    </html>
  );
}

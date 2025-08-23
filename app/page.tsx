// app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center">
      {/* Background gradient and subtle overlay to match admin aesthetics */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 via-white to-cyan-50/30" />
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-cyan-100/20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl px-6">
        <div className="text-center bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 px-8 py-10">
          <h1 className="text-5xl font-extrabold tracking-tight">heartlink</h1>
          <p className="mt-4 text-lg text-gray-700">
            A playful way to create shareable, interactive keepsakes for the
            people you love.
          </p>
          <Link
            href="https://turaco-ink.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 rounded-lg bg-gradient-to-r from-pink-500 to-cyan-500 px-6 py-3 text-white font-medium shadow-sm hover:from-pink-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            Visit turaco-ink.com
          </Link>
        </div>
      </div>
    </main>
  );
}

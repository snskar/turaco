// app/page.tsx
'use client';

import Link from 'next/link';

import TwinklingStars from '@/components/ui/backgrounds/TwinklingStars';
import OptimizedImage from '@/components/ui/OptimizedImage';
import ThreeDBusinessCard from '@/components/ui/ThreeDBusinessCard';
import MobileDeviceFrame from '@/components/ui/MobileDeviceFrame';

import { KawaiiBackgroundDarker } from '@/components/ui/backgrounds/KawaiiBackgroundDarker';

export default function Home() {
  return (
    <KawaiiBackgroundDarker>
      <main className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden">
        {/* Background with subtle gradient and twinkling stars */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-white to-cyan-50/40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-100/20 via-transparent to-cyan-100/30 pointer-events-none" />
        <TwinklingStars starCount={15} />

        {/* Left side - Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center lg:items-end lg:pr-8 xl:pr-12 p-8 lg:p-12">
          <div className="max-w-lg w-full space-y-8">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start">
              <OptimizedImage
                src="/assets/branding/heartlink-logo.png"
                alt="Heartlink Logo"
                width={240}
                height={240}
                className="max-w-full h-auto object-contain"
                useCloudinary={true}
                priority
                loading="eager"
              />
            </div>

            {/* Heartlink text with gradient */}
            <div className="text-center lg:text-left">
              <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-pink-500 via-pink-400 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                heartlink
              </h1>
            </div>

            {/* Link to turaco-ink */}
            <div className="flex justify-center lg:justify-start">
              <Link
                href="https://turaco-ink.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-gradient-to-r from-pink-500 to-cyan-500 px-6 py-3 text-white font-medium shadow-lg hover:from-pink-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-xl transform hover:scale-105"
              >
                Visit turaco-ink.com
              </Link>
            </div>

            {/* Business Card - Desktop: below link, Mobile: stacked */}
            <div className="flex justify-center lg:justify-start pt-4">
              <ThreeDBusinessCard
                src="/assets/card/card_2_front.png"
                alt="Heartlink Card"
                finish="holo"
                width={350}
                className="transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Right side - Mobile Device Frame (full height on desktop) */}
        <div className="relative z-10 flex-shrink-0 flex items-center justify-center lg:justify-start lg:pl-8 xl:pl-12 p-8 lg:p-12 lg:w-1/2">
          <MobileDeviceFrame
            url="https://heartlink.turaco-ink.com/heartlink/1010-1-WgUYiP"
            title="Heartlink Demo - Gopika's Birthday"
            width={380}
            className="transform hover:scale-105 transition-transform duration-300"
            showNotch={true}
            tilt={true}
          />
        </div>

        {/* Footer text */}
        <div className="relative z-10 mt-8 text-center"></div>
      </main>
    </KawaiiBackgroundDarker>
  );
}

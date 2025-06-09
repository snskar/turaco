"use client";

import { notFound } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { Gift } from '@/app/types/gift';
import { config } from '@/app/config';
import { CardStack } from "@/components/scratch-card/CardStack";
import ScratchCard from "@/components/scratch-card/Card";
import KawaiiBackgroundDarker from "@/components/ui/KawaiiBackgroundDarker";
import ComplimentShower from "@/components/compliment-shower/Game";
import SpinTheWheel from "@/components/spin-the-wheel/SpinTheWheel";
import Slideshow from "@/components/slideshow/Slideshow";
import SplashTitle from "@/components/ui/SplashTitle";

import { getCompliments } from '@/lib/utils';

async function getGift(slug: string): Promise<Gift | null> {
  try {
    const res = await fetch(`${config.appUrl}${config.api.gift.get}?slug=${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching gift:', error);
    return null;
  }
}

export default function GiftPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [gift, setGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGift() {
      const giftData = await getGift(resolvedParams.slug);
      setGift(giftData);
      setLoading(false);
    }
    loadGift();
  }, [resolvedParams.slug]);

  // Loading shimmer
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-pulse text-2xl">Loading your special gift...</div>
      </main>
    );
  }

  if (!gift) {
    notFound();
  }

  // Convert photos to slideshow format
  const slideshowImages = gift.photos?.map(photo => ({
    src: photo.url,
    alt: "Gift Photo"
  })) || [];

  // Convert activities to wheel options
  const wheelOptions = gift.activities?.map(activity => activity.content) || [];

  // Create multiple scratch cards for visual effect
  const scratchCards = gift.scratchCard ? Array(4).fill(
    <ScratchCard 
      key={gift.scratchCard.id}
      text={gift.scratchCard.content}
      onComplete={() => console.log('Scratch complete')}
    />
  ) : [];

  // Get compliments from the gift
  const compliments = getCompliments(gift);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <KawaiiBackgroundDarker>
        <SplashTitle 
          title={gift.occasion}
          name={gift.gifteeName}
          message={gift.message || `A special gift from ${gift.gifterName}`}
        />

        {/* Photos Slideshow */}
        {slideshowImages.length > 0 && (
          <div className="p-7">
            <Slideshow images={slideshowImages} />
          </div>
        )}

        {/* Compliments Shower */}
        {compliments.length > 0 && (
          <div className="relative mb-16">
            <ComplimentShower 
              compliments={compliments}
              autoStart={true}
            />
          </div>
        )}

        {/* Scratch Cards */}
        {scratchCards.length > 0 && (
          <div className="py-40 items-center justify-center">
            <CardStack>
              {scratchCards}
            </CardStack>
          </div>
        )}

        {/* Activities Wheel */}
        {wheelOptions.length > 0 && (
          <SpinTheWheel 
            options={wheelOptions} 
            centerImageSrc="/assets/hamster.png"
          />
        )}
      </KawaiiBackgroundDarker>
    </main>
  );
} 
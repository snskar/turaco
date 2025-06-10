"use client";

import { notFound } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { Heartlink, Photo, Activity } from '@/app/types/heartlink';
import { config } from '@/app/config';
import { CardStack } from "@/components/scratch-card/CardStack";
import ScratchCard from "@/components/scratch-card/Card";
import KawaiiBackgroundDarker from "@/components/ui/KawaiiBackgroundDarker";
import ComplimentShower from "@/components/compliment-shower/Game";
import SpinTheWheel from "@/components/spin-the-wheel/SpinTheWheel";
import Slideshow from "@/components/slideshow/Slideshow";
import SplashTitle from "@/components/ui/SplashTitle";

import { getCompliments } from '@/lib/utils';

async function getHeartlink(slug: string): Promise<Heartlink | null> {
  try {
    const res = await fetch(`${config.appUrl}${config.api.heartlink.get}?slug=${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching heartlink:', error);
    return null;
  }
}

export default function HeartlinkPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [heartlink, setHeartlink] = useState<Heartlink | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHeartlink() {
      const data = await getHeartlink(resolvedParams.slug);
      setHeartlink(data);
      setLoading(false);
    }
    loadHeartlink();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-pulse text-2xl">Loading your special message...</div>
      </main>
    );
  }

  if (!heartlink) {
    notFound();
  }

  const slideshowImages = heartlink.photos?.map((photo: Photo) => ({
    src: photo.url,
    alt: "Photo"
  })) || [];

  const wheelOptions = heartlink.activities?.map((activity: Activity) => activity.content) || [];

  const scratchCards = heartlink.scratchCard ? Array(4).fill(
    <ScratchCard 
      key={heartlink.scratchCard.id}
      text={heartlink.scratchCard.content}
      onComplete={() => console.log('Scratch complete')}
    />
  ) : [];

  const compliments = getCompliments(heartlink);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <KawaiiBackgroundDarker>
        <SplashTitle 
          title={heartlink.occasion}
          name={heartlink.recipientName}
          message={heartlink.message || `A special message from ${heartlink.senderName}`}
        />

        {slideshowImages.length > 0 && (
          <div className="p-7">
            <Slideshow images={slideshowImages} />
          </div>
        )}

        {compliments.length > 0 && (
          <div className="relative mb-16">
            <ComplimentShower 
              compliments={compliments}
              autoStart={true}
            />
          </div>
        )}

        {scratchCards.length > 0 && (
          <div className="py-40 items-center justify-center">
            <CardStack>
              {scratchCards}
            </CardStack>
          </div>
        )}

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
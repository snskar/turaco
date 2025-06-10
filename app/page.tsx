// app/page.tsx or pages/index.tsx
"use client";

import { CardStack } from "@/components/scratch-card/CardStack";
import ScratchCard from "@/components/scratch-card/Card";
import KawaiiBackgroundDarker from "@/components/ui/KawaiiBackgroundDarker";
import HolographicBackground from "@/components/ui/HolographicBackground";
import ComplimentShower from "@/components/compliment-shower/Game";
import SpinTheWheel from "@/components/spin-the-wheel/SpinTheWheel";
import Slideshow from "@/components/slideshow/Slideshow";
import SplashTitle from "@/components/ui/splash-title/SplashTitle";
import HolographicText from "@/components/ui/HolographicText";
import HolographicBackground2 from "@/components/ui/HolographicBackground2";
import {DEFAULT_WHEEL_OPTIONS} from "@/components/spin-the-wheel/constants";
import { ComponentHeader } from "../components/ui/ComponentHeader/ComponentHeader";
import { COMPONENT_HEADERS } from "../components/ui/ComponentHeader/constants";
import {DEFAULT_SCRATCH_CARD_OPTIONS} from "@/components/scratch-card/constants";
import {pickRandomValues} from "@/lib/utils";


export default function Home() {


const images = [
  {
    src: "/sample_photos/g_prime_1.jpg", 
    alt: "hamster"
  },
  {
    src: "/sample_photos/g_prime_2.jpg", 
    alt: "hamster"
  },
  {
    src: "/sample_photos/g_prime_3.jpg", 
    alt: "hamster"
  },
  {
    src: "/sample_photos/g_prime_4.jpg", 
    alt: "hamster"
  },
]

  return (
    
      <main className="flex min-h-screen flex-col items-center justify-center">
        <KawaiiBackgroundDarker>
          <SplashTitle title="Happy Birthday" name="Random" message="Happy Birthday, legend! May your wrinkles be few, your snacks never end, and your group chats always spicy. Keep being fabulously weird—like glitter in a world full of beige!" />
          <div className="relative mb-16">
            <ComponentHeader 
              title={COMPONENT_HEADERS.SLIDESHOW.title}
              subtitle={COMPONENT_HEADERS.SLIDESHOW.subtitle}
            />
            <div className="m-6">
              <Slideshow images={images} />
            </div>
          </div>
          <div className="relative mb-16">
            <ComponentHeader 
              title={COMPONENT_HEADERS.COMPLIMENT_SHOWER.title}
              subtitle={COMPONENT_HEADERS.COMPLIMENT_SHOWER.subtitle}
            />
            <ComplimentShower/>
          </div>  

          <ComponentHeader 
            title={COMPONENT_HEADERS.SCRATCH_CARD.title}
            subtitle={COMPONENT_HEADERS.SCRATCH_CARD.subtitle}
          />
          <div className="py-40 items-center justify-center">
            <CardStack cards={pickRandomValues(DEFAULT_SCRATCH_CARD_OPTIONS.OTHER, 5)} />
          </div>

          <ComponentHeader 
            title={COMPONENT_HEADERS.SPIN_THE_WHEEL.title}
            subtitle={COMPONENT_HEADERS.SPIN_THE_WHEEL.subtitle}
          />
          <SpinTheWheel options={DEFAULT_WHEEL_OPTIONS.COUPLE} centerImageSrc="/assets/art/hamster.png" />
        </KawaiiBackgroundDarker>
        

      </main>

  );
}

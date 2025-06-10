// app/page.tsx or pages/index.tsx
"use client";

import { CardStack } from "@/components/scratch-card/CardStack";
import ScratchCard from "@/components/scratch-card/Card";
import KawaiiBackgroundDarker from "@/components/ui/KawaiiBackgroundDarker";
import HolographicBackground from "@/components/ui/HolographicBackground";
import ComplimentShower from "@/components/compliment-shower/Game";
import SpinTheWheel from "@/components/spin-the-wheel/SpinTheWheel";
import Slideshow from "@/components/slideshow/Slideshow";
import SplashTitle from "@/components/ui/SplashTitle";
import HolographicText from "@/components/ui/HolographicText";
import HolographicBackground2 from "@/components/ui/HolographicBackground2";


export default function Home() {

  const options = [
  "Go on a trip",
  "Pottery class",
  "Movie marathon",
  "Hiking adventure",
  "Picnic in the park",
  "Karaoke night",
  "Board game day",
  "Visit a museum",
  "Go to the beach",
  "Attend a live concert",
  "Volunteer locally",
  "Photography challenge",
  "Spa day at home",
  "Learn a new recipe",
  "Write a short story",
  "Bike ride adventure",
  "Do a puzzle",
  "Attend a dance class",
  "Plant a garden",
  "Yoga session",
  "DIY home project",
  "Crafting day",
  "Try a new sport",
];

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
          <SplashTitle title="Happy Birthday" name="Gopika" message="Happy Birthday, legend! May your wrinkles be few, your snacks never end, and your group chats always spicy. Keep being fabulously weird—like glitter in a world full of beige!" />
          <div className="p-7">
            <Slideshow images={images} />
          </div>
          <div className="relative mb-16">
            <ComplimentShower/>
          </div>  

        <div className="py-40 items-center justify-center">
          <CardStack>
            <ScratchCard/>
            <ScratchCard/>
            <ScratchCard/>
            <ScratchCard/>
          </CardStack>

          </div>
          <SpinTheWheel options={options} centerImageSrc="/assets/art/hamster.png" />
          <HolographicText>{"Sample Text"}</HolographicText>
        </KawaiiBackgroundDarker>
        

      </main>

  );
}

// app/page.tsx or pages/index.tsx
"use client";

// import ComplimentShower from "@/components/compliment-shower/Game";
import { CardStack } from "@/components/scratch-card/CardStack";
import ScratchCard from "@/components/scratch-card/Card";
import KawaiiBackground from "@/components/ui/KawaiiBackground";
import KawaiiBackgroundDarker from "@/components/ui/KawaiiBackgroundDarker";
import ComplimentShower from "@/components/compliment-shower/Game";
// import SpinTheWheel from "@/components/games/compliment-shower-3/SpinTheWheel";
import SpinTheWheel from "@/components/spin-the-wheel/SpinTheWheel";
import Slideshow from "@/components/slideshow/Slideshow";

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
  // "Play mini-golf",
  // "Meditation retreat",
  // "Go roller skating",
  // "Go to a theme park",
  // "Visit an escape room",
  // "Host a potluck",
  // "Try indoor rock climbing",
  // "Plan a themed dinner",
  // "Play laser tag",
  // "Go bowling",
  // "Do an art project",
  // "Watch a sunrise",
  // "Plan a treasure hunt",
  // "Stargazing night",
  // "Try ice skating",
  // "Do a digital detox",
  // "Create a vision board"
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
          <SpinTheWheel options={options} centerImageSrc="/assets/hamster.png" />
        </KawaiiBackgroundDarker>

      </main>

  );
}

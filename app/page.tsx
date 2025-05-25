// app/page.tsx or pages/index.tsx
"use client";

import ComplimentShower from "@/components/games/compliment-shower/Logic3";
// import { CardStack } from "@/components/games/compliment-shower/CardStack";
// import  SpinTheWheel  from "@/components/games/compliment-shower/SpinTheWheel";

export default function Home() {

//   const options = [
//   "Go on a trip",
//   "Pottery class",
//   "Movie marathon",
//   "Hiking adventure",
//   "Picnic in the park",
//   "Karaoke night",
//   "Board game day",
//   "Visit a museum",
//   "Go to the beach",
//   "Attend a live concert",
//   "Volunteer locally",
//   "Photography challenge",
//   "Spa day at home",
//   "Learn a new recipe",
//   "Write a short story",
//   "Bike ride adventure",
//   "Do a puzzle",
//   "Attend a dance class",
//   "Plant a garden",
//   "Yoga session",
//   "DIY home project",
//   "Crafting day",
//   "Try a new sport",
//   "Play mini-golf",
//   "Meditation retreat",
//   "Go roller skating",
//   "Go to a theme park",
//   "Visit an escape room",
//   "Host a potluck",
//   "Try indoor rock climbing",
//   "Plan a themed dinner",
//   "Play laser tag",
//   "Go bowling",
//   "Do an art project",
//   "Watch a sunrise",
//   "Plan a treasure hunt",
//   "Stargazing night",
//   "Try ice skating",
//   "Do a digital detox",
//   "Create a vision board"
// ];


  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* <CardStack>
        < ScratchCard/>
        < ScratchCard/>
        < ScratchCard/>
        < ScratchCard/>
      </CardStack>
      <h1 className="text-3xl font-bold mb-4">Spin the Wheel</h1>
      <SpinTheWheel options={options}  centerImageSrc="/drop.png"/> */}
      <ComplimentShower/>
    </main>
  );
}

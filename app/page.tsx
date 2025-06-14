// app/page.tsx or pages/index.tsx
"use client";

import { CardStack } from "@/components/scratch-card/CardStack";
import KawaiiBackgroundDarker from "@/components/ui/KawaiiBackgroundDarker";
import ComplimentShower from "@/components/compliment-shower/Game";
import SpinTheWheel from "@/components/spin-the-wheel/SpinTheWheel";
import Slideshow from "@/components/slideshow/Slideshow";
import SplashTitle from "@/components/ui/splash-title/SplashTitle";
import { ComponentHeader } from "@/components/ui/ComponentHeader/ComponentHeader";
import { COMPONENT_HEADERS } from "@/components/ui/ComponentHeader/constants";
import { fathersDay } from "@/lib/mocks/fathersDay";
import { getPropifiedHeartlink } from "@/lib/utils";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


export default function Home() {


// const images = [
//   {
//     src: "/sample_photos/g_prime_1.jpg", 
//     alt: "hamster"
//   },
//   {
//     src: "/sample_photos/g_prime_2.jpg", 
//     alt: "hamster"
//   },
//   {
//     src: "/sample_photos/g_prime_3.jpg", 
//     alt: "hamster"
//   },
//   {
//     src: "/sample_photos/g_prime_4.jpg", 
//     alt: "hamster"
//   },
// ]

  // return (
    
  //     <main className="flex min-h-screen flex-col items-center justify-center">
  //       <KawaiiBackgroundDarker>
  //         <SplashTitle title="Happy Birthday" name="Random" message="Happy Birthday, legend! May your wrinkles be few, your snacks never end, and your group chats always spicy. Keep being fabulously weird—like glitter in a world full of beige!" />
  //         <div className="relative mb-16">
  //           <ComponentHeader 
  //             title={COMPONENT_HEADERS.SLIDESHOW.title}
  //             subtitle={COMPONENT_HEADERS.SLIDESHOW.subtitle}
  //           />
  //           <div className="my-4">
  //             <Slideshow images={images} />
  //           </div>
  //         </div>
  //         <div className="relative mb-16">
  //           <ComponentHeader 
  //             title={COMPONENT_HEADERS.COMPLIMENT_SHOWER.title}
  //             subtitle={COMPONENT_HEADERS.COMPLIMENT_SHOWER.subtitle}
  //           />
  //           <ComplimentShower/>
  //         </div>  



  //         <ComponentHeader 
  //           title={COMPONENT_HEADERS.SCRATCH_CARD.title}
  //           subtitle={COMPONENT_HEADERS.SCRATCH_CARD.subtitle}
  //         />
  //         <div className="py-50 items-center justify-center">
  //           <CardStack cards={pickRandomValues(DEFAULT_SCRATCH_CARD_OPTIONS.OTHER, 5)} />
  //         </div>

  //         <ComponentHeader 
  //           title={COMPONENT_HEADERS.SPIN_THE_WHEEL.title}
  //           subtitle={COMPONENT_HEADERS.SPIN_THE_WHEEL.subtitle}
  //         />
  //         <SpinTheWheel options={DEFAULT_WHEEL_OPTIONS.COUPLE} centerImageSrc="/assets/art/hamster.png" />
          
  //         <div className="mt-16">
  //           <SpotifyEmbed trackId="7ouMYWpwJ422jRcDASZB7P" />
  //         </div>
  //       </KawaiiBackgroundDarker>
        

  //     </main>

const {
  splashTitleProps, 
  slideshowProps, 
  complimentShowerProps, 
  cardStackProps, 
  spinTheWheelProps, 
} = getPropifiedHeartlink(fathersDay);

const message2 = "Thanks for always being so supportive, trusting me and having confidence in me when I don't in myself. You're a role model in everything you do - your job, being the best son to dada dadi, being an amazing husband to mommy and being an absolutely father to Maadhav and I - even when we are nowhere near being good children. You're an inspiration (to all my friends who sometimes like hanging out with you more than me). Thanks for being such a kind and joyful spirit, spreading happiness wherever you are!";

return (
    
  <main className="flex min-h-screen flex-col items-center justify-center">
    <KawaiiBackgroundDarker>
      <SplashTitle {...splashTitleProps} />
      <div className="relative mb-16">
        <ComponentHeader 
          title={COMPONENT_HEADERS.SLIDESHOW.title}
          subtitle={COMPONENT_HEADERS.SLIDESHOW.subtitle}
        />
        <div className="my-4">
          <Slideshow {...slideshowProps} />
        </div>
      </div>
      <div className="relative mb-16">
        <ComponentHeader 
          title={COMPONENT_HEADERS.COMPLIMENT_SHOWER.title}
          subtitle={COMPONENT_HEADERS.COMPLIMENT_SHOWER.subtitle}
        />
        <ComplimentShower {...complimentShowerProps} />
      </div>  



      <ComponentHeader 
        title={COMPONENT_HEADERS.SCRATCH_CARD.title}
        subtitle={COMPONENT_HEADERS.SCRATCH_CARD.subtitle}
      />
      <div className="py-50 items-center justify-center">
        <CardStack {...cardStackProps} />
      </div>

      <ComponentHeader 
        title={COMPONENT_HEADERS.SPIN_THE_WHEEL.title}
        subtitle={COMPONENT_HEADERS.SPIN_THE_WHEEL.subtitle}
      />
      <SpinTheWheel {...spinTheWheelProps} />

      <motion.p 
              className={cn(
                "text-base sm:text-lg md:text-xl",
                "text-white/90 font-medium mt-4",
                "max-w-[90%]",
                "drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]",
                "text-center",
                "m-16"
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {message2}
              </motion.p>
    </KawaiiBackgroundDarker>
    

  </main>

  );
}

'use client';

import KawaiiBackgroundDarker from '@/components/ui/backgrounds/KawaiiBackgroundDarker';
import SplashTitle from '@/components/ui/splash-title/SplashTitle';
import Slideshow from '@/components/slideshow/Slideshow';
import ComplimentShower from '@/components/compliment-shower/Game';
import { ComponentHeader } from '@/components/ui/ComponentHeader/ComponentHeader';
import { COMPONENT_HEADERS } from '@/components/ui/ComponentHeader/constants';
import { CardStack } from '@/components/scratch-card/CardStack';
import SpinTheWheel from '@/components/spin-the-wheel/SpinTheWheel';
import { PropifiedHeartlink } from '@/lib/utils';

export default function ClientHeartlink({
  splashTitleProps,
  slideshowProps,
  complimentShowerProps,
  cardStackProps,
  spinTheWheelProps,
}: PropifiedHeartlink) {
  const hasImages =
    Array.isArray(slideshowProps?.images) && slideshowProps.images.length > 0;
  return (
    <KawaiiBackgroundDarker>
      <SplashTitle {...splashTitleProps} />
      {hasImages && (
        <div className="relative mb-16">
          <ComponentHeader
            title={COMPONENT_HEADERS.SLIDESHOW.title}
            subtitle={COMPONENT_HEADERS.SLIDESHOW.subtitle}
          />
          <div className="my-4">
            <Slideshow {...slideshowProps} />
          </div>
        </div>
      )}
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
    </KawaiiBackgroundDarker>
  );
}

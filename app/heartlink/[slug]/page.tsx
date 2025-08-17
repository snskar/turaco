import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPropifiedHeartlink } from '@/lib/utils';
import type { Heartlink } from '@/app/types/heartlink';
import ClientHeartlink from './ClientHeartlink';

export const revalidate = 0;

export default async function HeartlinkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') ?? 'http';
  const baseUrl = `${protocol}://${host}`;

  const response = await fetch(
    `${baseUrl}/api/heartlink?slug=${encodeURIComponent(slug)}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch heartlink');
  }

  const json = await response.json();
  const heartlink = json?.data as Heartlink;

  const {
    splashTitleProps,
    slideshowProps,
    complimentShowerProps,
    cardStackProps,
    spinTheWheelProps,
  } = getPropifiedHeartlink(heartlink);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <ClientHeartlink
        splashTitleProps={splashTitleProps}
        slideshowProps={slideshowProps}
        complimentShowerProps={complimentShowerProps}
        cardStackProps={cardStackProps}
        spinTheWheelProps={spinTheWheelProps}
      />
    </main>
  );
}

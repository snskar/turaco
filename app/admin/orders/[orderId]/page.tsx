import { prisma } from '@/lib/prisma';
import type { Heartlink as PrismaHeartlink } from '@prisma/client';
import { Mail, Phone, MapPin, Package } from 'lucide-react';
import HeartlinkCard from './HeartlinkCard';

export default async function OrderDetail({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  type AdminHeartlink = PrismaHeartlink & {
    recipientEmail?: string | null;
    recipientPhone?: string | null;
    scheduledTime?: Date | string | null;
    emailSent?: boolean;
    emailSentAt?: Date | string | null;
    coverPhotoUrl: string | null;
  };
  const { orderId } = await params;
  const heartlinks = (await prisma.heartlink.findMany({
    where: { shopifyOrderId: orderId },
    orderBy: { createdAt: 'asc' },
  })) as unknown as AdminHeartlink[];

  if (heartlinks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No records for order {orderId}</p>
        </div>
      </div>
    );
  }

  const any = heartlinks[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-cyan-50/30 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-cyan-100/20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-8 w-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Order {any.shopifyOrderNumber}{' '}
              <span className="text-gray-400">({any.shopifyOrderId})</span>
            </h1>
          </div>
          <p className="text-gray-600">
            Detailed view for all Heartlinks in this order
          </p>
        </div>

        {/* Order meta */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">
                  {any.customerEmail || '-'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">
                  {any.customerPhone || '-'}
                </span>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  {[
                    any.shippingName,
                    any.shippingAddress1,
                    any.shippingAddress2,
                    any.shippingCity,
                    any.shippingProvince,
                    any.shippingZip,
                    any.shippingCountry,
                  ]
                    .filter(Boolean)
                    .join(', ') || '-'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Heartlink details - vertical cards */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="space-y-4 p-4">
            {heartlinks.map(h => (
              <HeartlinkCard key={h.id} heartlink={h} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

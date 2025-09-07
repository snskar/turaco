import { prisma } from '@/lib/prisma';
import {
  Mail,
  Phone,
  MapPin,
  Package,
  ExternalLink,
  Image as ImageIcon,
  Download as DownloadIcon,
} from 'lucide-react';
import Image from 'next/image';

export default async function OrderDetail({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  type WithCoverPhoto = { coverPhotoUrl: string | null };
  const { orderId } = await params;
  const heartlinks = await prisma.heartlink.findMany({
    where: { shopifyOrderId: orderId },
    orderBy: { createdAt: 'asc' },
  });

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

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-pink-50 to-cyan-50">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900 border-b border-gray-200">
                    Slug
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900 border-b border-gray-200">
                    Heartlink URL
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900 border-b border-gray-200">
                    Variant
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900 border-b border-gray-200">
                    SKU
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900 border-b border-gray-200">
                    Cover Photo
                  </th>
                </tr>
              </thead>
              <tbody>
                {heartlinks.map((h, index) => {
                  const coverUrl = (h as unknown as WithCoverPhoto)
                    .coverPhotoUrl;
                  return (
                    <tr
                      key={h.id}
                      className={
                        index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/50'
                      }
                    >
                      <td className="px-6 py-4 border-b border-gray-100 font-mono text-sm">
                        {h.slug}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-100">
                        <a
                          href={`/heartlink/${h.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-pink-600 hover:text-pink-700 flex items-center gap-1"
                        >
                          <span className="font-mono text-sm">{`heartlink.turaco.com/heartlink/${h.slug}`}</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-100">
                        {h.variantTitle || '-'}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-100">
                        {h.variantSku || '-'}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-100">
                        {coverUrl ? (
                          <div className="flex items-center gap-3">
                            <a
                              href={coverUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="block relative"
                            >
                              <Image
                                src={coverUrl}
                                alt="Cover"
                                width={90}
                                height={60}
                                className="rounded-lg object-contain border border-gray-200 bg-gray-50"
                              />
                            </a>
                            <a
                              href={coverUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm"
                            >
                              <ImageIcon className="h-4 w-4" />
                              View image
                            </a>
                            <a
                              href={coverUrl}
                              download
                              className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm"
                            >
                              <DownloadIcon className="h-4 w-4" />
                              Download
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4 p-4">
            {heartlinks.map(h => {
              const coverUrl = (h as unknown as WithCoverPhoto).coverPhotoUrl;
              return (
                <div
                  key={h.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-pink-500" />
                      <span className="font-semibold text-gray-900">
                        {h.slug}
                      </span>
                    </div>
                    <a
                      href={`/heartlink/${h.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </a>
                  </div>

                  {coverUrl && (
                    <>
                      <a
                        href={coverUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block mb-2"
                      >
                        <div className="relative w-full aspect-[3/2]">
                          <Image
                            src={coverUrl}
                            alt="Cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="rounded-lg object-contain border border-gray-200 bg-gray-50"
                          />
                        </div>
                      </a>
                      <a
                        href={coverUrl}
                        download
                        className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm mb-3"
                      >
                        <DownloadIcon className="h-4 w-4" />
                        Download image
                      </a>
                    </>
                  )}

                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <span className="text-gray-500">Variant:</span>
                      <span className="ml-2">{h.variantTitle || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">SKU:</span>
                      <span className="ml-2">{h.variantSku || '-'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import type { Heartlink as PrismaHeartlink } from '@prisma/client';
import {
  Mail,
  Phone,
  MapPin,
  Package,
  ExternalLink,
  Download as DownloadIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { authenticatedFetch } from '@/app/admin/lib/auth';

type WithCoverPhoto = { coverPhotoUrl: string | null };
type AdminHeartlink = PrismaHeartlink & {
  recipientEmail?: string | null;
  recipientPhone?: string | null;
  scheduledTime?: Date | string | null;
  coverPhotoUrl: string | null;
  slug: string;
};

export default function OrderDetail() {
  const params = useParams();
  const [heartlinks, setHeartlinks] = useState<AdminHeartlink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const orderId = params.orderId as string;

  useEffect(() => {
    const fetchHeartlinks = async () => {
      try {
        const res = await authenticatedFetch(
          `/admin/api/heartlink?orderId=${orderId}`
        );
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Failed to load heartlinks');
        }
        const data = Array.isArray(json.data)
          ? json.data
          : json.data
            ? [json.data]
            : [];
        setHeartlinks(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load heartlinks'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHeartlinks();
  }, [orderId]);

  const handleSendEmail = useCallback(
    async (heartlink: AdminHeartlink, email: string) => {
      if (!email) {
        setEmailError('No customer email found for this order');
        setTimeout(() => setEmailError(null), 5000);
        return;
      }

      setSendingEmailId(heartlink.id);
      setEmailError(null);
      setEmailSuccess(null);

      try {
        const res = await authenticatedFetch('/admin/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            heartlinkId: heartlink.id,
            email: email,
            slug: heartlink.slug,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Failed to send email');
        }

        setEmailSuccess(`Email sent to ${email}`);
        setTimeout(() => setEmailSuccess(null), 5000);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to send email';
        setEmailError(errorMsg);
        setTimeout(() => setEmailError(null), 5000);
      } finally {
        setSendingEmailId(null);
      }
    },
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || heartlinks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            {error || `No records for order ${orderId}`}
          </p>
        </div>
      </div>
    );
  }

  const any = heartlinks[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-cyan-50/30 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-cyan-100/20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Email notifications */}
        {emailSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {emailSuccess}
          </div>
        )}

        {emailError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg
              className="h-5 w-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {emailError}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-900">
                Order {any.shopifyOrderNumber}{' '}
                <span className="text-gray-400">({any.shopifyOrderId})</span>
              </h1>
            </div>
            {any.customerEmail && (
              <button
                onClick={() => handleSendEmail(any, any.customerEmail!)}
                disabled={sendingEmailId === any.id}
                className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {sendingEmailId === any.id ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Send Email
                  </>
                )}
              </button>
            )}
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
            {heartlinks.map(h => {
              const coverUrl = (h as unknown as WithCoverPhoto).coverPhotoUrl;
              const isDigital = Boolean(h.recipientEmail && h.recipientPhone);
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
                        href={`/admin/api/download?url=${encodeURIComponent(coverUrl)}&filename=${encodeURIComponent('cover.jpg')}`}
                        className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm mb-3"
                      >
                        <DownloadIcon className="h-4 w-4" />
                        Download image
                      </a>
                    </>
                  )}

                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <span className="text-gray-500">Heartlink URL:</span>
                      <a
                        className="ml-2 text-pink-600 hover:text-pink-700 break-all"
                        href={`/heartlink/${h.slug}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {`heartlink.turaco.com/heartlink/${h.slug}`}
                      </a>
                    </div>
                    <div>
                      <span className="text-gray-500">Variant:</span>
                      <span className="ml-2">{h.variantTitle || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">SKU:</span>
                      <span className="ml-2">{h.variantSku || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Recipient:</span>
                      <span className="ml-2">{h.recipientName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Sender:</span>
                      <span className="ml-2">{h.senderName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Recipient Email:</span>
                      <span className="ml-2">{h.recipientEmail || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Recipient Phone:</span>
                      <span className="ml-2">{h.recipientPhone || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Digital Product:</span>
                      {isDigital ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          No
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-500">Occasion:</span>
                      <span className="ml-2">{h.occasion || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Relation:</span>
                      <span className="ml-2">{h.relation || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Scheduled:</span>
                      <span className="ml-2">
                        {h.scheduledTime
                          ? new Date(h.scheduledTime).toLocaleString()
                          : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2">{h.status || '-'}</span>
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

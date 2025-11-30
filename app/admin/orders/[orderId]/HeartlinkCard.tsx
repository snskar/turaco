'use client';

import { useState } from 'react';
import {
  Package,
  ExternalLink,
  Download as DownloadIcon,
  Mail,
  Clock,
  CheckCircle,
  Send,
  AlertCircle,
} from 'lucide-react';
import Image from 'next/image';
import { authenticatedFetch } from '@/app/admin/lib/auth';

type HeartlinkCardProps = {
  heartlink: {
    id: string;
    slug: string;
    variantTitle: string | null;
    variantSku: string | null;
    recipientName: string;
    senderName: string;
    recipientEmail: string | null;
    recipientPhone: string | null;
    scheduledTime: Date | string | null;
    emailSent: boolean;
    emailSentAt: Date | string | null;
    status: string | null;
    occasion: string;
    relation: string;
    coverPhotoUrl: string | null;
  };
};

export default function HeartlinkCard({ heartlink: h }: HeartlinkCardProps) {
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  const isDigital = Boolean(h.recipientEmail && h.recipientPhone);
  const hasEmail = Boolean(h.recipientEmail);
  const coverUrl = h.coverPhotoUrl;

  const handleSendEmail = async () => {
    if (!hasEmail) return;

    setSending(true);
    setSendError(null);
    setSendSuccess(false);

    try {
      const res = await authenticatedFetch('/api/admin/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          heartlinkSlug: h.slug,
          updateDatabase: true,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || json.details || 'Failed to send email');
      }

      setSendSuccess(true);
      // Refresh the page after 2 seconds to show updated status
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-pink-500" />
          <span className="font-semibold text-gray-900">{h.slug}</span>
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

      <div className="text-sm text-gray-700 space-y-1 mb-4">
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
            {h.scheduledTime ? new Date(h.scheduledTime).toLocaleString() : '-'}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Status:</span>
          <span className="ml-2">{h.status || '-'}</span>
        </div>
      </div>

      {/* Email Status Section */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">
            Email Status
          </span>
          {hasEmail ? (
            h.emailSent ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Sent</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-600">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium">Pending</span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-1 text-gray-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs font-medium">No Email</span>
            </div>
          )}
        </div>

        {hasEmail && (
          <>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Email Sent:</span>
                <span className="text-gray-700">
                  {h.emailSent ? 'Yes' : 'No'}
                </span>
              </div>
              {h.emailSentAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Sent At:</span>
                  <span className="text-gray-700">
                    {new Date(h.emailSentAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleSendEmail}
              disabled={sending}
              className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {h.emailSent ? 'Resend Email' : 'Send Email Now'}
                </>
              )}
            </button>

            {sendError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{sendError}</span>
              </div>
            )}

            {sendSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Email sent successfully!</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

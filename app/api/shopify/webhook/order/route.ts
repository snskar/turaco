import { NextResponse } from 'next/server';
import {
  HeartlinkRelation,
  HeartlinkOccasion,
  HeartlinkStatus,
} from '@prisma/client';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { nanoid } from 'nanoid';

export const runtime = 'nodejs';

// Add a constant for the Shopify webhook secret so we can easily configure/override via env
const SHOPIFY_WEBHOOK_SECRET =
  process.env.SHOPIFY_WEBHOOK_SECRET || 'placeholder_secret';

// Verify Shopify webhook
function verifyShopifyWebhook(data: string, hmac: string | null) {
  if (!hmac) return false;

  const calculated_hmac = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(data)
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(calculated_hmac),
    Buffer.from(hmac)
  );
}

// Define types for line items and properties
interface LineItem {
  id: string;
  product_id: string | number;
  properties: Property[];
}

interface Property {
  name: string;
  value: string;
}

export async function POST(req: Request) {
  try {
    // Get the HMAC header
    const hmac = req.headers.get('x-shopify-hmac-sha256');

    // Get the raw body
    const rawBody = await req.text();

    // Verify webhook
    if (!verifyShopifyWebhook(rawBody, hmac)) {
      return NextResponse.json(
        { success: false, error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse the body
    const data = JSON.parse(rawBody);

    // Check if this order contains any Heartlink products (cast to string because Shopify IDs can be numeric)
    const heartlinkLineItems: LineItem[] = (data.line_items || []).filter(
      (item: LineItem) =>
        String(item.product_id) ===
        String(process.env.SHOPIFY_HEARTLINK_PRODUCT_ID)
    );

    // If there are no Heartlink items in this order, we can safely acknowledge and exit early.
    if (heartlinkLineItems.length === 0) {
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: 'Not a Heartlink order',
      });
    }

    // Extract Heartlink properties from line item. Shopify stores custom line item properties as an array.
    const heartlinkPropsByLineItem: Record<string, Record<string, string>> = {};

    heartlinkLineItems.forEach(item => {
      heartlinkPropsByLineItem[item.id] = (item.properties || []).reduce(
        (acc: Record<string, string>, prop: Property) => {
          if (prop.name && typeof prop.value === 'string') {
            acc[prop.name.trim()] = prop.value.trim();
          }
          return acc;
        },
        {}
      );
    });

    // Helper function to safely split comma-separated lists and trim values.
    const splitList = (value?: string) =>
      value
        ? value
            .split(',')
            .map(v => v.trim())
            .filter(Boolean)
        : [];

    // Iterate over each Heartlink item and create individual records.
    const createdHeartlinks = await Promise.all(
      heartlinkLineItems.map(async (item, idx) => {
        const propsRecord = heartlinkPropsByLineItem[item.id] || {};

        // Map Shopify property keys -> Heartlink fields
        const senderName = propsRecord['Gifter Name'] || 'Anonymous';
        const recipientName = propsRecord['Giftee Name'] || 'Friend';
        const relationRaw = (propsRecord['Relation'] || 'OTHER').toUpperCase();
        const occasionRaw = (propsRecord['Occasion'] || 'OTHER')
          .toUpperCase()
          .replace(/\s+/g, '_');
        const message = propsRecord['Message'] || undefined;
        const compliments = splitList(propsRecord['Compliments']);
        const activities = splitList(propsRecord['Spin the Wheel Ideas']);
        const scratchCards = splitList(propsRecord['Scratch Card Coupons']);
        const photoUrls = splitList(propsRecord['Photos']);

        // Cast to Prisma enums with fallbacks
        const relation: HeartlinkRelation = (
          Object.values(HeartlinkRelation) as string[]
        ).includes(relationRaw)
          ? (relationRaw as HeartlinkRelation)
          : HeartlinkRelation.OTHER;
        const occasion: HeartlinkOccasion = (
          Object.values(HeartlinkOccasion) as string[]
        ).includes(occasionRaw)
          ? (occasionRaw as HeartlinkOccasion)
          : HeartlinkOccasion.OTHER;

        // Generate a short unique slug. Include item index to avoid collisions within the same order.
        const slug = `${data.order_number}-${idx + 1}-${nanoid(6)}`;

        // Persist this Heartlink to DB
        const heartlink = await prisma.heartlink.create({
          data: {
            slug,
            senderName,
            recipientName,
            relation,
            occasion,
            message,
            status: HeartlinkStatus.PENDING,
            shopifyOrderId: String(data.id),
            shopifyOrderNumber: data.order_number,
            shopifyLineItemId: String(item.id),
            shopifyProductId: String(item.product_id),

            // Photos – create if any URLs provided
            photos: photoUrls.length
              ? {
                  create: photoUrls.map(url => ({
                    url,
                    publicId: nanoid(10),
                  })),
                }
              : undefined,

            // Compliments
            compliments: compliments.length
              ? { create: compliments.map(c => ({ content: c })) }
              : undefined,

            // Activities (Spin-the-Wheel ideas)
            activities: activities.length
              ? { create: activities.map(a => ({ content: a })) }
              : undefined,

            // Scratch cards
            scratchCard: scratchCards.length
              ? { create: scratchCards.map(s => ({ content: s })) }
              : undefined,
          },
        });

        return heartlink.slug;
      })
    );

    // Acknowledge success back to Shopify with all generated slugs (must be <= 1s ideally)
    return NextResponse.json({ success: true, slugs: createdHeartlinks });
  } catch (error) {
    console.error('Shopify Webhook Error:', error);

    // In development, include the error message for easier debugging.
    const isDev = process.env.NODE_ENV !== 'production';
    return NextResponse.json(
      {
        success: false,
        error: 'Webhook processing failed',
        message: isDev && error instanceof Error ? error.message : undefined,
        stack: isDev && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

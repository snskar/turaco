import { NextResponse } from 'next/server';
import {
  PrismaClient,
  HeartlinkRelation,
  HeartlinkOccasion,
  HeartlinkStatus,
} from '@prisma/client';
import crypto from 'crypto';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

// Verify Shopify webhook
function verifyShopifyWebhook(data: string, hmac: string | null) {
  if (!hmac) return false;

  const calculated_hmac = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET || '')
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
      return new NextResponse('Invalid webhook signature', { status: 401 });
    }

    // Parse the body
    const data = JSON.parse(rawBody);

    // Check if this is a Heartlink product (cast to string because Shopify IDs can be numeric)
    const heartlinkLineItem: LineItem | undefined = data.line_items.find(
      (item: LineItem) =>
        String(item.product_id) ===
        String(process.env.SHOPIFY_HEARTLINK_PRODUCT_ID)
    );

    if (!heartlinkLineItem) {
      return new NextResponse('Not a Heartlink order', { status: 200 });
    }

    // Extract Heartlink properties from line item. Shopify stores custom line item properties as an array.
    const propsRecord: Record<string, string> =
      heartlinkLineItem.properties.reduce(
        (acc: Record<string, string>, prop: Property) => {
          if (prop.name && typeof prop.value === 'string') {
            acc[prop.name.trim()] = prop.value.trim();
          }
          return acc;
        },
        {}
      );

    // Helper function to safely split comma-separated lists and trim values.
    const splitList = (value?: string) =>
      value
        ? value
            .split(',')
            .map(v => v.trim())
            .filter(Boolean)
        : [];

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

    // Generate a short unique slug. Using order number enhances traceability but keep slug human friendly.
    const slug = `${data.order_number}-${nanoid(6)}`;

    // Persist to DB
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
        shopifyLineItemId: String(heartlinkLineItem.id),
        shopifyProductId: String(heartlinkLineItem.product_id),

        // Photos – create if any URLs provided
        photos: photoUrls.length
          ? {
              create: photoUrls.map(url => ({ url, publicId: nanoid(10) })),
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

    // Acknowledge success back to Shopify (must be <= 1s ideally)
    return NextResponse.json({ success: true, slug: heartlink.slug });
  } catch (error) {
    console.error('Shopify Webhook Error:', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}

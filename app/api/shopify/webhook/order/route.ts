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
  quantity?: number;
  variant_title?: string;
  variant_id?: string | number;
  sku?: string | null;
  title?: string;
}

interface Property {
  name: string;
  value: string;
}

// Normalize Relation coming from Shopify to Prisma enum
function mapRelationToPrismaEnum(input: string): HeartlinkRelation {
  const normalized = (input || '').trim().toUpperCase();

  // Group couple-like relations under COUPLE for better defaults in UI
  const coupleSet = new Set(['BOYFRIEND', 'GIRLFRIEND', 'HUSBAND', 'WIFE']);
  if (coupleSet.has(normalized)) {
    return HeartlinkRelation.COUPLE;
  }

  // Direct mappings that match Prisma enums
  const direct = new Set<HeartlinkRelation>([
    HeartlinkRelation.COUPLE,
    HeartlinkRelation.FATHER,
    HeartlinkRelation.MOTHER,
    HeartlinkRelation.SISTER,
    HeartlinkRelation.BROTHER,
    HeartlinkRelation.FRIEND,
    HeartlinkRelation.OTHER,
  ]);

  if ((Array.from(direct) as string[]).includes(normalized)) {
    return normalized as HeartlinkRelation;
  }

  return HeartlinkRelation.OTHER;
}

// Normalize Occasion coming from Shopify to Prisma enum
function mapOccasionToPrismaEnum(input: string): HeartlinkOccasion {
  const raw = (input || '').trim();
  const upper = raw.toUpperCase();
  const underscored = upper.replace(/\s+/g, '_');

  // Special cases from Shopify options → Prisma enum
  const specialMap: Record<string, HeartlinkOccasion> = {
    // "Valentine's Day" → VALENTINES
    "VALENTINE'S_DAY": HeartlinkOccasion.VALENTINES,
    VALENTINES: HeartlinkOccasion.VALENTINES,
    // "Just because I love them" → I_LOVE_YOU
    JUST_BECAUSE_I_LOVE_THEM: HeartlinkOccasion.I_LOVE_YOU,
  };

  if (underscored in specialMap) {
    return specialMap[underscored];
  }

  // Direct mappings
  const valid = new Set<HeartlinkOccasion>([
    HeartlinkOccasion.BIRTHDAY,
    HeartlinkOccasion.NEW_YEAR,
    HeartlinkOccasion.DIWALI,
    HeartlinkOccasion.RAKSHA_BANDHAN,
    HeartlinkOccasion.CHRISTMAS,
    HeartlinkOccasion.VALENTINES,
    HeartlinkOccasion.ANNIVERSARY,
    HeartlinkOccasion.CONGRATULATIONS,
    HeartlinkOccasion.GET_WELL_SOON,
    HeartlinkOccasion.I_AM_SORRY,
    HeartlinkOccasion.I_LOVE_YOU,
    HeartlinkOccasion.OTHER,
  ]);

  if ((Array.from(valid) as string[]).includes(underscored)) {
    return underscored as HeartlinkOccasion;
  }

  return HeartlinkOccasion.OTHER;
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

    // Check if this order contains any Heartlink products.
    // Prefer product_id check when env is provided, else fall back to presence of custom properties.
    const targetProductId = process.env.SHOPIFY_HEARTLINK_PRODUCT_ID
      ? String(process.env.SHOPIFY_HEARTLINK_PRODUCT_ID)
      : null;

    const heartlinkLineItems: LineItem[] = (data.line_items || []).filter(
      (item: LineItem) => {
        if (targetProductId) {
          return String(item.product_id) === targetProductId;
        }
        // Fallback: heartlink items always carry our custom properties
        const props = (item.properties || []) as Property[];
        return (
          Array.isArray(props) &&
          props.some(
            p => (p?.name || '').toLowerCase() === 'gifter name'.toLowerCase()
          )
        );
      }
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

    // Expand items by quantity (create one Heartlink per quantity unit)
    const itemsToCreate: LineItem[] = heartlinkLineItems.flatMap(item => {
      const qty = Math.max(1, Number(item.quantity || 1));
      return Array.from({ length: qty }, () => item);
    });

    // Iterate over each Heartlink unit and create individual records.
    const createdHeartlinks = await Promise.all(
      itemsToCreate.map(async (item, idx) => {
        const propsRecord = heartlinkPropsByLineItem[item.id] || {};

        // Map Shopify property keys -> Heartlink fields
        const senderName = propsRecord['Gifter Name'] || 'Anonymous';
        const recipientName = propsRecord['Giftee Name'] || 'Friend';
        const relationRaw = propsRecord['Relation'] || 'OTHER';
        const occasionRaw = propsRecord['Occasion'] || 'OTHER';
        const message = propsRecord['Message'] || undefined;
        const compliments = splitList(propsRecord['Compliments']);
        const activities = splitList(propsRecord['Spin the Wheel Ideas']);
        const scratchCards = splitList(propsRecord['Scratch Card Coupons']);
        const photoUrls = splitList(propsRecord['Photos']);
        const coverPhotoUrl = propsRecord['Cover Photo'] || undefined;

        // Map to Prisma enums with robust normalization
        const relation: HeartlinkRelation =
          mapRelationToPrismaEnum(relationRaw);
        const occasion: HeartlinkOccasion =
          mapOccasionToPrismaEnum(occasionRaw);

        // Generate a short unique slug. Include unit index to avoid collisions within the same order.
        const slug = `${data.order_number}-${idx + 1}-${nanoid(6)}`;

        // Pull customer-level identity
        const customerEmail: string | undefined =
          data.email || data.customer?.email || undefined;
        const customerPhone: string | undefined =
          data.phone ||
          data.customer?.phone ||
          data.shipping_address?.phone ||
          data.billing_address?.phone ||
          undefined;

        // Shipping address (prefer shipping_address, fallback to default customer address)
        const shipping =
          data.shipping_address || data.customer?.default_address || {};
        const shippingName: string | undefined = shipping?.name || undefined;
        const shippingAddress1: string | undefined =
          shipping?.address1 || undefined;
        const shippingAddress2: string | undefined =
          shipping?.address2 || undefined;
        const shippingCity: string | undefined = shipping?.city || undefined;
        const shippingProvince: string | undefined =
          shipping?.province || undefined;
        const shippingZip: string | undefined = shipping?.zip || undefined;
        const shippingCountry: string | undefined =
          shipping?.country || undefined;

        // Variant details from line item
        const variantTitle: string | undefined =
          item.variant_title || undefined;
        const variantId: string | undefined =
          item.variant_id != null ? String(item.variant_id) : undefined;
        const variantSku: string | undefined = item.sku || undefined;

        // Persist this Heartlink to DB
        const createData = {
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

          // Customer + shipping
          customerEmail,
          customerPhone,
          shippingName,
          shippingAddress1,
          shippingAddress2,
          shippingCity,
          shippingProvince,
          shippingZip,
          shippingCountry,

          // Variant
          variantTitle,
          variantId,
          variantSku,

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
        };

        if (coverPhotoUrl) {
          (createData as { coverPhotoUrl?: string }).coverPhotoUrl =
            coverPhotoUrl;
        }

        const heartlink = await prisma.heartlink.create({ data: createData });

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

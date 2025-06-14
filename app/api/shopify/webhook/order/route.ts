import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

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
    
    // Check if this is a Heartlink product
    const heartlinkLineItem = data.line_items.find(
      (item: any) => item.product_id === process.env.SHOPIFY_HEARTLINK_PRODUCT_ID
    );

    if (!heartlinkLineItem) {
      return new NextResponse('Not a Heartlink order', { status: 200 });
    }

    // Extract Heartlink properties from line item
    const properties = heartlinkLineItem.properties.reduce((acc: any, prop: any) => {
      acc[prop.name] = prop.value;
      return acc;
    }, {});

    // Create Heartlink
    const heartlink = await prisma.heartlink.create({
      data: {
        slug: data.order_number.toString(), // Use order number as slug
        senderName: properties.senderName,
        recipientName: properties.recipientName,
        occasion: properties.occasion,
        relation: properties.relation,
        message: properties.message,
        // Add any other fields you need
      }
    });

    // Return success
    return NextResponse.json({
      success: true,
      orderId: data.order_number,
      heartlinkSlug: heartlink.slug
    });

  } catch (error) {
    console.error('Webhook Error:', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const orderId = searchParams.get('orderId');
    const orderNumberParam = searchParams.get('orderNumber');

    if (!slug && !orderId && !orderNumberParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Provide one of: slug, orderId, or orderNumber',
        },
        { status: 400 }
      );
    }

    let heartlink = null as Awaited<
      ReturnType<typeof prisma.heartlink.findFirst>
    > | null;
    let heartlinks = null as Awaited<
      ReturnType<typeof prisma.heartlink.findMany>
    > | null;

    if (slug) {
      heartlink = await prisma.heartlink.findUnique({
        where: { slug },
      });
    } else if (orderId) {
      heartlinks = await prisma.heartlink.findMany({
        where: { shopifyOrderId: orderId },
      });
    } else if (orderNumberParam) {
      const orderNumber = Number(orderNumberParam);
      if (Number.isNaN(orderNumber)) {
        return NextResponse.json(
          { success: false, error: 'orderNumber must be a valid integer' },
          { status: 400 }
        );
      }
      heartlinks = await prisma.heartlink.findMany({
        where: { shopifyOrderNumber: orderNumber },
      });
    }

    if (!heartlink && (!heartlinks || heartlinks.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Heartlink not found' },
        { status: 404 }
      );
    }

    if (heartlinks) {
      return NextResponse.json({ success: true, data: heartlinks });
    }

    return NextResponse.json({ success: true, data: heartlink });
  } catch (error: unknown) {
    console.error('Admin API Error fetching heartlink:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch heartlink',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

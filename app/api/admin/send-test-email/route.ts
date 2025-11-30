import { NextResponse } from 'next/server';
import { sendHeartlinkEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * Manual endpoint to test email sending for a specific Heartlink
 *
 * Usage:
 * POST /api/admin/send-test-email
 * Body: { "heartlinkSlug": "abc123xyz" }
 *
 * This endpoint is useful for:
 * - Testing email functionality
 * - Manually resending an email
 * - Debugging email issues
 *
 * Note: This does NOT check if email was already sent or if scheduledTime has passed
 */
export async function POST(request: Request) {
  try {
    // In production, you should add authentication here
    // For example, check for admin session or API key
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET;

    if (adminSecret && authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { heartlinkSlug } = body;

    if (!heartlinkSlug) {
      return NextResponse.json(
        { error: 'heartlinkSlug is required in request body' },
        { status: 400 }
      );
    }

    // Find the heartlink
    const heartlink = await prisma.heartlink.findUnique({
      where: { slug: heartlinkSlug },
    });

    if (!heartlink) {
      return NextResponse.json(
        { error: `Heartlink with slug "${heartlinkSlug}" not found` },
        { status: 404 }
      );
    }

    if (!heartlink.recipientEmail) {
      return NextResponse.json(
        { error: 'This Heartlink does not have a recipient email' },
        { status: 400 }
      );
    }

    // Send the email
    console.log(
      `[Test Email] Sending email for Heartlink ${heartlink.slug} to ${heartlink.recipientEmail}`
    );

    const emailResult = await sendHeartlinkEmail({
      recipientEmail: heartlink.recipientEmail,
      recipientName: heartlink.recipientName,
      senderName: heartlink.senderName,
      heartlinkSlug: heartlink.slug,
      occasion: heartlink.occasion,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send email',
          details: emailResult.error,
        },
        { status: 500 }
      );
    }

    // Optionally update the database to mark as sent
    const shouldUpdateDatabase = body.updateDatabase !== false; // Default true

    if (shouldUpdateDatabase) {
      await prisma.heartlink.update({
        where: { id: heartlink.id },
        data: {
          emailSent: true,
          emailSentAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      heartlinkSlug: heartlink.slug,
      recipientEmail: heartlink.recipientEmail,
      messageId: emailResult.messageId,
      databaseUpdated: shouldUpdateDatabase,
    });
  } catch (error) {
    console.error('[Test Email] Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send test email',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

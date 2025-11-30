import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendHeartlinkEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const maxDuration = 60; // Maximum execution time: 60 seconds

/**
 * Cron job endpoint to send scheduled Heartlink emails
 *
 * This endpoint should be called periodically (e.g., every 5-15 minutes) by:
 * - Vercel Cron Jobs (https://vercel.com/docs/cron-jobs)
 * - GitHub Actions
 * - External cron service (e.g., cron-job.org)
 *
 * Security: Protected by CRON_SECRET environment variable
 */
export async function GET(request: Request) {
  try {
    // Verify the request is authorized (cron secret)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    console.log(`[Cron] Running scheduled email check at ${now.toISOString()}`);

    // Find all heartlinks that:
    // 1. Have a recipient email
    // 2. Have a scheduled time that has passed
    // 3. Haven't been sent yet
    const heartlinksToSend = await prisma.heartlink.findMany({
      where: {
        recipientEmail: {
          not: null,
        },
        scheduledTime: {
          lte: now,
        },
        emailSent: false,
      },
      take: 50, // Process max 50 emails per run to avoid timeouts
    });

    console.log(`[Cron] Found ${heartlinksToSend.length} emails to send`);

    if (heartlinksToSend.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No scheduled emails to send',
        emailsSent: 0,
      });
    }

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    // Send emails and update database
    for (const heartlink of heartlinksToSend) {
      try {
        console.log(
          `[Cron] Sending email for Heartlink ${heartlink.slug} to ${heartlink.recipientEmail}`
        );

        const emailResult = await sendHeartlinkEmail({
          recipientEmail: heartlink.recipientEmail!,
          recipientName: heartlink.recipientName,
          senderName: heartlink.senderName,
          heartlinkSlug: heartlink.slug,
          occasion: heartlink.occasion,
        });

        if (emailResult.success) {
          // Mark email as sent
          await prisma.heartlink.update({
            where: { id: heartlink.id },
            data: {
              emailSent: true,
              emailSentAt: new Date(),
            },
          });

          successCount++;
          results.push({
            heartlinkId: heartlink.id,
            slug: heartlink.slug,
            status: 'sent',
            messageId: emailResult.messageId,
          });

          console.log(`[Cron] ✓ Email sent successfully for ${heartlink.slug}`);
        } else {
          failureCount++;
          results.push({
            heartlinkId: heartlink.id,
            slug: heartlink.slug,
            status: 'failed',
            error: emailResult.error,
          });

          console.error(
            `[Cron] ✗ Failed to send email for ${heartlink.slug}:`,
            emailResult.error
          );
        }
      } catch (error) {
        failureCount++;
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        results.push({
          heartlinkId: heartlink.id,
          slug: heartlink.slug,
          status: 'error',
          error: errorMessage,
        });

        console.error(`[Cron] ✗ Error processing ${heartlink.slug}:`, error);
      }
    }

    console.log(
      `[Cron] Completed: ${successCount} sent, ${failureCount} failed`
    );

    return NextResponse.json({
      success: true,
      message: `Processed ${heartlinksToSend.length} scheduled emails`,
      emailsSent: successCount,
      emailsFailed: failureCount,
      results,
    });
  } catch (error) {
    console.error('[Cron] Fatal error in send-scheduled-emails:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process scheduled emails',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint with same functionality as GET
 * Some cron services prefer POST requests
 */
export async function POST(request: Request) {
  return GET(request);
}

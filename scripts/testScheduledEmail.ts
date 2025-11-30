/**
 * Script to test the scheduled email feature
 *
 * Usage:
 *   npx tsx scripts/testScheduledEmail.ts [command]
 *
 * Commands:
 *   create - Create a test Heartlink with scheduled email
 *   list   - List pending scheduled emails
 *   sent   - List recently sent emails
 *   status - Show both pending and sent emails
 */

import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

async function createTestHeartlink() {
  console.log('🧪 Creating test Heartlink with scheduled email...\n');

  // Schedule email for 2 minutes from now
  const scheduledTime = new Date();
  scheduledTime.setMinutes(scheduledTime.getMinutes() + 2);

  const slug = nanoid(10);

  const heartlink = await prisma.heartlink.create({
    data: {
      slug,
      senderName: 'Test Sender',
      recipientName: 'Test Recipient',
      recipientEmail: 'turaco.ink@gmail.com', // Use this for onboarding@resend.dev domain
      occasion: 'BIRTHDAY',
      relation: 'FRIEND',
      message: 'This is a test Heartlink with scheduled email!',
      scheduledTime,
      photos: {
        create: [
          {
            url: 'https://picsum.photos/800/600',
            publicId: nanoid(12),
          },
        ],
      },
      compliments: {
        create: [
          { content: 'You are awesome!' },
          { content: 'You light up every room!' },
          { content: 'Your smile is contagious!' },
        ],
      },
    },
    include: {
      photos: true,
      compliments: true,
    },
  });

  console.log('✅ Test Heartlink created successfully!\n');
  console.log('📋 Details:');
  console.log(`   ID: ${heartlink.id}`);
  console.log(`   Slug: ${heartlink.slug}`);
  console.log(`   Recipient Email: ${heartlink.recipientEmail}`);
  console.log(`   Scheduled Time: ${heartlink.scheduledTime?.toISOString()}`);
  console.log(`   Email Sent: ${heartlink.emailSent}`);
  console.log(
    `   URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/heartlink/${heartlink.slug}`
  );
  console.log('\n⏰ Email will be sent in ~2 minutes when cron job runs');
  console.log('\n💡 To manually trigger the cron job now:');
  console.log(
    `   curl -X GET http://localhost:3000/api/cron/send-scheduled-emails \\`
  );
  console.log(`     -H "Authorization: Bearer YOUR_CRON_SECRET"`);
  console.log('\n💡 To send test email immediately:');
  console.log(
    `   curl -X POST http://localhost:3000/api/admin/send-test-email \\`
  );
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -H "Authorization: Bearer YOUR_ADMIN_SECRET" \\`);
  console.log(`     -d '{"heartlinkSlug": "${heartlink.slug}"}'`);
}

async function listPendingEmails() {
  console.log('📬 Checking for pending scheduled emails...\n');

  const pendingEmails = await prisma.heartlink.findMany({
    where: {
      recipientEmail: {
        not: null,
      },
      scheduledTime: {
        not: null,
      },
      emailSent: false,
    },
    orderBy: {
      scheduledTime: 'asc',
    },
    take: 10,
  });

  if (pendingEmails.length === 0) {
    console.log('   No pending scheduled emails found.');
  } else {
    console.log(`   Found ${pendingEmails.length} pending email(s):\n`);
    pendingEmails.forEach((h, i) => {
      const isPast = h.scheduledTime && h.scheduledTime < new Date();
      const status = isPast ? '🔴 READY TO SEND' : '🟡 SCHEDULED';
      console.log(`   ${i + 1}. ${status}`);
      console.log(`      Slug: ${h.slug}`);
      console.log(`      To: ${h.recipientEmail}`);
      console.log(`      Scheduled: ${h.scheduledTime?.toISOString()}`);
      console.log('');
    });
  }
}

async function listRecentlySent() {
  console.log('📧 Recently sent emails:\n');

  const sentEmails = await prisma.heartlink.findMany({
    where: {
      emailSent: true,
    },
    orderBy: {
      emailSentAt: 'desc',
    },
    take: 5,
  });

  if (sentEmails.length === 0) {
    console.log('   No emails sent yet.');
  } else {
    sentEmails.forEach((h, i) => {
      console.log(`   ${i + 1}. ${h.slug}`);
      console.log(`      To: ${h.recipientEmail}`);
      console.log(`      Sent: ${h.emailSentAt?.toISOString()}`);
      console.log('');
    });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  try {
    switch (command) {
      case 'create':
        await createTestHeartlink();
        break;

      case 'list':
        await listPendingEmails();
        break;

      case 'sent':
        await listRecentlySent();
        break;

      case 'status':
        await listPendingEmails();
        console.log('');
        await listRecentlySent();
        break;

      case 'help':
      default:
        console.log('🎯 Scheduled Email Test Script\n');
        console.log('Usage: npx tsx scripts/testScheduledEmail.ts [command]\n');
        console.log('Commands:');
        console.log(
          '  create  - Create a test Heartlink with scheduled email (2 min delay)'
        );
        console.log('  list    - List pending scheduled emails');
        console.log('  sent    - List recently sent emails');
        console.log('  status  - Show both pending and sent emails');
        console.log('  help    - Show this help message');
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

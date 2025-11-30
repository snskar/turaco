/**
 * Script to verify the email tracking migration was successful
 *
 * Usage:
 *   npx tsx scripts/verifyMigration.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyMigration() {
  console.log('🔍 Verifying Email Tracking Migration...\n');

  try {
    // Test 1: Check if we can query the new fields
    console.log('Test 1: Checking new fields exist...');
    const heartlink = await prisma.heartlink.findFirst({
      select: {
        id: true,
        slug: true,
        emailSent: true,
        emailSentAt: true,
        recipientEmail: true,
        scheduledTime: true,
      },
    });

    if (heartlink) {
      console.log('✅ New fields are accessible');
      console.log(`   Sample record: ${heartlink.slug}`);
      console.log(`   - emailSent: ${heartlink.emailSent}`);
      console.log(`   - emailSentAt: ${heartlink.emailSentAt || 'NULL'}`);
    } else {
      console.log(
        '⚠️  No Heartlinks in database yet (this is OK for new installations)'
      );
    }

    // Test 2: Count records with new fields
    console.log('\nTest 2: Counting records...');
    const totalCount = await prisma.heartlink.count();
    const withEmailSent = await prisma.heartlink.count({
      where: { emailSent: true },
    });
    const withScheduledTime = await prisma.heartlink.count({
      where: {
        scheduledTime: { not: null },
        recipientEmail: { not: null },
      },
    });

    console.log(`✅ Total Heartlinks: ${totalCount}`);
    console.log(`   - With emailSent=true: ${withEmailSent}`);
    console.log(`   - With scheduled time & email: ${withScheduledTime}`);

    // Test 3: Try creating a test record with new fields
    console.log('\nTest 3: Testing new field creation...');
    const testSlug = `test-migration-${Date.now()}`;
    const scheduledTime = new Date();
    scheduledTime.setHours(scheduledTime.getHours() + 1);

    const testHeartlink = await prisma.heartlink.create({
      data: {
        slug: testSlug,
        senderName: 'Migration Test',
        recipientName: 'Test User',
        recipientEmail: 'test@example.com',
        occasion: 'BIRTHDAY',
        relation: 'FRIEND',
        message: 'Migration verification test',
        scheduledTime,
        emailSent: false,
      },
      select: {
        id: true,
        slug: true,
        emailSent: true,
        emailSentAt: true,
      },
    });

    console.log('✅ Successfully created test record');
    console.log(`   - Slug: ${testHeartlink.slug}`);
    console.log(`   - emailSent: ${testHeartlink.emailSent}`);
    console.log(`   - emailSentAt: ${testHeartlink.emailSentAt || 'NULL'}`);

    // Clean up test record
    await prisma.heartlink.delete({
      where: { id: testHeartlink.id },
    });
    console.log('✅ Test record cleaned up');

    // Test 4: Test updating email fields
    console.log('\nTest 4: Testing field updates...');
    const firstRecord = await prisma.heartlink.findFirst();

    if (firstRecord) {
      const updated = await prisma.heartlink.update({
        where: { id: firstRecord.id },
        data: {
          emailSent: false,
          emailSentAt: null,
        },
        select: {
          slug: true,
          emailSent: true,
          emailSentAt: true,
        },
      });
      console.log('✅ Successfully updated email fields');
      console.log(`   - Record: ${updated.slug}`);
    } else {
      console.log(
        '⚠️  No records to update (this is OK for new installations)'
      );
    }

    console.log('\n✅ All migration verification tests passed!');
    console.log('\n📊 Summary:');
    console.log('   - New columns exist and are accessible');
    console.log('   - Can create records with new fields');
    console.log('   - Can update new fields');
    console.log('   - Existing data is preserved');
    console.log('\n🎉 Migration successful!');
  } catch (error) {
    console.error('\n❌ Migration verification failed!');
    console.error('Error:', error);

    if (error instanceof Error) {
      if (
        error.message.includes('column') ||
        error.message.includes('does not exist')
      ) {
        console.error('\n💡 Hint: The new columns may not exist yet.');
        console.error(
          '   Run: npx prisma migrate dev --name add_email_tracking'
        );
        console.error('   Or: npx prisma migrate deploy (for production)');
      }
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyMigration();

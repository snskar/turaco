import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

type DiagnosticChecks = {
  resendApiKey: {
    configured: boolean;
    isPlaceholder: boolean;
    length: number;
  };
  emailFrom: {
    configured: boolean;
    value: string;
    domain: string;
  };
  database: {
    configured: boolean;
    connected: boolean;
  };
  emailTemplate: {
    exists: boolean;
    count: number;
    details:
      | { name: string; subject: string; isActive: boolean }[]
      | { error: string }
      | null;
  };
};

/**
 * Diagnostic endpoint to check email configuration
 * GET /admin/api/email-diagnostic
 */
export async function GET() {
  try {
    // Check for admin authentication cookie
    const token = (await cookies()).get('admin-auth')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks: {
        resendApiKey: {
          configured: !!process.env.RESEND_API_KEY,
          isPlaceholder:
            process.env.RESEND_API_KEY === 'placeholder_key' ||
            process.env.RESEND_API_KEY === '',
          length: process.env.RESEND_API_KEY?.length || 0,
        },
        emailFrom: {
          configured: !!process.env.EMAIL_FROM,
          value: process.env.EMAIL_FROM || 'onboarding@resend.dev (default)',
          domain: process.env.EMAIL_FROM
            ? process.env.EMAIL_FROM.split('@')[1]
            : 'resend.dev',
        },
        database: {
          configured: !!process.env.DATABASE_URL,
          connected: false,
        },
        emailTemplate: {
          exists: false,
          count: 0,
          details: null as
            | { name: string; subject: string; isActive: boolean }[]
            | { error: string }
            | null,
        },
      },
    };

    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      diagnostics.checks.database.connected = true;
    } catch (dbError) {
      diagnostics.checks.database.connected = false;
      console.error('[Diagnostic] Database connection failed:', dbError);
    }

    // Check for email templates
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const templates = await (prisma as any).emailTemplate.findMany({
        select: {
          id: true,
          name: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      diagnostics.checks.emailTemplate.count = templates.length;
      diagnostics.checks.emailTemplate.exists = templates.length > 0;
      diagnostics.checks.emailTemplate.details = templates;
    } catch (templateError) {
      console.error('[Diagnostic] Error fetching templates:', templateError);
      diagnostics.checks.emailTemplate.details = {
        error:
          templateError instanceof Error
            ? templateError.message
            : 'Unknown error',
      };
    }

    // Overall status
    const allChecksPass =
      diagnostics.checks.resendApiKey.configured &&
      !diagnostics.checks.resendApiKey.isPlaceholder &&
      diagnostics.checks.emailFrom.configured &&
      diagnostics.checks.database.connected &&
      diagnostics.checks.emailTemplate.exists;

    return NextResponse.json({
      success: true,
      status: allChecksPass ? 'READY' : 'NEEDS_CONFIGURATION',
      diagnostics,
      recommendations: generateRecommendations(diagnostics.checks),
    });
  } catch (error) {
    console.error('[Diagnostic] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run diagnostics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function generateRecommendations(checks: DiagnosticChecks): string[] {
  const recommendations: string[] = [];

  if (!checks.resendApiKey.configured || checks.resendApiKey.isPlaceholder) {
    recommendations.push(
      '🔴 Set RESEND_API_KEY environment variable with a valid Resend API key'
    );
  }

  if (!checks.emailFrom.configured) {
    recommendations.push(
      '🔴 Set EMAIL_FROM environment variable with a verified sender email'
    );
  } else if (
    checks.emailFrom.domain &&
    checks.emailFrom.domain !== 'resend.dev'
  ) {
    recommendations.push(
      `⚠️  EMAIL_FROM domain "${checks.emailFrom.domain}" must be verified in Resend at https://resend.com/domains`
    );
  }

  if (!checks.database.connected) {
    recommendations.push(
      '🔴 Database connection failed. Check DATABASE_URL and DIRECT_URL environment variables'
    );
  }

  if (!checks.emailTemplate.exists) {
    recommendations.push(
      '🔴 No email templates found. Run: npx tsx scripts/seedEmailTemplate.ts'
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ All checks passed! Email system is ready.');
  }

  return recommendations;
}

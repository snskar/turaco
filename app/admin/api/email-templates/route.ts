import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

// Helper function to verify admin authentication
async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin-auth');

  if (!authCookie) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Basic ')) {
      return false;
    }
  }

  return true;
}

// Default email template
const DEFAULT_TEMPLATE = {
  name: 'heartlink_notification',
  subject: `You've received something special 💖`,
  bodyText: `Hi \${recipientName},

\${senderName} has created a personalised HeartLink just for you.
It's a little something they wanted to share with you, and we hope it brings a smile to your face. :)

You can open it here:
\${heartlinkUrl}

With love,
Team Turaco Ink
https://turaco-ink.com

---
You're receiving this email because someone special sent you a HeartLink.
© \${new Date().getFullYear()} Heartlink. All rights reserved.`,
  bodyHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've received a Heartlink!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fef2f2;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef2f2;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden;">
          
          <!-- Decorative gradient top -->
          <tr>
            <td style="background: linear-gradient(135deg, #fbb6ce 0%, #f472b6 20%, #c084fc 40%, #a78bfa 60%, #7dd3fc 80%, #67e8f9 100%); padding: 0; height: 8px; border-radius: 16px 16px 0 0;">
            </td>
          </tr>

          <!-- Logo and Title on white background -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px 30px 30px; text-align: center;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <img src="https://res.cloudinary.com/dqrj6f0cm/image/upload/w_120,h_120,c_fit,f_auto,q_auto/v1764520671/IMG_0065_hvkgko.png" alt="Heartlink Logo" style="width: 120px; height: 120px; display: block; margin: 0 auto;" />
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                <span style="color: #2d3748;">You've Got a </span><span style="background: linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #7dd3fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Heartlink!</span>
              </h1>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="background-color: #ffffff; padding: 0 30px 40px;">
              <p style="margin: 0 0 20px; color: #1a202c; font-size: 18px; line-height: 1.6;">
                Hi <strong>\${recipientName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                <strong>\${senderName}</strong> has created a personalised HeartLink just for you.<br/>
                It's a little something they wanted to share with you, and we hope it brings a smile to your face. 🥰
              </p>

              <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                You can open it here:
              </p>

              <!-- CTA Button with gradient -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 10px 0 30px;">
                    <a href="\${heartlinkUrl}" style="display: inline-block; background: linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #7dd3fc 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(244, 114, 182, 0.3);">
                      Open Your HeartLink
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                With love,<br/>
                <strong style="color: #4a5568;">Team Turaco Ink</strong><br/>
                <a href="https://turaco-ink.com" style="color: #ec4899; text-decoration: none;">https://turaco-ink.com</a>
              </p>
            </td>
          </tr>

          <!-- Decorative gradient bottom with footer text on white -->
          <tr>
            <td style="background-color: #ffffff; padding: 30px; text-align: center; border-top: 1px solid #f3f4f6;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                You're receiving this email because someone special sent you a Heartlink.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                © \${new Date().getFullYear()} Heartlink. All rights reserved.
              </p>
            </td>
          </tr>

          <!-- Decorative gradient bottom -->
          <tr>
            <td style="background: linear-gradient(135deg, #fbb6ce 0%, #f472b6 20%, #c084fc 40%, #a78bfa 60%, #7dd3fc 80%, #67e8f9 100%); padding: 0; height: 8px; border-radius: 0 0 16px 16px;">
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  isActive: true,
};

// GET - Fetch all email templates
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifyAdminAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch templates from database
    // Type assertion needed until Prisma client is regenerated
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let templates = await (prisma as any).emailTemplate.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    // If no templates exist, create the default one
    if (templates.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const defaultTemplate = await (prisma as any).emailTemplate.create({
        data: DEFAULT_TEMPLATE,
      });
      templates = [defaultTemplate];
    }

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch templates',
      },
      { status: 500 }
    );
  }
}

// PUT - Update an email template
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifyAdminAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, subject, bodyText, bodyHtml } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Template ID is required' },
        { status: 400 }
      );
    }

    // Update the template
    // Type assertion needed until Prisma client is regenerated
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedTemplate = await (prisma as any).emailTemplate.update({
      where: { id },
      data: {
        subject,
        bodyText,
        bodyHtml,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedTemplate,
    });
  } catch (error) {
    console.error('Error updating email template:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to update template',
      },
      { status: 500 }
    );
  }
}

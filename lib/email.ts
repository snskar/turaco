import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendHeartlinkEmailParams {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  heartlinkSlug: string;
  occasion: string;
}

/**
 * Sends a Heartlink notification email to the recipient
 * @param params Email parameters including recipient info and heartlink details
 * @returns Promise resolving to email send result
 */
export async function sendHeartlinkEmail(
  params: SendHeartlinkEmailParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const {
      recipientEmail,
      recipientName,
      senderName,
      heartlinkSlug,
      occasion,
    } = params;

    // Generate the Heartlink URL
    const heartlinkUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/heartlink/${heartlinkSlug}`;

    // Format the occasion for display
    const formattedOccasion = formatOccasion(occasion);

    const emailHtml = generateHeartlinkEmailTemplate({
      recipientName,
      senderName,
      heartlinkUrl,
      occasion: formattedOccasion,
    });

    const emailText = generateHeartlinkEmailText({
      recipientName,
      senderName,
      heartlinkUrl,
      occasion: formattedOccasion,
    });

    // Send email using Resend
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: recipientEmail,
      subject: `You've received something special 💛`,
      html: emailHtml,
      text: emailText,
    });

    if (result.error) {
      console.error('Error sending email:', result.error);
      return {
        success: false,
        error: result.error.message || 'Failed to send email',
      };
    }

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error('Unexpected error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Formats the occasion enum to a human-readable string
 */
function formatOccasion(occasion: string): string {
  const occasionMap: Record<string, string> = {
    BIRTHDAY: 'Birthday',
    NEW_YEAR: 'New Year',
    DIWALI: 'Diwali',
    RAKSHA_BANDHAN: 'Raksha Bandhan',
    CHRISTMAS: 'Christmas',
    VALENTINES: "Valentine's Day",
    ANNIVERSARY: 'Anniversary',
    CONGRATULATIONS: 'Congratulations',
    GET_WELL_SOON: 'Get Well Soon',
    I_AM_SORRY: 'Apology',
    I_LOVE_YOU: 'Love',
    OTHER: 'Special Occasion',
  };

  return occasionMap[occasion] || 'Special Occasion';
}

/**
 * Generates HTML email template for Heartlink notification
 */
function generateHeartlinkEmailTemplate(params: {
  recipientName: string;
  senderName: string;
  heartlinkUrl: string;
  occasion: string;
}): string {
  const { recipientName, senderName, heartlinkUrl } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've received a Heartlink!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fef2f2;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #fce7f3 0%, #f0fdfa 100%);">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden;">
          
          <!-- Header with gradient and logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #fbb6ce 0%, #f472b6 20%, #c084fc 40%, #a78bfa 60%, #7dd3fc 80%, #67e8f9 100%); padding: 40px 30px; text-align: center;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <img src="https://res.cloudinary.com/dqrj6f0cm/image/upload/w_120,h_120,c_fit,f_auto,q_auto/v1764520671/IMG_0065_hvkgko.png" alt="Heartlink Logo" style="width: 120px; height: 120px; display: block; margin: 0 auto;" />
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);">
                You've Got a Heartlink!
              </h1>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #1a202c; font-size: 18px; line-height: 1.6;">
                Hi <strong>${recipientName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                <strong>${senderName}</strong> has created a personalised HeartLink just for you.<br/>
                It's a little something they wanted to share with you, and we hope it brings a smile to your face. 🥰
              </p>

              <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                You can open it here:
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 10px 0 30px;">
                    <a href="${heartlinkUrl}" style="display: inline-block; background: linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #7dd3fc 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(244, 114, 182, 0.3);">
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

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #fce7f3 0%, #cffafe 100%); padding: 30px; text-align: center; border-top: 1px solid #fbcfe8;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                You're receiving this email because someone special sent you a Heartlink.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                © ${new Date().getFullYear()} Heartlink. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generates plain text email for Heartlink notification
 */
function generateHeartlinkEmailText(params: {
  recipientName: string;
  senderName: string;
  heartlinkUrl: string;
  occasion: string;
}): string {
  const { recipientName, senderName, heartlinkUrl } = params;

  return `
Hi ${recipientName},

${senderName} has created a personalised HeartLink just for you.
It's a little something they wanted to share with you, and we hope it brings a smile to your face. 🥰

You can open it here:
${heartlinkUrl}

With love,
Team Turaco Ink
https://turaco-ink.com

---
You're receiving this email because someone special sent you a HeartLink.
© ${new Date().getFullYear()} Heartlink. All rights reserved.
  `.trim();
}

import { Resend } from 'resend';
import { prisma } from './prisma';

// Initialize Resend with API key from environment variables
// Use a placeholder during build time if the key is not available
const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder_key');

export interface SendHeartlinkEmailParams {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  heartlinkSlug: string;
  occasion: string;
  senderEmail?: string; // Optional: CC the sender on the email
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
    // Check if API key is configured
    if (
      !process.env.RESEND_API_KEY ||
      process.env.RESEND_API_KEY === 'placeholder_key'
    ) {
      console.error('RESEND_API_KEY is not configured');
      return {
        success: false,
        error:
          'Email service is not configured. Please add RESEND_API_KEY to environment variables.',
      };
    }

    const {
      recipientEmail,
      recipientName,
      senderName,
      heartlinkSlug,
      occasion,
      senderEmail,
    } = params;

    // Generate the Heartlink URL
    // In production, use the dedicated heartlink domain
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://heartlink.turaco-ink.com'
        : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const heartlinkUrl = `${baseUrl}/heartlink/${heartlinkSlug}`;

    // Format the occasion for display
    const formattedOccasion = formatOccasion(occasion);

    // Fetch the email template from the database
    const template = await getEmailTemplate('heartlink_notification');

    if (!template) {
      console.error('Email template not found');
      return {
        success: false,
        error:
          'Email template not configured. Please set up email templates in the admin panel.',
      };
    }

    const emailHtml = renderTemplate(template.bodyHtml, {
      recipientName,
      senderName,
      heartlinkUrl,
      occasion: formattedOccasion,
    });

    const emailText = renderTemplate(template.bodyText, {
      recipientName,
      senderName,
      heartlinkUrl,
      occasion: formattedOccasion,
    });

    // Render the subject line with template variables
    const emailSubject = renderTemplate(template.subject, {
      recipientName,
      senderName,
      heartlinkUrl,
      occasion: formattedOccasion,
    });

    // Send email using Resend
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: recipientEmail,
      cc: senderEmail ? [senderEmail] : undefined, // CC the sender if email is provided
      subject: emailSubject,
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
 * Fetches an email template from the database by name
 */
async function getEmailTemplate(name: string) {
  try {
    // Type assertion needed until Prisma client is regenerated
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const template = await (prisma as any).emailTemplate.findFirst({
      where: {
        name,
        isActive: true,
      },
    });
    return template;
  } catch (error) {
    console.error('Error fetching email template:', error);
    return null;
  }
}

/**
 * Renders a template string by replacing template variables
 * Supports both ${variable} syntax
 */
function renderTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let rendered = template;

  // Replace ${variable} syntax
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
    rendered = rendered.replace(regex, value);
  });

  // Replace ${new Date().getFullYear()} with actual year
  rendered = rendered.replace(
    /\$\{new Date\(\)\.getFullYear\(\)\}/g,
    new Date().getFullYear().toString()
  );

  return rendered;
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

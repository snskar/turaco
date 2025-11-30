import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Resend } from 'resend';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Check authentication
    const token = (await cookies()).get('admin-auth')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email, slug } = await request.json();

    if (!email || !slug) {
      return NextResponse.json(
        { success: false, message: 'Email and slug are required' },
        { status: 400 }
      );
    }

    const websiteLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/heartlink/${slug}`;

    const emailContent = `This is your website: ${websiteLink}`;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Your Heartlink Gift',
      html: `<p>${emailContent}</p>`,
      text: emailContent,
    });

    if (response.error) {
      console.error('Resend error:', response.error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send email',
          error: response.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailId: response.data?.id,
    });
  } catch (error) {
    console.error('Send email API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

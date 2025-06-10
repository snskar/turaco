import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Generate a unique slug
    const slug = nanoid(10);

    // Create the heartlink with all related data
    const heartlink = await prisma.Heartlink.create({
      data: {
        slug,
        senderName: data.senderName,
        recipientName: data.recipientName,
        occasion: data.occasion,
        relation: data.relation,
        message: data.message,
        
        // Create photos if provided
        photos: data.photos ? {
          create: data.photos.map((url: string) => ({ url }))
        } : undefined,

        // Create Spotify track if provided
        spotifyTrack: data.spotifyTrack ? {
          create: {
            spotifyId: data.spotifyTrack.spotifyId,
            type: data.spotifyTrack.type,
            name: data.spotifyTrack.name,
            artist: data.spotifyTrack.artist,
            imageUrl: data.spotifyTrack.imageUrl,
            previewUrl: data.spotifyTrack.previewUrl,
          }
        } : undefined,

        // Create activities if provided
        activities: data.activities ? {
          create: data.activities.map((activity: { content: string; isCustom: boolean }) => ({
            content: activity.content,
            isCustom: activity.isCustom,
          }))
        } : undefined,

        // Create compliments if provided
        compliments: data.compliments ? {
          create: data.compliments.map((compliment: { content: string; isCustom: boolean }) => ({
            content: compliment.content,
            isCustom: compliment.isCustom,
          }))
        } : undefined,

        // Create scratch card if provided
        scratchCard: data.scratchCard ? {
          create: {
            content: data.scratchCard.content,
            isCustom: data.scratchCard.isCustom,
          }
        } : undefined,
      },
      // Include all related data in the response
      include: {
        photos: true,
        spotifyTrack: true,
        activities: true,
        compliments: true,
        scratchCard: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: heartlink,
      slug: heartlink.slug 
    });

  } catch (error) {
    console.error('Error creating heartlink:', error);
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create heartlink',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    const heartlink = await prisma.Heartlink.findUnique({
      where: { slug },
      include: {
        photos: true,
        spotifyTrack: true,
        activities: true,
        compliments: true,
        scratchCard: true,
      },
    });

    if (!heartlink) {
      return NextResponse.json(
        { success: false, error: 'Heartlink not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: heartlink });

  } catch (error) {
    console.error('Error fetching heartlink:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch heartlink',
        details: errorMessage
      },
      { status: 500 }
    );
  }
} 
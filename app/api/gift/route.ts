import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Generate a unique slug
    const slug = nanoid(10);

    // Create the gift with all related data
    const gift = await prisma.gift.create({
      data: {
        slug,
        gifterName: data.gifterName,
        gifteeName: data.gifteeName,
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
      data: gift,
      slug: gift.slug 
    });

  } catch (error) {
    console.error('Error creating gift:', error);
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create gift',
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

    const gift = await prisma.gift.findUnique({
      where: { slug },
      include: {
        photos: true,
        spotifyTrack: true,
        activities: true,
        compliments: true,
        scratchCard: true,
      },
    });

    if (!gift) {
      return NextResponse.json(
        { success: false, error: 'Gift not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: gift });

  } catch (error) {
    console.error('Error fetching gift:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch gift',
        details: errorMessage
      },
      { status: 500 }
    );
  }
} 
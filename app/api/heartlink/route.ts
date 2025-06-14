import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { z } from 'zod'; // For validation
import { HeartlinkOccasion, HeartlinkRelation } from '@/types/heartlink';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// Define the shape of our form data using Zod
const HeartlinkFormSchema = z.object({
  // Required fields
  senderName: z.string().min(1, "Sender name is required").max(100),
  recipientName: z.string().min(1, "Recipient name is required").max(100),
  occasion: z.enum(["BIRTHDAY", "NEW_YEAR", "DIWALI", "RAKSHA_BANDHAN", "CHRISTMAS", "VALENTINES", "ANNIVERSARY", "CONGRATULATIONS", "GET_WELL_SOON", "I_AM_SORRY", "I_LOVE_YOU", "OTHER"]),
  relation: z.enum(["COUPLE", "FATHER", "MOTHER", "SISTER", "BROTHER", "FRIEND", "OTHER"]),
  message: z.string().min(1, "Message is required").max(1000),
  
  // Optional fields with validation
  photos: z.array(z.string().url("Invalid photo URL")).optional(),
  
  spotifyTrack: z.object({
    spotifyId: z.string(),
    type: z.string(),
    name: z.string(),
    artist: z.string().optional(),
    imageUrl: z.string().url("Invalid image URL").optional(),
    previewUrl: z.string().url("Invalid preview URL").optional(),
  }).optional(),
  
  activities: z.array(z.object({
    content: z.string().min(1),
    isCustom: z.boolean(),
  })).optional(),
  
  compliments: z.array(z.object({
    content: z.string().min(1),
    isCustom: z.boolean(),
  })).optional(),
  
  scratchCard: z.array(z.object({
    content: z.string().min(1),
    isCustom: z.boolean(),
  })).optional(),
});

// Infer the TypeScript type from our schema
type HeartlinkFormData = z.infer<typeof HeartlinkFormSchema>;

// Add CORS headers to response
async function corsResponse(response: NextResponse) {
  const headersList = await headers();
  const origin = headersList.get('origin') || '';
  
  // Verify if the request is coming from your Shopify store
  const allowedOrigins = [
    process.env.SHOPIFY_STORE_URL,
    'https://your-store.myshopify.com'
  ];

  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }
  
  return response;
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return corsResponse(
    new NextResponse(null, {
      status: 204,
    })
  );
}

export async function POST(req: Request) {
  try {
    // Parse and validate the incoming data
    const rawData = await req.json();
    const data = HeartlinkFormSchema.parse(rawData) as HeartlinkFormData;
    
    // Generate a unique slug
    const slug = nanoid(10);

    // Create the heartlink with all related data
    const heartlink = await prisma.heartlink.create({
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
          create: data.activities
        } : undefined,

        // Create compliments if provided
        compliments: data.compliments ? {
          create: data.compliments
        } : undefined,

        // Create scratch cards if provided
        scratchCard: data.scratchCard ? {
          create: data.scratchCard
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

    return corsResponse(
      NextResponse.json({ 
        success: true, 
        data: heartlink,
        slug: heartlink.slug 
      })
    );

  } catch (error: unknown) {
    console.error('Error creating heartlink:', error);
    
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return corsResponse(
        NextResponse.json(
          { 
            success: false, 
            error: 'Validation failed',
            details: error.errors 
          },
          { status: 400 }
        )
      );
    }
    
    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return corsResponse(
      NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create heartlink',
          details: errorMessage
        },
        { status: 500 }
      )
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return corsResponse(
        NextResponse.json(
          { success: false, error: 'Slug is required' },
          { status: 400 }
        )
      );
    }

    const heartlink = await prisma.heartlink.findUnique({
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
      return corsResponse(
        NextResponse.json(
          { success: false, error: 'Heartlink not found' },
          { status: 404 }
        )
      );
    }

    return corsResponse(
      NextResponse.json({ success: true, data: heartlink })
    );

  } catch (error: unknown) {
    console.error('Error fetching heartlink:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return corsResponse(
      NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch heartlink',
          details: errorMessage
        },
        { status: 500 }
      )
    );
  }
} 
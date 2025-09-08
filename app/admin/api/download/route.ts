import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function getFilenameFromUrl(url: string, fallback = 'download') {
  try {
    const { pathname } = new URL(url);
    const base = pathname.split('/').filter(Boolean).pop() || fallback;
    return base;
  } catch {
    return fallback;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const filenameParam = searchParams.get('filename');

  if (!url) {
    return NextResponse.json(
      { error: 'Missing url parameter' },
      { status: 400 }
    );
  }

  try {
    // Fetch the remote asset
    const remote = await fetch(url);
    if (!remote.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch remote file' },
        { status: 502 }
      );
    }

    // Read as ArrayBuffer to set headers and length
    const arrayBuffer = await remote.arrayBuffer();
    const contentType =
      remote.headers.get('content-type') || 'application/octet-stream';
    const contentLength = arrayBuffer.byteLength.toString();

    const suggestedName = filenameParam || getFilenameFromUrl(url);
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Length', contentLength);
    headers.set(
      'Content-Disposition',
      `attachment; filename="${suggestedName}"`
    );
    headers.set('Cache-Control', 'private, max-age=0, must-revalidate');

    return new Response(Buffer.from(arrayBuffer), {
      status: 200,
      headers,
    });
  } catch {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}

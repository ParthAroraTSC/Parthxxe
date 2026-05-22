import { NextResponse } from 'next/server';
import { searchMedia } from '@/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchMedia(query);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 });
  }
}

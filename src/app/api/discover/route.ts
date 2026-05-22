import { NextResponse } from 'next/server';
import { fetchTMDB } from '@/lib/tmdb';

const PLATFORMS = [
  { id: '8', name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { id: '9', name: 'Amazon Prime', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg' },
  { id: '350', name: 'Apple TV+', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg' },
  { id: '337', name: 'Disney+', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const sortBy = searchParams.get('sort_by') || 'popularity.desc';
  const query = searchParams.get('query') || '';
  const genre = searchParams.get('genre') || '';

  try {
    let allMovies: any[] = [];

    if (query) {
      // Search mode: we can't easily filter by platform in /search, so we just return results
      // But we can tag them randomly or omit platform logos for search for now
      const searchData = await fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`);
      const validResults = (searchData?.results || []).filter((m: any) => m.media_type === 'movie' || m.media_type === 'tv');
      
      allMovies = validResults.map((m: any) => ({
        ...m,
        platforms: [PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)]] // Mock platform for search
      }));
    } else {
      // Discover mode: fetch each platform separately to tag them
      const platformParam = searchParams.get('platform');
      const activePlatforms = platformParam ? PLATFORMS.filter(p => p.id === platformParam) : PLATFORMS;
      const lang = searchParams.get('lang');
      
      const fetchPromises = activePlatforms.map(async (platform) => {
        let endpoint = `/discover/movie?sort_by=${sortBy}&page=${page}&with_watch_providers=${platform.id}&watch_region=US`;
        if (genre) endpoint += `&with_genres=${genre}`;
        if (lang) endpoint += `&with_original_language=${lang}`;
        
        const data = await fetchTMDB(endpoint);
        return { platform, results: data?.results || [] };
      });

      const responses = await Promise.all(fetchPromises);

      // Merge and deduplicate
      const movieMap = new Map();
      
      responses.forEach(({ platform, results }) => {
        results.forEach((movie: any) => {
          if (movieMap.has(movie.id)) {
            const existing = movieMap.get(movie.id);
            if (!existing.platforms.find((p: any) => p.id === platform.id)) {
              existing.platforms.push(platform);
            }
          } else {
            movieMap.set(movie.id, { ...movie, platforms: [platform] });
          }
        });
      });

      allMovies = Array.from(movieMap.values());

      // Sort the merged results since they were fetched separately
      if (sortBy === 'popularity.desc') {
        allMovies.sort((a, b) => b.popularity - a.popularity);
      } else if (sortBy === 'primary_release_date.desc') {
        allMovies.sort((a, b) => new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime());
      } else if (sortBy === 'vote_average.desc') {
        allMovies.sort((a, b) => b.vote_average - a.vote_average);
      }
    }

    return NextResponse.json({
      page: parseInt(page),
      results: allMovies
    });

  } catch (error) {
    console.error('Discover API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}

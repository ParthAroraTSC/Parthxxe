import { config } from './config';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
}

export const fetchTMDB = async (endpoint: string) => {
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${config.tmdbBaseUrl}${endpoint}${separator}api_key=${config.tmdbApiKey}&language=en-US`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`TMDB API Error: ${res.status} ${res.statusText} for endpoint ${endpoint}`);
      throw new Error(`Failed to fetch from TMDB: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Network or parsing error in fetchTMDB:', error);
    return null;
  }
};

export const getTrending = async () => {
  const data = await fetchTMDB('/trending/all/day');
  return data?.results || [];
};

export const getMovies = async (platformId?: string) => {
  // If platformId is provided, we use it to filter via with_watch_providers
  let endpoint = '/discover/movie?sort_by=popularity.desc';
  if (platformId) {
    endpoint += `&with_watch_providers=${platformId}&watch_region=US`;
  }
  const data = await fetchTMDB(endpoint);
  return data?.results || [];
};

export const getTopIndiaMovies = async () => {
  const data = await fetchTMDB('/discover/movie?with_origin_country=IN&sort_by=popularity.desc');
  return data?.results || [];
};

export const getShows = async (platformId?: string) => {
  let endpoint = '/discover/tv?sort_by=popularity.desc';
  if (platformId) {
    endpoint += `&with_watch_providers=${platformId}&watch_region=US`;
  }
  const data = await fetchTMDB(endpoint);
  return data?.results || [];
};

export const searchMedia = async (query: string) => {
  try {
    const response = await fetch(`${config.tmdbBaseUrl}/search/multi?api_key=${config.tmdbApiKey}&query=${encodeURIComponent(query)}&include_adult=false`);
    const results = await response.json();
    if (!results.results) return [];
    
    // Filter to only include movies and tv shows
    return results.results.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

export const getDetails = async (id: string, type: 'movie' | 'tv') => {
  let tmdbId = id;
  
  // If the ID is an IMDB ID (e.g. from RapidAPI), we must resolve it to a TMDB ID first
  if (id.startsWith('tt')) {
    const findData = await fetchTMDB(`/find/${id}?external_source=imdb_id`);
    if (findData?.movie_results?.length > 0) {
      tmdbId = findData.movie_results[0].id;
    } else if (findData?.tv_results?.length > 0) {
      tmdbId = findData.tv_results[0].id;
    } else {
      return null;
    }
  }

  const data = await fetchTMDB(`/${type}/${tmdbId}?append_to_response=videos,credits,similar`);
  return data;
};

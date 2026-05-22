import { fetchTMDB } from './src/lib/tmdb';

async function test() {
  const data = await fetchTMDB('/discover/movie?sort_by=popularity.desc&page=1&with_watch_providers=8&watch_region=US');
  if (data?.results?.length > 0) {
    console.log("First movie ID:", data.results[0].id);
  } else {
    console.log("No results:", data);
  }
}

test();

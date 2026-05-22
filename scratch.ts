import { config } from './src/lib/config';

async function test() {
  console.log("URL:", `${config.tmdbBaseUrl}/movie/550?api_key=${config.tmdbApiKey}&language=en-US`);
  const res = await fetch(`${config.tmdbBaseUrl}/movie/550?append_to_response=videos,credits,similar&api_key=${config.tmdbApiKey}&language=en-US`);
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Data ID:", data.id, "Title:", data.title);
}

test();

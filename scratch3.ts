import { getDetails } from './src/lib/tmdb';

async function test() {
  const data = await getDetails('550', 'movie');
  console.log("Result:", data ? "Success" : "Null", data?.title);
}

test();

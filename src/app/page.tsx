import Hero from "@/components/Hero";
import Row from "@/components/Row";
import ContinueWatching from "@/components/ContinueWatching";
import InfiniteGrid from "@/components/InfiniteGrid";
import { getTrending, getMovies, getTopIndiaMovies } from "@/lib/tmdb";
import { getUpcomingTitles } from "@/lib/rapidapi";

export default async function Home() {
  const [trending, netflix, prime, apple, disney, topIndia, upcomingRaw] = await Promise.all([
    getTrending(),
    getMovies('8'), // Netflix
    getMovies('9'), // Amazon Prime Video
    getMovies('350'), // Apple TV+
    getMovies('337'), // Disney+
    getTopIndiaMovies(),
    getUpcomingTitles()
  ]);

  const featured = trending[0];

  // Map RapidAPI output to match TMDB Movie interface so MovieCard works
  const upcoming = upcomingRaw.slice(0, 10).map((item: any) => ({
    id: item.id,
    title: item.titleText?.text || "Unknown",
    overview: "Upcoming title...",
    poster_path: item.primaryImage?.url ? item.primaryImage.url.replace('https://image.tmdb.org/t/p/w500', '') : "", 
    backdrop_path: "",
    vote_average: 0,
    media_type: "movie"
  }));

  // Fix poster_path for RapidAPI to not duplicate URL if using config base in MovieCard
  const normalizedUpcoming = upcoming.map((m: any) => {
    if (m.poster_path.startsWith('http')) {
       // if it's full url we might need to handle it in MovieCard, or just let it pass
       // We'll leave it as is, but Next image might complain without hostname in config
    }
    return m;
  });

  return (
    <div className="min-h-screen bg-black">
      <Hero movies={trending} />
      
      {/* Mobile & Tablet View: Netflix-style horizontal rows */}
      <div className="relative z-20 pb-20 -mt-20 md:-mt-32 lg:hidden">
        <ContinueWatching />
        
        <Row title="Trending Now" movies={trending} />
        <Row title="Netflix Originals" movies={netflix} />
        <Row title="Top 10 in India" movies={topIndia} />
        <Row title="Upcoming Releases" movies={normalizedUpcoming} />
        <Row title="Amazon Prime Video" movies={prime} />
        <Row title="Apple TV+ Exclusives" movies={apple} />
        <Row title="Disney+ Hits" movies={disney} />
      </div>

      {/* Desktop View: Original Infinite Grid */}
      <div className="relative z-20 hidden lg:block -mt-10 lg:-mt-20">
        <ContinueWatching />
        <div className="mt-8">
          <InfiniteGrid />
        </div>
      </div>
    </div>
  );
}

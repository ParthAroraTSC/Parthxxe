import { getDetails } from "@/lib/tmdb";
import { config } from "@/lib/config";
import ServerSelect from "./ServerSelect";

export default async function MoviePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const movie = await getDetails(id, "movie");

  // Fallback values if TMDB is blocked, rate-limited, or fails to fetch
  const title = movie?.title || movie?.name || "Unknown Movie";
  const overview = movie?.overview || "Movie details are currently unavailable. You can still watch the movie below.";

  return (
    <div className="pt-24 pb-12 px-4 md:px-12 min-h-screen bg-[#141414]">
      <div className="w-full max-w-screen-2xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-[#181818] border border-white/10">
        <ServerSelect 
          id={id} 
          type="movie" 
          apiKey={config.vidSrcApiKey} 
          item={movie ? { ...movie, media_type: "movie" } : { id, title, media_type: "movie" }} 
        />
      </div>
    </div>
  );
}

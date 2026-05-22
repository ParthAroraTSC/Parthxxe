import { getDetails } from "@/lib/tmdb";
import { config } from "@/lib/config";
import ServerSelect from "../../movie/[id]/ServerSelect";

export default async function TVPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const show = await getDetails(id, "tv");

  // Fallback values if TMDB is blocked, rate-limited, or fails to fetch
  const name = show?.name || show?.title || "Unknown TV Show";
  const overview = show?.overview || "TV Show details are currently unavailable. You can still watch the show below.";

  return (
    <div className="pt-24 pb-12 px-4 md:px-12 min-h-screen bg-[#141414]">
      <div className="w-full max-w-screen-2xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-[#181818] border border-white/10">
        <ServerSelect 
          id={id} 
          type="tv" 
          apiKey={config.vidSrcApiKey} 
          item={show ? { ...show, media_type: "tv" } : { id, name, media_type: "tv" }} 
        />
      </div>
    </div>
  );
}

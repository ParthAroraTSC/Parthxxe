"use client";

import { useState, useEffect } from "react";
import { Play, Plus, ThumbsUp } from "lucide-react";
import { config } from "@/lib/config";

const SERVERS = [
  { id: "vidsrc", name: "VidSrc VIP" },
  { id: "multiembed", name: "MultiEmbed" },
  { id: "videasy", name: "VidEasy" },
  { id: "autoembed", name: "AutoEmbed" },
  { id: "2embed", name: "2Embed" },
  { id: "vidrock", name: "VidRock" },
  { id: "superflix", name: "SuperFlix" },
  { id: "mux", name: "Mux Streams" }
];
import { useHistoryStore } from "@/lib/store";

export default function ServerSelect({ id, type, apiKey, item }: { id: string; type: "movie" | "tv"; apiKey: string; item?: any }) {
  const [server, setServer] = useState(SERVERS[0].id);
  const [season, setSeason] = useState("1");
  const [episode, setEpisode] = useState("1");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFindingFastest, setIsFindingFastest] = useState(false);
  const [autoLoadAttempted, setAutoLoadAttempted] = useState(false);
  const updateProgress = useHistoryStore((state) => state.updateProgress);

  // Load Balancer functionality
  const findFastestServer = async () => {
    if (isFindingFastest) return;
    setIsFindingFastest(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      if (data.success && data.fastest) {
        setServer(data.fastest.id);
      }
    } catch (err) {
      console.error("Health check failed", err);
    } finally {
      setIsFindingFastest(false);
    }
  };

  // Run Load Balancer on Mount
  useEffect(() => {
    if (!autoLoadAttempted) {
      setAutoLoadAttempted(true);
      findFastestServer();
    }
  }, [autoLoadAttempted]);

  useEffect(() => {
    if (!item || !isPlaying) return;
    
    // Simulate progress starting at a random spot or 5%, and increasing while on the page
    // This simulates "watching" since we can't read iframe internal player state.
    let progress = Math.floor(Math.random() * 30) + 5; // Start somewhere between 5-35%
    updateProgress(item, progress);
    
    const interval = setInterval(() => {
      progress += 1;
      if (progress > 95) progress = 95;
      updateProgress(item, progress);
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [item, isPlaying, updateProgress]);

  const getEmbedUrl = () => {
    switch (server) {
      case "vidsrc":
        return type === "movie" 
          ? `https://vidsrc.icu/embed/movie/${id}?api_key=${apiKey}`
          : `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}?api_key=${apiKey}`;
      case "multiembed":
        return type === "movie"
          ? `https://multiembed.mov/directstream.php?video_id=${id}`
          : `https://multiembed.mov/directstream.php?video_id=${id}&s=${season}&e=${episode}`;
      case "videasy":
        return type === "movie"
          ? `https://player.videasy.net/movie/${id}?color=E50914`
          : `https://player.videasy.net/tv/${id}/${season}/${episode}?color=E50914`;
      case "autoembed":
        return type === "movie"
          ? `https://player.autoembed.cc/embed/movie/${id}`
          : `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`;
      case "2embed":
        return type === "movie"
          ? `https://www.2embed.cc/embed/${id}`
          : `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`;
      case "vidrock":
        return type === "movie"
          ? `https://vidrock.net/movie/${id}`
          : `https://vidrock.net/tv/${id}/${season}/${episode}`;
      case "superflix":
        return type === "movie"
          ? `https://superflixapi.buzz/filme/${id}`
          : `https://superflixapi.buzz/serie/${id}/${season}/${episode}`;
      case "mux":
        return `https://stream.mux.com/${id}.m3u8`;
      default:
        return "";
    }
  };

  if (!isPlaying) {
    const backdropUrl = item?.backdrop_path 
      ? `${config.imageBaseUrl}${item.backdrop_path}` 
      : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop";

    const posterUrl = item?.poster_path 
      ? `${config.posterBaseUrl}${item.poster_path}` 
      : "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=500&auto=format&fit=crop";

    const title = item?.title || item?.name || "Unknown Title";
    const overview = item?.overview || "Details unavailable.";
    const matchScore = item?.vote_average ? Math.round(item.vote_average * 10) : 80;
    const year = (item?.release_date || item?.first_air_date || "").substring(0, 4);
    const duration = type === "tv" 
      ? `${item?.number_of_seasons || 1} Seasons` 
      : `${item?.runtime || 120}m`;
    const rating = item?.adult ? "A" : "U/A 16+";
    
    const cast = item?.credits?.cast?.slice(0, 4).map((c: any) => c.name).join(", ") || "Unknown Cast";
    const genres = item?.genres?.map((g: any) => g.name).join(", ") || "Unknown Genres";

    return (
      <div className="w-full flex flex-col text-white pb-8">
        {/* Top Image Section */}
        <div className="relative w-full aspect-video md:aspect-[2.35/1] bg-zinc-900 overflow-hidden">
          <img 
            src={backdropUrl} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#181818]/90 via-transparent to-transparent" />
          
          {/* Controls Overlay */}
          <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 flex flex-col items-start gap-4 z-10 w-full md:w-2/3 pr-6">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter drop-shadow-2xl uppercase">
              {title}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <button 
                onClick={() => setIsPlaying(true)}
                className="flex items-center justify-center gap-2 bg-white hover:bg-white/80 text-black px-6 md:px-8 py-2 md:py-2.5 rounded font-bold text-lg md:text-xl transition-all shadow-lg hover:scale-105"
              >
                <Play fill="currentColor" className="w-6 h-6 md:w-8 md:h-8" /> Play
              </button>
              <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/50 flex items-center justify-center text-white bg-black/40 hover:border-white transition-all backdrop-blur-sm">
                <Plus className="w-6 h-6" />
              </button>
              <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/50 flex items-center justify-center text-white bg-black/40 hover:border-white transition-all backdrop-blur-sm">
                <ThumbsUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Details Section with Thumbnail */}
        <div className="px-6 md:px-12 py-6 md:py-8 flex flex-col md:flex-row gap-8 md:gap-12 relative">
          
          <div className="flex-[2] flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 text-[15px] font-medium">
              <span className="text-[#46d369] font-bold">{matchScore}% match</span>
              <span>{year}</span>
              <span>{duration}</span>
              <span className="border border-white/40 px-1.5 rounded-sm text-xs text-white/90">HD</span>
            </div>
            <div className="flex items-center gap-2 text-[15px]">
              <span className="border border-white/40 px-1.5 py-0.5 rounded-sm text-xs text-white/90">{rating}</span>
              <span className="text-white/80 text-sm">Action, Thriller, Suspenseful</span>
            </div>
            <p className="text-white/90 text-sm md:text-[17px] leading-relaxed mt-2">
              {overview}
            </p>
          </div>
          
          <div className="flex-1 flex flex-col gap-3 text-[14px]">
            <div className="leading-snug">
              <span className="text-[#777]">Cast:</span> <span className="text-white/90">{cast}</span>
            </div>
            <div className="leading-snug">
              <span className="text-[#777]">Genres:</span> <span className="text-white/90">{genres}</span>
            </div>
            <div className="leading-snug">
              <span className="text-[#777]">This {type === "tv" ? "show" : "movie"} is:</span> <span className="text-white/90">Exciting, Suspenseful</span>
            </div>
          </div>

          {/* Thumbnail Container */}
          <div className="hidden md:block w-48 shrink-0 rounded-lg overflow-hidden shadow-2xl border border-white/10 -mt-32 relative z-20 bg-zinc-800 xl:ml-8 self-start aspect-[2/3]">
            <img 
              src={posterUrl} 
              alt={`${title} Thumbnail`} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap gap-2 p-2 bg-zinc-800">
        <button
          onClick={findFastestServer}
          disabled={isFindingFastest}
          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${
            isFindingFastest ? "bg-zinc-600 text-zinc-400 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg hover:scale-105"
          }`}
          title="Automatically find the fastest working server"
        >
          {isFindingFastest ? (
            <>
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Auto-Select Best
            </>
          )}
        </button>

        <div className="w-px h-6 bg-zinc-600 mx-1 self-center" />

        {SERVERS.map((s) => (
          <button
            key={s.id}
            onClick={() => setServer(s.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              server === s.id ? "bg-red-600 text-white" : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
            }`}
          >
            {s.name}
          </button>
        ))}
        {type === "tv" && item?.seasons && (
          <div className="flex gap-3 ml-auto items-center mr-2">
            <div className="relative">
              <select 
                value={season} 
                onChange={(e) => {
                  setSeason(e.target.value);
                  setEpisode("1"); // Reset episode when season changes
                }} 
                className="appearance-none bg-[#181818] border border-zinc-700 text-white text-sm rounded-md pl-4 pr-8 py-1.5 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all cursor-pointer font-medium shadow-sm hover:border-zinc-500"
                title="Select Season"
              >
                {item.seasons
                  .filter((s: any) => s.season_number > 0) // Filter out specials if desired, or keep them
                  .map((s: any) => (
                    <option key={s.id} value={s.season_number}>
                      {s.name || `Season ${s.season_number}`}
                    </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

            <div className="relative">
              <select 
                value={episode} 
                onChange={(e) => setEpisode(e.target.value)} 
                className="appearance-none bg-[#181818] border border-zinc-700 text-white text-sm rounded-md pl-4 pr-8 py-1.5 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all cursor-pointer font-medium shadow-sm hover:border-zinc-500"
                title="Select Episode"
              >
                {Array.from(
                  { length: item.seasons.find((s: any) => s.season_number === Number(season))?.episode_count || 1 }, 
                  (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Episode {i + 1}
                    </option>
                  )
                )}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        )}
      </div>
      <iframe
        src={getEmbedUrl()}
        className="w-full h-full min-h-[50vh] flex-1 border-none"
        allowFullScreen
        title="Video Player"
      />
    </div>
  );
}

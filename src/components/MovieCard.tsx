"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Check } from "lucide-react";
import { Movie } from "@/lib/tmdb";
import { config } from "@/lib/config";
import { useWatchlistStore } from "@/lib/store";

export default function MovieCard({ movie }: { movie: Movie }) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();
  const inWatchlist = isInWatchlist(movie.id);

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const isMovie = movie.media_type === "movie" || !movie.first_air_date;
  const linkHref = `/${isMovie ? "movie" : "tv"}/${movie.id}`;
  
  const posterUrl = movie.poster_path 
    ? `${config.posterBaseUrl}${movie.poster_path}` 
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <Link href={linkHref} className="group relative block w-full aspect-[2/3] rounded-md overflow-hidden bg-zinc-900 transition-transform duration-300 hover:scale-105 hover:z-10 focus:z-10">
      <Image
        src={posterUrl}
        alt={movie.title || movie.name || "Movie poster"}
        fill
        className="object-cover transition-opacity duration-300 group-hover:opacity-75"
        sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 mb-2">
          {movie.title || movie.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-500 font-semibold text-xs">
            {Math.round(movie.vote_average * 10)}% Match
          </span>
          <span className="text-gray-300 border border-gray-600 px-1 text-[10px] uppercase">
            {movie.media_type || (isMovie ? 'Movie' : 'TV')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-white text-black p-1.5 rounded-full hover:bg-white/80 transition">
            <Play fill="currentColor" className="w-4 h-4" />
          </button>
          <button 
            onClick={toggleWatchlist}
            className="border-2 border-gray-500 bg-black/50 text-white p-1.5 rounded-full hover:border-white transition"
          >
            {inWatchlist ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}

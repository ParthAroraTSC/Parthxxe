"use client";

import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/lib/tmdb";
import { config } from "@/lib/config";

export default function StoryRow({ movies, title }: { movies: Movie[], title: string }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="py-8 px-4 md:px-12 relative z-20">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">{title}</h2>
      
      <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {movies.map((movie) => {
          const isMovie = movie.media_type === "movie" || !movie.first_air_date;
          const linkHref = `/${isMovie ? "movie" : "tv"}/${movie.id}`;
          const posterUrl = movie.poster_path 
            ? `${config.posterBaseUrl}${movie.poster_path}` 
            : "https://via.placeholder.com/150?text=No+Image";

          return (
            <Link 
              href={linkHref} 
              key={movie.id} 
              className="group flex flex-col items-center gap-3 min-w-[80px] md:min-w-[100px] snap-start"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-red-600 transition-all duration-300 shadow-lg relative p-0.5 bg-gradient-to-tr from-red-600 to-purple-600">
                <div className="w-full h-full rounded-full overflow-hidden bg-black relative">
                  <Image
                    src={posterUrl}
                    alt={movie.title || movie.name || "Movie Icon"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="96px"
                  />
                </div>
              </div>
              <span className="text-gray-300 text-xs md:text-sm font-medium text-center line-clamp-1 group-hover:text-white transition-colors w-full px-1">
                {movie.title || movie.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

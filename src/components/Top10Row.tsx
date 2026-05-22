"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/lib/tmdb";
import { config } from "@/lib/config";

export default function Top10Row({ title, movies }: { title: string; movies: Movie[] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!movies || movies.length === 0) return null;

  const top10 = movies.slice(0, 10);

  return (
    <div className="py-8 relative group z-30">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 px-4 md:px-12">{title}</h2>
      
      <div className="relative">
        <button 
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-0 bottom-0 w-12 z-40 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/80"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <div 
          ref={rowRef}
          className="flex overflow-x-auto scrollbar-hide px-4 md:px-12 pb-12 pt-4 snap-x relative items-end"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {top10.map((movie, index) => {
            const isMovie = movie.media_type === "movie" || !movie.first_air_date;
            const linkHref = `/${isMovie ? "movie" : "tv"}/${movie.id}`;
            const posterUrl = movie.poster_path 
              ? `${config.posterBaseUrl}${movie.poster_path}` 
              : "https://via.placeholder.com/500x750?text=No+Image";

            return (
              <div key={movie.id} className="relative w-[220px] md:w-[350px] h-[210px] md:h-[330px] flex items-end justify-end snap-start shrink-0 pr-2 md:pr-6 group/card">
                
                {/* Giant Outlined Number */}
                <span 
                  className="absolute -left-4 md:-left-6 -bottom-4 md:-bottom-6 p-4 md:p-6 block text-[215px] md:text-[335px] font-black leading-none z-10 select-none tracking-tighter"
                  style={{
                    WebkitTextStroke: "4px #595959",
                    color: "black",
                    fontFamily: "Arial, sans-serif"
                  }}
                >
                  {index + 1}
                </span>

                {/* Movie Poster */}
                <Link 
                  href={linkHref} 
                  className="relative z-20 w-[140px] md:w-[220px] aspect-[2/3] rounded-md overflow-hidden bg-zinc-900 transition-transform duration-300 group-hover/card:scale-105 group-hover/card:-translate-y-2 group-hover/card:z-30 shadow-2xl"
                >
                  <Image
                    src={posterUrl}
                    alt={movie.title || movie.name || "Movie poster"}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="(max-width: 768px) 140px, 220px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white font-bold text-xs line-clamp-2">
                      {movie.title || movie.name}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-0 bottom-0 w-12 z-40 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/80"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
}

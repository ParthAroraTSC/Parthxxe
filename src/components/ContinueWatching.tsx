"use client";

import { useHistoryStore } from "@/lib/store";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { config } from "@/lib/config";

export default function ContinueWatching() {
  const { history, removeFromHistory } = useHistoryStore();

  if (!history || history.length === 0) return null;

  // Only take the most recent movie
  const item = history[0];
  const { movie, progress } = item;

  // Use poster for portrait mode
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
    
  const type = movie.media_type === 'tv' ? 'tv' : 'movie';
  const link = `/${type}/${movie.id}`;

  return (
    <div className="relative z-20 container mx-auto px-4 pt-12 pb-6 mb-4 flex flex-col items-center">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 w-full text-center">Continue Watching</h2>
      
      <div className="relative w-40 sm:w-48 md:w-56 lg:w-64 group rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 shadow-2xl transition-all duration-300 hover:shadow-red-900/20 hover:-translate-y-1">
        <Link href={link} className="block relative w-full aspect-[2/3] overflow-hidden bg-zinc-900">
          <img 
            src={imageUrl} 
            alt={movie.title || movie.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Overlay with Play Button for Resume */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600/90 backdrop-blur-md flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform mb-2">
              <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-1 fill-current" />
            </div>
            <span className="text-white font-bold text-xs sm:text-sm tracking-wider drop-shadow-md uppercase">Resume</span>
          </div>
        </Link>
        
        {/* Info & Progress placed below the image for better readability */}
        <div className="p-3 sm:p-4">
          <h3 className="text-sm sm:text-base font-bold text-white truncate mb-2" title={movie.title || movie.name}>
            {movie.title || movie.name}
          </h3>
          
          {/* Progress Bar */}
          <div className="w-full h-1.5 sm:h-2 bg-gray-800 rounded-full overflow-hidden mb-1.5">
            <div 
              className="h-full bg-red-600 rounded-full relative shadow-[0_0_10px_rgba(220,38,38,0.8)]" 
              style={{ width: `${Math.max(5, progress)}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]" />
            </div>
          </div>
          
          <div className="flex justify-between items-center text-[10px] sm:text-xs font-medium text-gray-400">
            <span>{Math.round(progress)}% Watched</span>
          </div>
        </div>
        
        {/* Remove Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            removeFromHistory(movie.id);
          }}
          className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full p-2 z-10 shadow-lg"
          aria-label="Remove from history"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}

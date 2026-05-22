"use client";

import { useWatchlistStore } from "@/lib/store";
import MovieCard from "@/components/MovieCard";

export default function WatchlistPage() {
  const { watchlist } = useWatchlistStore();

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen bg-black">
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-white">My List</h1>
      
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-12">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center pt-20">
          <p className="text-gray-400 text-lg">You haven't added anything to your list yet.</p>
        </div>
      )}
    </div>
  );
}

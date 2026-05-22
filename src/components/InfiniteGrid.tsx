"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MonitorPlay, Clapperboard, Flame, FilterX, ChevronDown } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  logo: string;
}

interface MovieWithPlatforms {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  platforms: Platform[];
  media_type?: string;
}

export default function InfiniteGrid({ defaultPlatform }: { defaultPlatform?: string }) {
  const [movies, setMovies] = useState<MovieWithPlatforms[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  
  // Filters
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState(defaultPlatform || "");
  
  const searchParams = useSearchParams();
  const lang = searchParams?.get('lang') || "";

  const observerTarget = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const fetchMovies = useCallback(async (pageNum: number, isNewSearch = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    
    try {
      const url = `/api/discover?page=${pageNum}&sort_by=${sortBy}&query=${encodeURIComponent(activeQuery)}&genre=${genre}&platform=${platform}&lang=${lang}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (!data.results || data.results.length === 0) {
        setHasMore(false);
        if (isNewSearch) setMovies([]);
      } else {
        setMovies(prev => isNewSearch ? data.results : [...prev, ...data.results]);
        // If we got fewer than 20 results, we're probably at the end
        setHasMore(data.results.length >= 10);
      }
    } catch (err) {
      console.error("Failed to fetch movies", err);
      setHasMore(false);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [sortBy, activeQuery, genre, platform, lang]);

  // Initial fetch and filter changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchMovies(1, true);
  }, [fetchMovies]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          setPage((prev) => {
            const next = prev + 1;
            fetchMovies(next, false);
            return next;
          });
        }
      },
      { rootMargin: "400px", threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, fetchMovies]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchInput);
  };

  return (
    <div className="w-full px-4 md:px-8 xl:px-12 py-8 relative z-20">
      
      {/* Horizontal Header: Search, Filters, Sorting */}
      {!defaultPlatform && (
        <div className="flex flex-col xl:flex-row justify-between items-center gap-4 mb-8 bg-black/60 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-white/10 shadow-2xl">
          
          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="relative group">
              <MonitorPlay className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-white transition-colors pointer-events-none" />
              <select 
                value={platform} 
                onChange={(e) => setPlatform(e.target.value)}
                className="bg-zinc-900 text-white text-sm rounded-xl pl-9 pr-8 py-2.5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-600 transition-shadow cursor-pointer appearance-none min-w-[140px]"
              >
                <option value="">All Platforms</option>
                <option value="8">Netflix</option>
                <option value="9">Amazon Prime</option>
                <option value="350">Apple TV+</option>
                <option value="337">Disney+</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative group">
              <Clapperboard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-white transition-colors pointer-events-none" />
              <select 
                value={genre} 
                onChange={(e) => setGenre(e.target.value)}
                className="bg-zinc-900 text-white text-sm rounded-xl pl-9 pr-8 py-2.5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-600 transition-shadow cursor-pointer appearance-none min-w-[130px]"
              >
                <option value="">All Genres</option>
                <option value="28">Action</option>
                <option value="35">Comedy</option>
                <option value="18">Drama</option>
                <option value="878">Sci-Fi</option>
                <option value="27">Horror</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative group">
              <Flame className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-white transition-colors pointer-events-none" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zinc-900 text-white text-sm rounded-xl pl-9 pr-8 py-2.5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-600 transition-shadow cursor-pointer appearance-none min-w-[150px]"
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="primary_release_date.desc">Newest Releases</option>
                <option value="vote_average.desc">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <button 
              onClick={() => {
                setSearchInput("");
                setActiveQuery("");
                setSortBy("popularity.desc");
                setGenre("");
                setPlatform("");
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap"
            >
              <FilterX className="w-4 h-4" />
              Clear Filters
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full xl:w-72 mt-2 xl:mt-0">
            <input
              type="text"
              placeholder="Search the universe..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-zinc-900 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder-gray-500"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
            </button>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {movies.map((movie, idx) => {
          const type = movie.media_type || 'movie';
          const link = `/${type}/${movie.id}`;
          const poster = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image";

          return (
            <Link href={link} key={`${movie.id}-${idx}`} className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-zinc-900 border border-white/5 shadow-lg">
              <img 
                src={poster} 
                alt={movie.title || movie.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white font-bold text-sm sm:text-base line-clamp-2 mb-3 drop-shadow-lg">
                    {movie.title || movie.name}
                  </h3>
                  
                  {/* Platform Logos */}
                  <div className="flex flex-wrap gap-2 items-center">
                    {movie.platforms?.map((p, i) => (
                      <img 
                        key={`${p.id}-${i}`} 
                        src={p.logo} 
                        alt={p.name} 
                        className={`h-4 sm:h-5 w-auto object-contain bg-black/60 border border-white/10 rounded backdrop-blur-sm p-0.5 ${p.name === 'Apple TV+' || p.name === 'Disney+' ? 'brightness-0 invert' : ''}`}
                        title={p.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Loading & Observer Target & Load More */}
      <div ref={observerTarget} className="w-full h-32 flex flex-col items-center justify-center mt-8">
        {loading ? (
          <div className="flex flex-col items-center gap-3 transition-opacity duration-300">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-400">Loading more movies...</span>
          </div>
        ) : hasMore && movies.length > 0 ? (
          <button 
            onClick={() => {
              const next = page + 1;
              setPage(next);
              fetchMovies(next, false);
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          >
            Load More
          </button>
        ) : !hasMore && movies.length > 0 && (
          <span className="text-sm font-medium text-gray-500">You've reached the end.</span>
        )}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/lib/tmdb";
import { config } from "@/lib/config";
import { useState, useEffect } from "react";

export default function Hero({ movies }: { movies: Movie[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 8000);
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) {
    return <div className="h-[80vh] bg-zinc-900 animate-pulse" />;
  }

  const carouselMovies = movies.slice(0, 5);
  const activeMovie = carouselMovies[currentIndex];
  
  const isMovie = activeMovie.media_type === "movie" || !activeMovie.first_air_date;
  const linkHref = `/${isMovie ? "movie" : "tv"}/${activeMovie.id}`;
  
  const backdropUrl = activeMovie.backdrop_path 
    ? `${config.imageBaseUrl}${activeMovie.backdrop_path}` 
    : "https://via.placeholder.com/1920x1080?text=No+Image";

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? carouselMovies.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselMovies.length);
  };

  return (
    <div className="relative h-[80vh] md:h-[95vh] w-full overflow-hidden bg-black">
      {/* Background Image Carousel */}
      {carouselMovies.map((movie, index) => (
        <div 
          key={movie.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        >
          <Image
            src={movie.backdrop_path ? `${config.imageBaseUrl}${movie.backdrop_path}` : backdropUrl}
            alt={movie.title || movie.name || "Hero Banner"}
            fill
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}
      
      {/* Gradients to blend with page content */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-black/20 z-10" />

      {/* Carousel Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition-all hidden md:block"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition-all hidden md:block"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Movie Details Content */}
      <div className="absolute bottom-[15%] md:bottom-[20%] left-4 md:left-24 max-w-2xl z-20 transition-all duration-700 transform translate-y-0 opacity-100">
        <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 shadow-lg">
          Featured
        </span>
        <h1 className="text-4xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl leading-tight">
          {activeMovie.title || activeMovie.name}
        </h1>
        <p className="text-gray-200 text-sm md:text-xl mb-8 line-clamp-3 md:line-clamp-4 text-shadow-lg font-medium">
          {activeMovie.overview}
        </p>
        
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
          <Link 
            href={linkHref}
            className="flex items-center justify-center gap-2 sm:gap-3 bg-white text-black px-5 sm:px-8 py-2 sm:py-3.5 rounded-full font-bold text-sm sm:text-lg hover:scale-105 transition-transform shadow-xl whitespace-nowrap"
          >
            <Play fill="currentColor" className="w-4 h-4 sm:w-6 sm:h-6 shrink-0" />
            Watch Now
          </Link>
        </div>

        {/* Carousel Indicators */}
        <div className="flex items-center gap-2 mt-12">
          {carouselMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-red-600" : "w-4 bg-white/40 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const mediaOnly = data.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
          setResults(mediaOnly.slice(0, 5)); // Limit to 5 results for autocomplete dropdown
        }
      } catch (err) {
        console.error("Search fetch error", err);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleResultClick = (id: number, mediaType: string) => {
    setShowDropdown(false);
    setSearchQuery("");
    router.push(`/${mediaType === 'tv' ? 'tv' : 'movie'}/${id}`);
  };

  return (
    <header className="bg-transparent w-full z-50 absolute top-0">
      <div className="w-full px-3 sm:px-4 md:px-8 xl:px-12 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Side: Logo (Hidden on iPad because it's in the Sidebar, visible on Desktop) */}
        <div className="flex shrink-0 md:hidden lg:flex">
          <Link href="/" className="text-red-600 font-black text-xl sm:text-3xl tracking-tighter hover:opacity-90 transition-opacity drop-shadow-md">
            PIXELMOVIIES
          </Link>
        </div>

        {/* Middle: Platform Logos & Dropdown */}
        <div className="hidden lg:flex justify-center items-center gap-6 lg:gap-14 grow">
          <Link href="/platform/netflix" className="hover:scale-110 transition-transform flex items-center justify-center" aria-label="Netflix">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" 
              alt="Netflix" 
              className="h-8 lg:h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" 
            />
          </Link>
          <Link href="/platform/prime" className="hover:scale-110 transition-transform flex items-center justify-center" aria-label="Amazon Prime">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg" 
              alt="Amazon Prime" 
              className="h-6 lg:h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]" 
            />
          </Link>
          <Link href="/platform/apple" className="hover:scale-110 transition-transform flex items-center justify-center" aria-label="Apple TV+">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg" 
              alt="Apple TV+" 
              className="h-8 lg:h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity brightness-0 invert" 
            />
          </Link>
          <Link href="/platform/disney" className="hover:scale-110 transition-transform flex items-center justify-center" aria-label="Disney+">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" 
              alt="Disney+" 
              className="h-10 lg:h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity brightness-0 invert" 
            />
          </Link>
          {/* Genre Dropdown */}
          <div className="relative group z-50">
            <button className="text-gray-200 font-medium hover:text-white transition-colors flex items-center gap-1.5 text-sm md:text-base">
              Genre <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-transform group-hover:rotate-180 duration-300" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-36 bg-[#181818] border border-white/10 rounded shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden flex flex-col">
              <Link href="/?lang=en" className="px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5">
                Hollywood
              </Link>
              <Link href="/?lang=hi" className="px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                Bollywood
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Search, Login, Register */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Small Search */}
          <div className="relative" ref={dropdownRef}>
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="bg-black/40 text-white text-xs sm:text-sm rounded-full pl-7 sm:pl-8 pr-2 py-1.5 w-24 sm:w-48 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all border border-white/20 backdrop-blur-md placeholder-gray-400"
                aria-label="Search movies"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
            </form>
            
            {/* Autocomplete Dropdown */}
            {showDropdown && results.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-[#111]/95 backdrop-blur-xl border border-white/10 rounded-md shadow-2xl z-50 overflow-hidden">
                {results.map((result) => {
                  const posterUrl = result.poster_path 
                    ? `https://image.tmdb.org/t/p/w92${result.poster_path}` 
                    : "https://via.placeholder.com/92x138?text=No+Image";
                  const title = result.title || result.name;
                  const year = (result.release_date || result.first_air_date || "").substring(0, 4);

                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.id, result.media_type)}
                      className="w-full text-left flex items-center gap-3 p-2 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                    >
                      <img src={posterUrl} alt={title} className="w-8 h-12 object-cover rounded" />
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium line-clamp-1">{title}</span>
                        <span className="text-gray-400 text-xs mt-0.5">{year} • {result.media_type === 'tv' ? 'TV Show' : 'Movie'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Static Login & Register */}
          <div className="flex items-center gap-3 text-sm font-medium">
            <Link href="#" className="text-gray-300 hover:text-white transition-colors hidden sm:block">
              Login
            </Link>
            <Link href="#" className="bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-sm px-3 sm:px-4 py-1.5 rounded-full transition-colors shadow-lg shadow-red-600/20 whitespace-nowrap">
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white ml-2 p-1 hover:text-red-600 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
      </div>

      {/* Fullscreen Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#111]/98 flex flex-col items-center justify-center gap-6 backdrop-blur-xl md:hidden">
          <button 
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors p-2"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close mobile menu"
          >
            <X className="w-8 h-8" />
          </button>

          <span className="text-sm font-black tracking-widest text-red-600 mb-2">GENRES</span>
          <Link href="/?lang=en" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-bold text-white hover:text-red-600 transition-colors">Hollywood</Link>
          <Link href="/?lang=hi" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-bold text-white hover:text-red-600 transition-colors">Bollywood</Link>
          
          <div className="w-16 h-[1px] bg-white/10 my-4" />
          
          <span className="text-sm font-black tracking-widest text-red-600 mb-2">PLATFORMS</span>
          <Link href="/platform/netflix" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-300 hover:text-white transition-colors">Netflix</Link>
          <Link href="/platform/prime" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-300 hover:text-white transition-colors">Prime Video</Link>
          <Link href="/platform/apple" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-300 hover:text-white transition-colors">Apple TV+</Link>
          <Link href="/platform/disney" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-300 hover:text-white transition-colors">Disney+</Link>
        </div>
      )}
    </header>
  );
}

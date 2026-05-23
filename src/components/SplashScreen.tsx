"use client";

import { useState, useEffect } from "react";
import NetflixIntro from "./NetflixIntro";

export default function SplashScreen() {
  const [state, setState] = useState<'waiting' | 'playing' | 'done'>('waiting');

  useEffect(() => {
    if (state !== 'playing') return;

    const audio = new Audio('/nouveau-jingle-netflix.mp3');
    audio.volume = 1.0;

    const timer = setTimeout(() => {
      audio.play().catch((err) => console.log("Autoplay blocked by browser:", err));
    }, 500);

    return () => clearTimeout(timer);
  }, [state]);

  if (state === 'done') return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center ${state === 'waiting' ? 'cursor-pointer' : ''}`}
      onClick={() => { if (state === 'waiting') setState('playing'); }}
    >
      {state === 'waiting' && (
        <div className="flex flex-col items-center justify-center animate-pulse">
          <div className="text-zinc-400 text-xs tracking-[0.5em] uppercase font-light mb-2">PixelMovies</div>
          <div className="text-white text-lg tracking-[0.2em] font-medium border border-white/20 px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
            Tap To Enter
          </div>
        </div>
      )}
      {state === 'playing' && (
        <div className="w-full h-full flex items-center justify-center">
          <NetflixIntro onComplete={() => setState('done')} letters="PM" />
        </div>
      )}
    </div>
  );
}

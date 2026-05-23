"use client";

import { useState, useEffect } from "react";
import NetflixIntro from "./NetflixIntro";

export default function SplashScreen() {
  const [state, setState] = useState<'waiting' | 'playing' | 'done'>('waiting');

  const handleEnter = () => {
    if (state !== 'waiting') return;
    
    setState('playing');

    // Create the audio directly in the click handler to guarantee browser authorization
    const audio = new Audio('/nouveau-jingle-netflix.mp3');
    audio.volume = 1.0;
    
    // Play instantly to unlock the audio context for iOS/Safari
    audio.play().catch(() => {});
    audio.pause();
    audio.currentTime = 0;

    // Now that it's unlocked, we can safely play it with a timeout to match the animation
    setTimeout(() => {
      audio.play().catch((err) => console.log("Audio still blocked:", err));
    }, 500);
  };

  if (state === 'done') return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center ${state === 'waiting' ? 'cursor-pointer' : ''}`}
      onClick={handleEnter}
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

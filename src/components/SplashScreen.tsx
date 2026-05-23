"use client";

import { useState } from "react";
import NetflixIntro from "./NetflixIntro";

export default function SplashScreen() {
  const [state, setState] = useState<'waiting' | 'playing' | 'done'>('waiting');

  const handleEnter = () => {
    // Only handle enter if we are waiting
    if (state !== 'waiting') return;
    
    // Transition to the playing state which mounts the NetflixIntro component
    setState('playing');

    // Instantiate audio object
    const audio = new Audio('/nouveau-jingle-netflix.mp3');
    audio.volume = 0.5;

    // Start playback after 500ms to perfectly align with the zoom-in and brush flash
    setTimeout(() => {
      audio.play().catch((err) => console.log("Autoplay blocked by browser:", err));
    }, 500);
  };

  if (state === 'done') return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center ${state === 'waiting' ? 'cursor-pointer' : ''}`}
      onClick={handleEnter}
    >
      {state === 'waiting' && (
        <div className="text-zinc-200 tracking-[0.3em] text-sm animate-pulse font-light uppercase">
          Tap Anywhere To Start
        </div>
      )}
      {state === 'playing' && (
        <NetflixIntro onComplete={() => setState('done')} letters="PM" />
      )}
    </div>
  );
}

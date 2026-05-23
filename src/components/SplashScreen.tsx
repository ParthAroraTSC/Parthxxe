"use client";

import { useState, useEffect } from "react";
import NetflixIntro from "./NetflixIntro";

export default function SplashScreen() {
  const [state, setState] = useState<'playing' | 'done'>('playing');

  useEffect(() => {
    // Instantiate audio object
    const audio = new Audio('/nouveau-jingle-netflix.mp3');
    audio.volume = 0.5;

    // Start playback after 500ms to perfectly align with the zoom-in and brush flash
    const timer = setTimeout(() => {
      audio.play().catch((err) => console.log("Autoplay blocked by browser:", err));
    }, 500);

    // Aggressive fallback: If the user clicks or presses any key during the splash screen, 
    // force the audio to play if it was blocked.
    const handleInteraction = () => {
      if (audio.paused && state === 'playing') {
        audio.play().catch(() => {});
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [state]);

  if (state === 'done') return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
      {state === 'playing' && (
        <NetflixIntro onComplete={() => setState('done')} letters="PM" />
      )}
    </div>
  );
}

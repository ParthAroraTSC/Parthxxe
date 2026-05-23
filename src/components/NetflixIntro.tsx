import React, { useEffect, useState } from 'react';
import './NetflixIntro.css';

interface NetflixIntroProps {
  letters?: string;
  onComplete?: () => void;
}

export default function NetflixIntro({ letters = 'P&M', onComplete }: NetflixIntroProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // The animation takes about 4.5 seconds total
    const timer = setTimeout(() => {
      setShow(false);
      if (onComplete) onComplete();
    }, 4500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  if (!show) return null;

  return (
    <div id="intro-container">
      <div className="w-full h-full flex items-center justify-center scale-[0.55] sm:scale-[0.75] md:scale-90 lg:scale-100 origin-center transition-transform duration-300">
        <div className="logo-wrapper flex items-center justify-center -space-x-12">
          {letters.split('').map((letter, index) => (
            <div key={index} className="netflixintro" data-letter={letter} style={{ width: '250px' }}>
              <div className="helper-1">
                <div className="effect-brush">
                  {[...Array(31)].map((_, i) => (
                    <span key={`1-fur-${i + 1}`} className={`fur-${31 - i}`}></span>
                  ))}
                </div>
                <div className="effect-lumieres">
                  {[...Array(28)].map((_, i) => (
                    <span key={`lamp-${i + 1}`} className={`lamp-${i + 1}`}></span>
                  ))}
                </div>
              </div>
              <div className="helper-2">
                <div className="effect-brush">
                  {[...Array(31)].map((_, i) => (
                    <span key={`2-fur-${i + 1}`} className={`fur-${31 - i}`}></span>
                  ))}
                </div>
              </div>
              <div className="helper-3">
                <div className="effect-brush">
                  {[...Array(31)].map((_, i) => (
                    <span key={`3-fur-${i + 1}`} className={`fur-${31 - i}`}></span>
                  ))}
                </div>
              </div>
              <div className="helper-4">
                <div className="effect-brush">
                  {[...Array(31)].map((_, i) => (
                    <span key={`4-fur-${i + 1}`} className={`fur-${31 - i}`}></span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className={`fixed bottom-24 md:bottom-8 right-6 md:right-8 z-[99] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
      <button
        onClick={scrollToTop}
        className="p-3 rounded-full bg-[#FFE135] text-black shadow-[0_0_20px_rgba(255,225,53,0.6)] hover:shadow-[0_0_30px_rgba(255,225,53,0.9)] hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-[#FFE135]"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6 md:w-7 md:h-7" strokeWidth={3} />
      </button>
    </div>
  );
}

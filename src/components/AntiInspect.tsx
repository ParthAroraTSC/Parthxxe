"use client";

import { useEffect } from "react";

export default function AntiInspect() {
  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts for DevTools
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12, Ctrl+Shift+I/J/C, Ctrl+U (Windows/Linux)
      // Cmd+Opt+I/J/C, Cmd+U (Mac)
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) ||
        (e.ctrlKey && ["U", "u"].includes(e.key)) ||
        (e.metaKey && e.altKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) ||
        (e.metaKey && ["U", "u"].includes(e.key))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}

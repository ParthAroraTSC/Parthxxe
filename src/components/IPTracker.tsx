"use client";

import { useEffect } from "react";

export default function IPTracker() {
  useEffect(() => {
    const trackIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        console.log("User IP Address:", data.ip);
        // Additional tracking logic can be implemented here
      } catch (error) {
        console.error("Failed to fetch IP address:", error);
      }
    };

    trackIP();
  }, []);

  return null;
}

import { config } from "./config";

/**
 * 1. OMDB API
 * Used for fetching secondary metadata or ratings.
 */
export const fetchFromOMDB = async (imdbId: string) => {
  try {
    const res = await fetch(`${config.omdbUrl}/?i=${imdbId}&apikey=${config.omdbApiKey}`);
    return await res.json();
  } catch (error) {
    console.error("OMDB API Error:", error);
    return null;
  }
};

/**
 * 2. OpenSubtitles API
 * Uses custom header x-user-agent: VLSub 0.10.2
 */
export const searchSubtitles = async (imdbId: string, lang: string = "eng") => {
  try {
    const res = await fetch(`${config.openSubtitlesUrl}?imdbid=${imdbId}&sublanguageid=${lang}`, {
      headers: {
        "x-user-agent": "VLSub 0.10.2"
      }
    });
    return await res.json();
  } catch (error) {
    console.error("OpenSubtitles API Error:", error);
    return null;
  }
};

/**
 * 3. Stremio Cinemeta API
 * Fetch metadata directly from Stremio's v3 cinemeta backend.
 */
export const fetchStremioMeta = async (type: "movie" | "series", imdbId: string) => {
  try {
    const res = await fetch(`${config.stremioUrl}/${type}/${imdbId}.json`);
    return await res.json();
  } catch (error) {
    console.error("Stremio Cinemeta Error:", error);
    return null;
  }
};

/**
 * 5. Providers Data (Modflix JSON)
 * Fetches the streaming provider lists and mappings.
 */
export const fetchModflixProviders = async () => {
  try {
    const res = await fetch(config.modflixProvidersUrl);
    return await res.json();
  } catch (error) {
    console.error("Modflix Providers Error:", error);
    return null;
  }
};

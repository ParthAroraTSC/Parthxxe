export const config = {
  tmdbApiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY || 'ff51f94da53ecfd4393e38a0f0112315',
  rapidApiKey: process.env.NEXT_PUBLIC_RAPID_API_KEY || '63151c0b05msh53276de6947756bp1d6126jsnad7f40db6ce3',
  vidSrcApiKey: process.env.NEXT_PUBLIC_VIDSRC_API_KEY || 'api_toLEocXzMVDZcxtqoFDZ91qp0OJjgils',
  tmdbBaseUrl: process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.tmdb.org/3',
  imageBaseUrl: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/original',
  posterBaseUrl: process.env.NEXT_PUBLIC_POSTER_BASE_URL || 'https://image.tmdb.org/t/p/w500',
  rapidApiBaseUrl: process.env.NEXT_PUBLIC_RAPID_API_BASE_URL || 'https://moviesdatabase.p.rapidapi.com',
  // Extra APIs requested by user
  omdbApiKey: process.env.NEXT_PUBLIC_OMDB_API_KEY || "7755307f",
  omdbUrl: process.env.NEXT_PUBLIC_OMDB_URL || "https://www.omdbapi.com",
  stremioUrl: process.env.NEXT_PUBLIC_STREMIO_URL || "https://v3-cinemeta.strem.io/meta",
  openSubtitlesUrl: process.env.NEXT_PUBLIC_OPENSUBTITLES_URL || "https://rest.opensubtitles.org/search",
  modflixProvidersUrl: process.env.NEXT_PUBLIC_MODFLIX_PROVIDERS_URL || "https://himanshu8443.github.io/providers/modflix.json",
  utfsFlags: {
    global: "https://utfs.io/f/ImOWJajUmXfyRKHTpylsELpB6QlYA4OdG9Jfr3hagoCN5Mzt",
    india: "https://utfs.io/f/ImOWJajUmXfyYCEwdELCDZIMxNG5H27Bouwvb4fyVJrdqj3X",
    english: "https://utfs.io/f/ImOWJajUmXfyN1E0dlnILrEMR3DJQX7OUvixCSHp6YWGNVPc",
    italy: "https://utfs.io/f/ImOWJajUmXfynpGlTaXrTMAELcs2W76PyY4IRJVBXCHOofa5"
  }
};

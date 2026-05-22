import { config } from "./config";

export const fetchRapidAPI = async (endpoint: string) => {
  const url = `${config.rapidApiBaseUrl}${endpoint}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': config.rapidApiKey,
        'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com'
      },
      next: { revalidate: 3600 }
    });
    if (!response.ok) {
      console.warn(`RapidAPI warning: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    // Silently handle network errors to prevent console spam
    return [];
  }
};

export const getUpcomingTitles = async () => {
  return await fetchRapidAPI('/titles/x/upcoming');
};

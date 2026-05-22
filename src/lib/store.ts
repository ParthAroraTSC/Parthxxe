import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie } from './tmdb';

interface WatchlistState {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (movie) =>
        set((state) => {
          if (!state.watchlist.find((m) => m.id === movie.id)) {
            return { watchlist: [...state.watchlist, movie] };
          }
          return state;
        }),
      removeFromWatchlist: (id) =>
        set((state) => ({
          watchlist: state.watchlist.filter((m) => m.id !== id),
        })),
      isInWatchlist: (id) => get().watchlist.some((m) => m.id === id),
    }),
    {
      name: 'watchlist-storage',
    }
  )
);

export interface HistoryItem {
  movie: Movie;
  progress: number; // 0 to 100
  updatedAt: number;
}

interface HistoryState {
  history: HistoryItem[];
  updateProgress: (movie: Movie, progress: number) => void;
  removeFromHistory: (id: number) => void;
  getHistory: () => HistoryItem[];
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      updateProgress: (movie, progress) =>
        set((state) => {
          const existingIndex = state.history.findIndex((h) => h.movie.id === movie.id);
          let newHistory = [...state.history];
          
          if (existingIndex >= 0) {
            newHistory[existingIndex] = { ...newHistory[existingIndex], progress, updatedAt: Date.now() };
          } else {
            newHistory.push({ movie, progress, updatedAt: Date.now() });
          }
          
          // Sort by recently updated and keep only the latest 1
          newHistory.sort((a, b) => b.updatedAt - a.updatedAt);
          newHistory = newHistory.slice(0, 1);
          
          return { history: newHistory };
        }),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((h) => h.movie.id !== id),
        })),
      getHistory: () => get().history,
    }),
    {
      name: 'history-storage',
    }
  )
);


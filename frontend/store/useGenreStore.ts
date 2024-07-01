import { create } from 'zustand';

interface GenreState {
  allGenres: string[];
  setAllGenres: (g: string[]) => void;
}

export const useGenreStore = create<GenreState>((set) => ({
  allGenres: [],
  setAllGenres: (g) => set({ allGenres: g })
}));
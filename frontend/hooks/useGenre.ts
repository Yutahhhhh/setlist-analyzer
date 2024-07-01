import { useEffect } from "react";
import { getGenres } from "@/services/trackApi";
import { useGenreStore } from '@/store/useGenreStore';
export const useGenre = () => {
  const { setAllGenres } = useGenreStore();

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const res = await getGenres();
        setAllGenres(res);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
      }
    };

    loadGenres();
  }, [setAllGenres]);
};

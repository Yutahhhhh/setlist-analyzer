import { useState, useEffect } from 'react';
import { useTrackStore } from '@/store/useTrackStore';
import { getTracks } from '@/services/trackApi';
import Track from '@/models/tracks';
import { TrackSearchParams } from '@/types/common';

export const useTrack = (params: TrackSearchParams) => {
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const setTracks = useTrackStore((state) => state.setTracks);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const result = await getTracks(params);
        setTracks(result.tracks.map((t) => new Track(t)));
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages || 0);
        setTotalItemCount(result.totalItemCount);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.extensions, params.filename, params.genres, params.tempoRange, params.hasLyricTrack, setTracks]);

  return { 
    currentPage, totalPages, totalItemCount, isLoading, error
  };
};
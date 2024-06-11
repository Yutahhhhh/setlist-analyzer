import { useState } from 'react';
import { useTrackStore } from '@/store/useTrackStore';
import { PageTrackList, TrackListRequestParams } from '@/interfaces/tracks/TrackList';
import { getAudios } from '@/services/audioApi';
import { getTracks } from '@/services/trackApi';
import Track from '@/models/tracks';
import { TrackSearchParams } from '@/types/common';
import useDeepCompareEffect from 'use-deep-compare-effect'

type FetchFunction = (params: TrackListRequestParams) => Promise<PageTrackList>;

const useDataFetcher = (
  fetchFunction: FetchFunction,
  params: TrackSearchParams
) => {
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const setTracks = useTrackStore((state) => state.setTracks);

  useDeepCompareEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const result = await fetchFunction(params);
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
  }, [
    fetchFunction, 
    params,
    setTracks
  ]);

  return { 
    currentPage, totalPages, totalItemCount, isLoading, error
  };
};

export const useTrack = (params: TrackSearchParams) => {
  return useDataFetcher(getTracks, params);
};

export const useAudio = (params: TrackSearchParams) => {
  return useDataFetcher(getAudios, params);
};
"use client";
import { useState, useCallback, useMemo } from 'react';
import Track, { IRecommendWeight } from '@/models/tracks';
import { getTracks, getRecommendTracks } from '@/services/trackApi';
import { TrackSearchParams } from '@/types/common';
import { useTrackStore } from '@/store/useTrackStore';
import { useTrack } from '@/hooks/useTrackHook';

interface UseSelectToolProps {
  initialSearchParams: TrackSearchParams;
  initialRecommendWeight: IRecommendWeight;
  selectedTracks: Track[];
}

export const useSelectTool = ({
  initialSearchParams,
  initialRecommendWeight,
  selectedTracks,
}: UseSelectToolProps) => {
  const [searchParams, setSearchParams] = useState<TrackSearchParams>(initialSearchParams);
  const [formParams, setFormParams] = useState<TrackSearchParams>(searchParams);
  const [recommendWeight, setRecommendWeight] = useState<IRecommendWeight>(initialRecommendWeight);
  const [recommendPhrase, setRecommendPhrase] = useState<string>("");
  const [recommendTracks, setRecommendTracks] = useState<Track[]>([]);
  const [grantTrack, setGrantTrack] = useState<Track>();
  const { tracks: fromTracks, addTracks } = useTrackStore();
  const { currentPage, totalItemCount } = useTrack(searchParams);

  const handleSearch = useCallback(async () => {
    try {
      const res = await getTracks(searchParams);
      addTracks(res.tracks.map((t) => new Track(t)));
      setSearchParams({ ...formParams, page: 1, per: 10 });
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
    }
  }, [searchParams, addTracks, formParams]);

  const handleRecommend = useCallback(async (trackId: number) => {
    try {
      const res = await getRecommendTracks({
        id: trackId,
        page: 1,
        per: 10,
        phrase: recommendPhrase,
        weights: recommendWeight,
      });
      setRecommendTracks(res.map((t) => new Track(t)));
    } catch (error) {
      console.error("Failed to fetch recommended tracks:", error);
    }
  }, [recommendPhrase, recommendWeight]);

  const handleScrollSearch = async (pageParams: {
    page?: number;
    per?: number;
  }) => {
    const pagenates = {
      page: pageParams?.page || 1,
      per: pageParams?.per || searchParams.per,
    };
    const requestParams = { ...searchParams, ...pagenates };
    try {
      const res = await getTracks(requestParams);
      addTracks(res.tracks.map((t) => new Track(t)));
      setSearchParams({
        ...requestParams,
        page: res.currentPage,
        per: pagenates.per,
      });
    } catch (error) {
      console.error("Failed to fetch audio directory:", error);
      throw error;
    }
  }

  const filterTracks = (targets: Track[]): Track[] => {
    return targets.filter((track) => {
      return !selectedTracks.some((selectedTrack) => {
        const sameId = selectedTrack.id === track.id;
        const sameMd5 = selectedTrack.md5 === track.md5;
        return sameId && sameMd5;
      });
    });
  }
  
  const filteredFromTracks: Track[] = useMemo(() => {
    return filterTracks(fromTracks);
  }, [fromTracks, filterTracks]);

  const filteredRecommendTracks: Track[] = useMemo(() => {
    return filterTracks(recommendTracks);
  }, [recommendTracks, filterTracks]);

  return {
    recommendPhrase,
    recommendWeight,
    formParams,
    searchParams,
    currentPage,
    totalItemCount,
    grantTrack,
    // get
    filteredRecommendTracks,
    filteredFromTracks,
    // Set
    setGrantTrack,
    setRecommendPhrase,
    setFormParams,
    setRecommendWeight,
    // Handlers
    handleScrollSearch,
    handleSearch,
    handleRecommend,
  };
};

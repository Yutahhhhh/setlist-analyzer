import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TrackSearchParams } from '@/types/common';
import useDeepCompareEffect from 'use-deep-compare-effect';

export function useTrackSearchParams() {
  const params = useSearchParams();
  const [searchParams, setSearchParams] = useState<TrackSearchParams>({
    page: 1,
    per: 10,
    filename: '',
    extensions: '',
    isAllTracks: false
  });

  useDeepCompareEffect(() => {
    setSearchParams({
      page: (params.get("page") || 1) as number,
      per: (params.get("per") || 10) as number,
      filename: (params.get("filename") || "") as string,
      extensions: (params.get("extensions") ? params.getAll("extensions").join(",") : '') as string,
      isAllTracks: params.get("is_all_tracks") === "true",
    });
  }, [params, searchParams]);

  return {
    searchParams,
    setSearchParams,
  };
}

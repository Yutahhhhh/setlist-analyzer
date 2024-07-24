import { ResponsePagenation } from '@/interfaces/Pagenation';
import { IRecommendWeight, ITrack } from '@/models/tracks';

export interface PageTrackList extends ResponsePagenation {
  tracks: ITrack[];
}

export interface TrackListRequestParams {
  page: number;
  per: number;
  filename: string;
  extensions: string;
  hasLyricTrack?: boolean;
  genres?: string;
  tempoRange?: number[];
}

export interface TrackRecommendRequestParams {
  page: number;
  per: number;
  id: number;
  phrase: string;
  weights: IRecommendWeight
}

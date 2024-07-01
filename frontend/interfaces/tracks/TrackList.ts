import { ResponsePagenation } from '@/interfaces/Pagenation';
import { ITrack } from '@/models/tracks';

export interface PageTrackList extends ResponsePagenation {
  tracks: ITrack[];
}

export interface TrackListRequestParams {
  page: number;
  per: number;
  filename: string;
  extensions: string;
  genres?: string;
  isAllTracks?: boolean;
}


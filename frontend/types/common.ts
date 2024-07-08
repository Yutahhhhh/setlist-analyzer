export type TrackSearchParams = {
  page: number;
  per: number;
  filename: string;
  extensions: string;
  genres?: string;
  isAllTracks?: boolean;
  hasLyricTrack?: boolean;
}

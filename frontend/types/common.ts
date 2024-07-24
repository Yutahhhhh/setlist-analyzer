export type TrackSearchParams = {
  page: number;
  per: number;
  filename: string;
  extensions: string;
  genres?: string;
  hasLyricTrack?: boolean;
  tempoRange?: number[];
}

export type AudioSearchParams = {
  filename: string;
  extensions: string;
  isAllTracks: boolean;
}
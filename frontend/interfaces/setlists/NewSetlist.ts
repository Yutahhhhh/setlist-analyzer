export interface NewSetListRequestParams {
  name: string;
  genreName: string;
  rating: number;
  setlistTracksAttributes: {
    trackId: number;
    playOrder: number;
  }[];
}
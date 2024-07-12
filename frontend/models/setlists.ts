import Model from "@/models/model";
import Track, { ITrack } from "@/models/tracks";

export interface ISetList {
  id: number;
  name: string;
  description: string;
  tracks: ITrack[];
}

export default class SetList extends Model {
  id: number = 0;
  name: string = '';
  description: string = '';
  tracks: Track[] = [];

  constructor(data: ISetList) {
    super();
    this.tracks = data.tracks.map((t) => new Track(t));
  }
}
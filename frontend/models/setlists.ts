import { NewSetListRequestParams, EditSetlistRequestProps } from "@/interfaces/setlists";
import Model from "@/models/model";
import Track, { ITrack } from "@/models/tracks";

export type { NewSetListRequestParams, EditSetlistRequestProps };

export interface ISetList {
  id: number;
  name: string;
  genreName: string;
  rating: number;
  tracks: ITrack[];
}

export default class SetList extends Model {
  id: number = 0;
  name: string = '';
  genreName: string = '';
  rating: number = 3;
  tracks: Track[] = [];

  constructor(initValues?: Partial<ISetList>) {
    super();
    this.assignValues(initValues);
    this.tracks = (initValues?.tracks || []).map((t) => new Track(t));
  }

  updateField(field: keyof ISetList, value: any): SetList {
    return new SetList({
      ...this,
      [field]: value,
    });
  }

  toCreateParams(): NewSetListRequestParams {
    return {
      name: this.name,
      genreName: this.genreName,
      rating: this.rating,
      setlistTracksAttributes: this.tracks.map((t, i) => ({
        trackId: t.id,
        playOrder: i + 1,
      })),
    };
  }

  toUpdateParams(): EditSetlistRequestProps {
    return Object.assign(this.toCreateParams(), { 
      id: this.id
    });
  }

  get sortedTracks(): Track[] {
    return this.tracks.sort((a, b) => a.playOrder - b.playOrder);
  }
}
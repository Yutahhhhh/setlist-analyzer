import Model from "@/models/model";

export interface ITrack {
  id: number;
  title: string;
  artist: string;
  album: string;
  year: string;
  coverImageUrl: string;
  coverMimeType: string;
  acousticness: number;
  spectralContrast: number;
  duration: number;
  energy: number;
  genre: string;
  spectralFlatness: number;
  key: number;
  spectralBandwidth: number;
  loudness: number;
  lyrics: string;
  measure: number;
  mode: number;
  name: string;
  path: string;
  mfcc: number;
  tempo: number;
  timeSignature: number;
  valence: number;
  url: string;
}

export default class Track extends Model {
  id: number = 0;
  title: string = '';
  originalDirectory: string = '';
  artist: string = '';
  album: string = '';
  year: string = '';
  coverImageUrl: string = '';
  coverMimeType: string = '';
  acousticness: number = 0;
  spectralContrast: number = 0;
  duration: number = 0;
  energy: number = 0;
  genre: string = '';
  spectralFlatness: number = 0;
  key: number = 0;
  spectralBandwidth: number = 0;
  loudness: number = 0;
  lyrics: string = '';
  measure: number = 0;
  mode: number = 0;
  name: string = '';
  path: string = '';
  mfcc: number = 0;
  tempo: number = 0;
  timeSignature: number = 0;
  valence: number = 0;
  url: string = '';
  // frontend
  isChecked: boolean = false;

  constructor(initValues?: Partial<ITrack>) {
    super();
    this.assignValues(initValues);
  }

  toParams(): ITrack {
    return {
      id: this.id,
      title: this.title,
      url: this.url,
      artist: this.artist,
      album: this.album,
      year: this.year,
      coverImageUrl: this.coverImageUrl,
      coverMimeType: this.coverMimeType,
      acousticness: this.acousticness,
      spectralContrast: this.spectralContrast,
      duration: this.duration,
      energy: this.energy,
      genre: this.genre,
      spectralFlatness: this.spectralFlatness,
      key: this.key,
      spectralBandwidth: this.spectralBandwidth,
      loudness: this.loudness,
      lyrics: this.lyrics,
      measure: this.measure,
      mode: this.mode,
      name: this.name,
      path: this.path,
      mfcc: this.mfcc,
      tempo: this.tempo,
      timeSignature: this.timeSignature,
      valence: this.valence
    };
  }

  get topCell(): string {
    return this.title || this.name;
  }

  get underCell(): string {
    return [this.album, this.genre].filter((v) => v).join(' - ');
  }

  get hasLyrics(): boolean {
    return !!this.lyrics;
  }
}
import Model from "@/models/model";

export interface ITrackPhrase {
  id: number;
  phrase: string;
  startTime: number;
  endTime: number;
}

export interface IRecommendWeight {
  genre?: number;
  tempo?: number;
  key?: number;
  mode?: number;
  valence?: number;
  time_signature?: number;
  energy?: number;
  acousticness?: number;
  spectral_flatness?: number;
  loudness?: number;
}

export const RECOMMEND_WEIGHT_FORMS: { key: keyof IRecommendWeight, label: string }[]  = [
  { key: 'genre', label: 'ジャンル' },
  { key: 'tempo', label: 'BPM' },
  { key: 'key', label: 'キー' },
  { key: 'mode', label: '調' },
  { key: 'valence', label: '明るさ' },
  { key: 'time_signature', label: '拍子' },
  { key: 'energy', label: 'エネルギー' },
  { key: 'acousticness', label: 'アコースティック' },
  { key: 'spectral_flatness', label: 'スペクトル' }
]

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
  md5: string;
  // リレーション
  phrases: ITrackPhrase[];
  playOrder: number;
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
  md5: string = '';
  // リレーション
  playOrder: number = 0;
  phrases: ITrackPhrase[] = [];
  // frontend
  isChecked: boolean = false;

  constructor(initValues?: Partial<ITrack>) {
    super();
    this.assignValues(initValues);
  }

  get topCell(): string {
    return this.title || this.name;
  }

  get underCell(): string {
    return [this.album, this.genre, this.tempo].filter((v) => v).join(' - ');
  }

  get hasLyrics(): boolean {
    return !!this.lyrics;
  }

  get uniqPhrases(): ITrackPhrase[] {
    const uniquePhraseMap = new Map<string, ITrackPhrase>();
    this.phrases.forEach(phrase => {
      if (!uniquePhraseMap.has(phrase.phrase)) {
        uniquePhraseMap.set(phrase.phrase, phrase);
      }
    });
    return Array.from(uniquePhraseMap.values());
  }
}
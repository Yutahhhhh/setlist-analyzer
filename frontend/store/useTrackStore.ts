import { create } from 'zustand';
import Track from '@/models/tracks';

interface TrackState {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  addTracks: (tracks: Track[]) => void;
  setTracks: (tracks: Track[]) => void;
  setTrack: (track: Track | null) => void;
  togglePlay: (state: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
}

export const useTrackStore = create<TrackState>((set) => ({
  tracks: [] as Track[],
  currentTrack: null,
  isPlaying: false,
  volume: 30,
  currentTime: 0,
  addTracks: (tracks) => set((state) => ({ tracks: [...state.tracks, ...tracks] })),
  setTrack: (track) => set({ currentTrack: track }),
  setTracks: (tracks) => set({ tracks }),
  togglePlay: (state) => set({ isPlaying: state }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time })
}));
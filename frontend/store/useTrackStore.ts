import { create } from 'zustand';
import Track from '@/models/tracks';

interface TrackState {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  setTrack: (track: Track | null) => void;
  togglePlay: (state: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setTracks: (tracks: Track[]) => void;
  setChecked: (track: Track, isChecked: boolean) => void;
}

export const useTrackStore = create<TrackState>((set) => ({
  tracks: [],
  currentTrack: null,
  isPlaying: false,
  volume: 30,
  currentTime: 0,
  setTrack: (track) => set({ currentTrack: track }),
  togglePlay: (state) => set({ isPlaying: state }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setTracks: (tracks) => set({ tracks }),
  // TrackTableからCheckboxの状態を変更するための関数
  setChecked: (track: Track, isChecked: boolean) => {
    set((state) => {
      const newTracks = state.tracks.map((t) => {
        if (t.id === track.id) {
          t.isChecked = isChecked;
        }
        return t;
      });
      return { tracks: newTracks };
    });
  }
}));
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface PlayerState {
  currentTrack: any | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: any[];
  currentIndex: number;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
  isFullscreen: boolean;
  accentColor: string;

  setTrack: (track: any) => void;
  togglePlay: () => void;
  setPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setQueue: (queue: any[]) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setFullscreen: (isFullscreen: boolean) => void;
  setAccentColor: (color: string) => void;
  setShuffled: (shuffled: boolean) => void;
  setRepeatMode: (mode: 'off' | 'all' | 'one') => void;
}

export const usePlayerStore = create<PlayerState>()(
  immer((set) => ({
    currentTrack: null,
    isPlaying: false,
    volume: 0.8,
    currentTime: 0,
    duration: 0,
    queue: [],
    currentIndex: -1,
    isShuffled: false,
    repeatMode: 'off',
    isFullscreen: false,
    accentColor: '#6366f1',

    setTrack: (track) => set((state) => {
      state.currentTrack = track;
    }),
    togglePlay: () => set((state) => {
      state.isPlaying = !state.isPlaying;
    }),
    setPlaying: (isPlaying) => set((state) => {
      state.isPlaying = isPlaying;
    }),
    setVolume: (volume) => set((state) => {
      state.volume = volume;
    }),
    setCurrentTime: (time) => set((state) => {
      state.currentTime = time;
    }),
    setDuration: (duration) => set((state) => {
      state.duration = duration;
    }),
    setQueue: (queue) => set((state) => {
      state.queue = queue;
    }),
    nextTrack: () => set((state) => {
      if (state.queue.length > 0) {
        state.currentIndex = (state.currentIndex + 1) % state.queue.length;
        state.currentTrack = state.queue[state.currentIndex];
      }
    }),
    prevTrack: () => set((state) => {
      if (state.queue.length > 0) {
        state.currentIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
        state.currentTrack = state.queue[state.currentIndex];
      }
    }),
    setFullscreen: (isFullscreen) => set((state) => {
      state.isFullscreen = isFullscreen;
    }),
    setAccentColor: (color) => set((state) => {
      state.accentColor = color;
    }),
    setShuffled: (shuffled) => set((state) => {
      state.isShuffled = shuffled;
    }),
    setRepeatMode: (mode) => set((state) => {
      state.repeatMode = mode;
    }),
  }))
);

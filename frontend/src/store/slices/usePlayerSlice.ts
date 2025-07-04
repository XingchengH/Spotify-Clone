import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Song } from "./songsSlice";

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentSongIdx: number;
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentSongIdx: -1,
};

const playerSongs = createSlice({
  name: "playerSongs",
  initialState,
  reducers: {
    initializeQueue: (state, action: PayloadAction<Song[]>) => {
      state.queue = action.payload;
      state.currentSongIdx = 0;
      state.currentSong = action.payload[0] || null;
      state.isPlaying = false;
    },
    playAlbum: (
      state,
      action: PayloadAction<{ songs: Song[]; startIdx?: number }>
    ) => {
      const { songs, startIdx = 0 } = action.payload;
      state.queue = songs;
      state.currentSongIdx = startIdx;
      state.currentSong = songs[startIdx] || null;
      state.isPlaying = true;
    },
    setCurrentSong: (state, action: PayloadAction<Song | null>) => {
      state.currentSong = action.payload;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    playNext: (state) => {
      if (state.queue.length === 0) return;
      const nextIdx = (state.currentSongIdx + 1) % state.queue.length;
      state.currentSongIdx = nextIdx;
      state.currentSong = state.queue[nextIdx];
      state.isPlaying = true;
    },
    playPrevious: (state) => {
      if (state.queue.length === 0) return;
      const prevIdx =
        (state.currentSongIdx - 1 + state.queue.length) % state.queue.length;
      state.currentSongIdx = prevIdx;
      state.currentSong = state.queue[prevIdx];
      state.isPlaying = true;
    },
  },
});

export const {
  initializeQueue,
  playAlbum,
  setCurrentSong,
  togglePlay,
  playNext,
  playPrevious,
} = playerSongs.actions;

export default playerSongs;

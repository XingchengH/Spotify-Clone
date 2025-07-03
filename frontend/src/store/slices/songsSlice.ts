import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import type { Artist } from "./artistSlice";

export interface Song {
  _id: string;
  title: string;
  artist: Artist;
  imgUrl?: string;
  audioUrl: string;
  duration: number;
  genre?: string;
  language?: string;
  albumId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface SongsState {
  songs: Song[];

  featured: Song[];
  featuredStatus: "idle" | "loading" | "succeeded" | "failed";

  madeForYou: Song[];
  madeForYouStatus: "idle" | "loading" | "succeeded" | "failed";

  trending: Song[];
  trendingStatus: "idle" | "loading" | "succeeded" | "failed";

  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const fetchSongs = createAsyncThunk<Song[]>(
  "songs/fetchSongs",
  async () => {
    console.log("Fetching songs from /api/songs");
    const res = await axiosInstance.get("/songs");
    return res.data;
  }
);

export const fetchFeaturedSongs = createAsyncThunk<Song[]>(
  "songs/fetchFeatured",
  async () => {
    const res = await axiosInstance.get("/songs/featured");
    return res.data;
  }
);

export const fetchMadeForYouSongs = createAsyncThunk<Song[]>(
  "songs/fetchMadeForYou",
  async () => {
    const res = await axiosInstance.get("/songs/made-for-you");
    return res.data;
  }
);

export const fetchTrendingSongs = createAsyncThunk<Song[]>(
  "songs/fetchTrending",
  async () => {
    const res = await axiosInstance.get("/songs/trending");
    return res.data;
  }
);

const initialState: SongsState = {
  songs: [],
  status: "idle",
  error: null,

  featured: [],
  featuredStatus: "idle",

  madeForYou: [],
  madeForYouStatus: "idle",

  trending: [],
  trendingStatus: "idle",
};

const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    resetSongs: (state) => {
      state.songs = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.songs = action.payload;
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch songs";
        console.error("Fetch songs failed:", action.error.message);
      })

      .addCase(fetchFeaturedSongs.pending, (state) => {
        state.featuredStatus = "loading";
      })
      .addCase(fetchFeaturedSongs.fulfilled, (state, action) => {
        state.featured = action.payload;
        state.featuredStatus = "succeeded";
      })
      .addCase(fetchFeaturedSongs.rejected, (state) => {
        state.featuredStatus = "failed";
      })

      // Made for You
      .addCase(fetchMadeForYouSongs.pending, (state) => {
        state.madeForYouStatus = "loading";
      })
      .addCase(fetchMadeForYouSongs.fulfilled, (state, action) => {
        state.madeForYou = action.payload;
        state.madeForYouStatus = "succeeded";
      })
      .addCase(fetchMadeForYouSongs.rejected, (state) => {
        state.madeForYouStatus = "failed";
      })

      // Trending
      .addCase(fetchTrendingSongs.pending, (state) => {
        state.trendingStatus = "loading";
      })
      .addCase(fetchTrendingSongs.fulfilled, (state, action) => {
        state.trending = action.payload;
        state.trendingStatus = "succeeded";
      })
      .addCase(fetchTrendingSongs.rejected, (state) => {
        state.trendingStatus = "failed";
      });
  },
});

export const { resetSongs } = songsSlice.actions;

export default songsSlice;

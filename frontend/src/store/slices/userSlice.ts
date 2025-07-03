import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { updateApiToken, axiosInstance } from "../../lib/axios";
import type { Song } from "./songsSlice";

type DecodedToken = {
  id: string;
  username?: string;
  email?: string;
  imageUrl?: string;
  exp?: number;
};

type Artist = {
  _id: string;
  name: string;
  bio?: string;
  imgUrl?: string;
  genre?: string[];
  language?: string;
};

type Status = "idle" | "loading" | "succeeded" | "failed";

type UserState = {
  token: string | null;
  user: DecodedToken | null;
  loading: boolean;

  likedSongs: Song[];
  likedSongsStatus: Status;
  likedSongsError: string | null;

  followedArtists: Artist[];
  followedArtistsStatus: Status;
  followedArtistsError: string | null;
};

const initialState: UserState = {
  token: null,
  user: null,
  loading: true,

  likedSongs: [],
  likedSongsStatus: "idle",
  likedSongsError: null,

  followedArtists: [],
  followedArtistsStatus: "idle",
  followedArtistsError: null,
};

export const initializeAuth = createAsyncThunk(
  "user/initializeAuth",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) return thunkAPI.rejectWithValue("No token");

    const decoded = jwtDecode<DecodedToken>(token);
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("token");
      return thunkAPI.rejectWithValue("Token expired");
    }

    updateApiToken(token);
    return { token, user: decoded };
  }
);

export const fetchUserLikedSongs = createAsyncThunk(
  "user/fetchLikedSongs",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("users/likedSongs");
      return res.data;
    } catch (error: any) {
      console.error("Error fetching liked songs:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch liked songs"
      );
    }
  }
);

export const fetchUserFollowedArtists = createAsyncThunk(
  "user/fetchFollowedArtists",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("users/followArtist");
      return res.data.followedArtists;
    } catch (error: any) {
      console.error("Error fetching followed artists:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch followed artists"
      );
    }
  }
);

export const toggleLikedSong = createAsyncThunk(
  "user/toggleLikedSong",
  async ({ songId, liked }: { songId: string; liked: boolean }, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/users/toggleLike", {
        songId,
        liked,
      });
      return res.data.likedSongs;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to toggle liked song"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      const token = action.payload.token;
      state.token = token;
      state.user = jwtDecode<DecodedToken>(token);
      state.loading = false;
      localStorage.setItem("token", token);
      updateApiToken(token);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.likedSongs = [];
      state.likedSongsStatus = "idle";
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    // Auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.loading = false;
      });

    // Liked Songs
    builder
      .addCase(fetchUserLikedSongs.pending, (state) => {
        state.likedSongsStatus = "loading";
        state.likedSongsError = null;
      })
      .addCase(fetchUserLikedSongs.fulfilled, (state, action) => {
        state.likedSongs = action.payload;
        state.likedSongsStatus = "succeeded";
      })
      .addCase(fetchUserLikedSongs.rejected, (state, action) => {
        state.likedSongsStatus = "failed";
        state.likedSongsError = action.payload as string;
      });

    // Toggle Liked Song
    builder
      .addCase(toggleLikedSong.pending, (state) => {
        state.likedSongsStatus = "loading";
      })
      .addCase(toggleLikedSong.fulfilled, (state, action) => {
        state.likedSongs = action.payload;
        state.likedSongsStatus = "succeeded";
      })
      .addCase(toggleLikedSong.rejected, (state, action) => {
        state.likedSongsStatus = "failed";
        state.likedSongsError = action.payload as string;
      });

    // Followed Artists
    builder
      .addCase(fetchUserFollowedArtists.pending, (state) => {
        state.followedArtistsStatus = "loading";
        state.followedArtistsError = null;
      })
      .addCase(fetchUserFollowedArtists.fulfilled, (state, action) => {
        state.followedArtists = action.payload;
        state.followedArtistsStatus = "succeeded";
      })
      .addCase(fetchUserFollowedArtists.rejected, (state, action) => {
        state.followedArtistsStatus = "failed";
        state.followedArtistsError = action.payload as string;
      });
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice;

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
  isAdmin?: boolean;
};

type Artist = {
  _id: string;
  name: string;
  bio?: string;
  imgUrl?: string;
  genre?: string[];
  language?: string;
};

type User = {
  _id: string;
  username: string;
  email: string;
  imageUrl?: string;
  likedSongs: Song[];
  followedArtists: Artist[];
  createdAt: string;
  updatedAt: string;
};

type Status = "idle" | "loading" | "succeeded" | "failed";

type UserState = {
  token: string | null;
  user: DecodedToken | null; // Decoded token info
  profile: User | null; // Full DB user info
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
  profile: null,
  loading: true,

  likedSongs: [],
  likedSongsStatus: "idle",
  likedSongsError: null,

  followedArtists: [],
  followedArtistsStatus: "idle",
  followedArtistsError: null,
};

// Decode JWT and set auth info — tries localStorage first, then falls back to cookie via /auth/me
export const initializeAuth = createAsyncThunk(
  "user/initializeAuth",
  async (_, thunkAPI) => {
    const stored = localStorage.getItem("token");
    if (stored) {
      const decoded = jwtDecode<DecodedToken>(stored);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp > now) {
        updateApiToken(stored);
        return { token: stored, user: decoded };
      }
      localStorage.removeItem("token");
    }

    // Fall back to cookie-based session
    try {
      const res = await axiosInstance.get("/auth/me");
      const { token, user } = res.data as { token: string; user: DecodedToken };
      localStorage.setItem("token", token);
      updateApiToken(token);
      return { token, user };
    } catch {
      return thunkAPI.rejectWithValue("No valid session");
    }
  }
);

export const logoutAsync = createAsyncThunk("user/logoutAsync", async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch {
    // best-effort — clear client state regardless
  }
});

// Get full user data by ID
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("users/me");
      return res.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

// Get liked songs
export const fetchUserLikedSongs = createAsyncThunk(
  "user/fetchLikedSongs",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("users/likedSongs");
      return res.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch liked songs"
      );
    }
  }
);

// Get followed artists
export const fetchUserFollowedArtists = createAsyncThunk(
  "user/fetchFollowedArtists",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("users/followArtist");
      return res.data.followedArtists;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch followed artists"
      );
    }
  }
);

// Toggle like/unlike
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
      state.profile = null;
      state.loading = false;
      state.likedSongs = [];
      state.likedSongsStatus = "idle";
      state.followedArtists = [];
      state.followedArtistsStatus = "idle";
      localStorage.removeItem("token");
      updateApiToken(null);
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
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.profile = null;
        state.loading = false;
      })
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
      })

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
      })

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
      })

      .addCase(logoutAsync.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.profile = null;
        state.loading = false;
        state.likedSongs = [];
        state.likedSongsStatus = "idle";
        state.followedArtists = [];
        state.followedArtistsStatus = "idle";
        localStorage.removeItem("token");
        updateApiToken(null);
      });
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice;

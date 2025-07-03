import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import type { RootState } from "@reduxjs/toolkit/query";

export interface Artist {
  _id: string;
  name: string;
  imgUrl?: string;
  genre?: string;
  language?: string;
}

type ArtistState = {
  artistDetail: Artist | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: ArtistState = {
  artistDetail: null,
  status: "idle",
  error: null,
};

export const fetchArtistById = createAsyncThunk(
  "artist/fetchById",
  async (artistId: string, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/artist/${artistId}`);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch artist"
      );
    }
  }
);

const artistSlide = createSlice({
  name: "artist",
  initialState,
  reducers: {
    clearArtist(state) {
      state.artistDetail = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtistById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchArtistById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.artistDetail = action.payload;
      })
      .addCase(fetchArtistById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearArtist } = artistSlide.actions;

export default artistSlide;

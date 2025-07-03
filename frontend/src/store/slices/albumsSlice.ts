import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import type { Artist } from "./artistSlice";

export interface Album {
  _id: string;
  title: string;
  artist: Artist; // artist is an object now
  imgUrl: string;
  releaseYear: number;
  songs?: string[];
}

export const fetchAlbums = createAsyncThunk<Album[]>(
  "albums/fetchAlbums",
  async () => {
    const res = await axiosInstance.get("/albums");
    return res.data.albums;
  }
);

export const fetchAlbumById = createAsyncThunk<Album, string>(
  "albums/fetchAlbumById",
  async (albumId: string) => {
    const res = await axiosInstance.get(`/albums/${albumId}`);
    return res.data;
  }
);

const albumsSlice = createSlice({
  name: "albums",
  initialState: {
    albums: [] as Album[],
    status: "idle",
    error: null as string | null,
    selectedAlbum: null as Album | null,
    selectedAlbumStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
  },
  reducers: {
    resetAlbums: (state) => {
      state.albums = [];
      state.status = "idle";
      state.error = null;
      state.selectedAlbum = null;
      state.selectedAlbumStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.albums = action.payload;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch albums";
      })

      .addCase(fetchAlbumById.pending, (state) => {
        state.selectedAlbumStatus = "loading";
      })
      .addCase(fetchAlbumById.fulfilled, (state, action) => {
        state.selectedAlbumStatus = "succeeded";
        state.selectedAlbum = action.payload;
      })
      .addCase(fetchAlbumById.rejected, (state, action) => {
        state.selectedAlbumStatus = "failed";
        state.selectedAlbum = null;
        state.error = action.error.message || "Failed to fetch album";
      });
  },
});

export const { resetAlbums } = albumsSlice.actions;

export default albumsSlice;

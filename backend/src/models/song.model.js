import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    imgUrl: { type: String, required: false },
    audioUrl: { type: String, required: true },
    duration: { type: Number, required: true },
    genre: { type: String, required: false },
    language: { type: String, required: false },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      default: null,
      required: false,
    },
  },
  { timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);

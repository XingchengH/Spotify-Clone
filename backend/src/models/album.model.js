import mongoose from "mongoose";

const albumSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
      index: true,
    },
    imgUrl: { type: String, required: true },
    releaseYear: { type: Number, required: true, min: 1900, max: 2100 },
    songs: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Song", default: null },
    ],
  },
  { timestamps: true }
);

export const Album = mongoose.model("Album", albumSchema);

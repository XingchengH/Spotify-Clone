import mongoose from "mongoose";
import bcypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    imageUrl: { type: String },
    likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    followedArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],
  },
  { timestamps: true }
);

// Hashing the current Password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;

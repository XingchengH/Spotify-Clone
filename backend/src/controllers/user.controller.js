import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import Artist from "../models/artist.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const users = await User.find({ _id: { $ne: currentUserId } });
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("likedSongs")
      .populate("followedArtists");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    next(error);
  }
};


export const getLikedSongs = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: "likedSongs",
      populate: { path: "artist" },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.likedSongs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updateUser) {
      return res.status(401).json({ message: "User not found." });
    }

    res.json(updateUser);
  } catch (error) {
    console.log("Error updating user", error);
    res.status(500).json({ message: "Failed to update user", error });
  }
};

export const followArtist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { artistId } = req.body;

    if (!artistId) {
      return res.status(400).json({ message: "Artist ID is required" });
    }

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyFollowing = user.followedArtists.includes(artistId);

    if (alreadyFollowing) {
      user.followedArtists.pull(artistId);
    } else {
      user.followedArtists.push(artistId);
    }

    await user.save();

    const updatedUser = await User.findById(userId)
      .select("-password")
      .populate("followedArtists");

    res.status(200).json({
      message: alreadyFollowing
        ? "Artist unfolloed successfully"
        : "Artist followed successfully",
      followedArtists: updatedUser.followedArtists,
    });
  } catch (error) {
    console.error("Error toggling artist follow:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFollowingArtist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("followedArtists");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ followedArtists: user.followedArtists });
  } catch (error) {
    next(error);
  }
};

export const toggleLikedSong = async (req, res) => {
  const userId = req.user.id;
  const { songId, liked } = req.body;

  if (
    !songId ||
    (liked !== "true" && liked !== "false" && liked !== true && liked !== false)
  ) {
    return res
      .status(400)
      .json({ message: "songId and liked (boolean) are required" });
  }

  const likedBool = liked === "true" || liked === true;

  try {
    const update = likedBool
      ? { $pull: { likedSongs: songId } }
      : { $addToSet: { likedSongs: songId } };

    const user = await User.findByIdAndUpdate(userId, update, {
      new: true,
    }).populate({
      path: "likedSongs",
      populate: {
        path: "artist",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ likedSongs: user.likedSongs });
  } catch (error) {
    console.error("Error toggling liked song:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

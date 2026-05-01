import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { upload } from "../lib/s3.js";

import {
  getAllUsers,
  getLikedSongs,
  updateUserProfile,
  getCurrentUser,
  followArtist,
  getFollowingArtist,
  toggleLikedSong,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", auth, getAllUsers);
router.get("/likedSongs", auth, getLikedSongs);
router.get("/followArtist", auth, getFollowingArtist);
router.get("/me", auth, getCurrentUser);

router.post("/toggleLike", auth, toggleLikedSong);
router.post("/followArtist", auth, followArtist);

router.post(
  "/uploadAvatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const imgUrl = req.file?.location; // Get the S3 URL of the uploaded image
      res.json({ message: "Avatar uploaded successfully", url: imgUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload avatar", error });
    }
  }
);

router.put("/:id", auth, updateUserProfile);

export default router;

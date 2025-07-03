import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
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
router.get("/:id", auth, getCurrentUser);

router.post("/toggleLike", auth, toggleLikedSong);
router.post("/followArtist", auth, followArtist);

router.put("/:id", updateUserProfile);


export default router;

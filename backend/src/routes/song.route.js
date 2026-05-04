import { Router } from "express";
import auth, { requireAuth } from "../middleware/auth.middleware.js";
import { songUpload } from "../lib/s3.js";

import {
  getAllSongs,
  getFeaturedSongs,
  getMadeForYouSongs,
  getTrendingSongs,
  addSong,
  deleteSong,
} from "../controllers/song.controller.js";

const router = Router();

router.get("/", auth, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);

router.post("/", auth, addSong);

router.post(
  "/admin/songs",
  auth,
  requireAuth,
  songUpload.fields([
    { name: "audioFile", maxCount: 1 },
    { name: "imageFile", maxCount: 1 },
  ]),
  addSong
);

router.delete("/admin/songs/:id", auth, requireAuth, deleteSong);

export default router;

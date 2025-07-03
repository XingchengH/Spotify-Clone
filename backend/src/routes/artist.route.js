import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { getAllArtists, getArtistById } from "../controllers/artist.controller.js";

const router = Router();

router.get("/", auth, getAllArtists);
router.get("/:artistId", getArtistById);

export default router;

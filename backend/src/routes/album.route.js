import { Router } from "express";
import { getAlbumById, getAllAlbums } from "../controllers/album.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", auth, getAllAlbums);
router.get("/:albumId", getAlbumById);

export default router;

import { Router } from "express";
import {
  addAlbum,
  deleteAlbum,
  getAlbumById,
  getAllAlbums,
} from "../controllers/album.controller.js";
import auth from "../middleware/auth.middleware.js";
import { albumUpload } from "../lib/s3.js";

const router = Router();

router.get("/", auth, getAllAlbums);
router.get("/:albumId", getAlbumById);

router.post("/admin/albums", auth, albumUpload.single("albumImg"), addAlbum);
router.delete("/admin/albums/:albumId", auth, deleteAlbum);

export default router;

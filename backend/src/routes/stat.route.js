import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { getStats } from "../controllers/stat.controller.js";

const router = Router();

router.get("/", auth, getStats);

export default router;

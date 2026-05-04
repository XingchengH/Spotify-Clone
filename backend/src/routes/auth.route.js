import { Router } from "express";
import { register, login, me, logout } from "../controllers/auth.controller.js";
import { rateLimitAuth } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.post("/register", rateLimitAuth, register);
router.post("/login", rateLimitAuth, login);
router.get("/me", me);
router.post("/logout", logout);

export default router;

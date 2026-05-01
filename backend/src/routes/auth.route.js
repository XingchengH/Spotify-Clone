import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { rateLimitAuth } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.post("/register", rateLimitAuth, register);
router.post("/login", rateLimitAuth, login);

export default router;

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "../backend/src/routes/user.route.js";
import authRoute from "../backend/src/routes/auth.route.js";
import songRoutes from "../backend/src/routes/song.route.js";
import albumRoutes from "../backend/src/routes/album.route.js";
import artistRoutes from "../backend/src/routes/artist.route.js";
import statRoutes from "../backend/src/routes/stat.route.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoute);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/stats", statRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
});

export default app;

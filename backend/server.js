import express from "express";
import cors from "cors"; // cross origin access since current using two different port
import dotenv from "dotenv";
import userRoutes from "../backend/src/routes/user.route.js";
import authRoute from "../backend/src/routes/auth.route.js";
import songRoutes from "../backend/src/routes/song.route.js";
import albumRoutes from "../backend/src/routes/album.route.js";
import artistRoutes from "../backend/src/routes/artist.route.js";
import statRoutes from "../backend/src/routes/stat.route.js";
import { connectDB } from "./src/lib/db.js";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json()); // allow prase body info

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoute);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/stats", statRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});

export default app;

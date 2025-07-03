import express from "express";
import cors from "cors"; // cross origin access since current using two different port
import dotenv from "dotenv";
import { connectDB } from "./src/lib/db.js";
dotenv.config();

import userRoutes from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import albumRoutes from "./src/routes/album.route.js";
import songRoutes from "./src/routes/song.route.js";
import artistRoutes from "./src/routes/artist.route.js";
import statRoutes from "./src/routes/stat.route.js";

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

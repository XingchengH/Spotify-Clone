import dotenv from "dotenv";
import { connectDB } from "./src/lib/db.js";
import app from "./app.js";

dotenv.config();


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
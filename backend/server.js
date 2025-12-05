import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import skillRoutes from "./routes/skills.js";

dotenv.config();

const app = express();
app.use(express.json());

// CORS - allow your frontend origin (set FRONTEND_URL in Render)
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true
}));

// Connect to DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);

// Default
app.get("/", (req, res) => res.send("SkillForge backend running"));

// Start server
const PORT = process.env.PORT || process.env.port || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

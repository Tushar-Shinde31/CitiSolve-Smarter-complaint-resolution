import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

const _dirname = path.resolve();

// Middleware setup (e.g., body parsing, CORS)
const corsOptions = {
  origin: 'https://citisolve-smarter-complaint-resolution.onrender.com',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.) to be sent
}
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Route definitions
app.use("/api/complaints", complaintRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use(errorHandler);

app.use(express.static(path.join(_dirname, "frontend/dist")));
app.get("/*splat", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

// Start the server and listen on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

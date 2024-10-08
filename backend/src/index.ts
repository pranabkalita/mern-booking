import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import path from "path";

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING as string);

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Serve static files from the dist directory
const staticPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(staticPath));

// Add a catch-all route to serve index.html for all other requests
app.get("*", (req: Request, res: Response) => {
  const indexPath = path.join(staticPath, "index.html");
  res.sendFile(indexPath);
});

app.listen(7000, () => {
  console.log("Server running on localhost:7000");
});

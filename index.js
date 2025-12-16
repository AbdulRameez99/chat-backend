import express from "express";
import dotenv from "dotenv"; 
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./socket/socket.js";

dotenv.config({});

const PORT = process.env.PORT || 5000;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ FINAL CORRECT CORS CONFIG
app.use(
  cors({
    origin: "https://chat-frontend.vercel.app", // 🔥 EXACT Vercel URL
    credentials: true
  })
);

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// start server
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});

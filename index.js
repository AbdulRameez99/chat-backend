import express from "express";
import dotenv from "dotenv";
import http from "http";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { initSocket } from "./socket/socket.js";

dotenv.config({});

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ FINAL CORRECT CORS
app.use(
  cors({
    origin: "https://chat-frontend.vercel.app", // EXACT Vercel URL
    credentials: true
  })
);

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// init socket
initSocket(server);

// start server
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});

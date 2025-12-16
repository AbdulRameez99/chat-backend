import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// store userId -> socketId
const userSocketMap = {};

const io = new Server(server, {
  cors: {
    origin: true,           // ✅ allow Vercel + localhost
    methods: ["GET", "POST"],
    credentials: true
  }
});

// helper function
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// socket connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // send online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };

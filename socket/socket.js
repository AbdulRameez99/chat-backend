import { Server } from "socket.io";

// store userId -> socketId
const userSocketMap = {};

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://chat-frontend.vercel.app", // 🔥 EXACT VERCEL URL
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export { io };

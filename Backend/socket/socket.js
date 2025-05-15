import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
const app = express();
const server = createServer(app);
import Message from "../Models/message.Model.js";

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true, //headers and cookie
  },
  pingTimeout: 60000, //60seconda
  pingInterval: 25000, //25 seconds
});

let onlineUsers = 0;

console.log("Socket.io initialized");

const users = new Set();

io.on("connection", (socket) => {
  onlineUsers++;
  console.log("A user connected", socket.id, onlineUsers);

  socket.on("userConnected", (userId) => {
    users.add(userId);
    io.emit("userCount",users.size)
  });

  // Join a room
  socket.on("joinRoom", (roomIds) => {
    if (Array.isArray(roomIds) && roomIds.length > 0) {
      socket.join(roomIds); // Join all rooms at once

      // Get and log user count for each room
      roomIds.forEach((roomId) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        // Notify others in the room
        const count = room ? room.size : 0;
        console.log(`Room ${roomId} has ${count} users`);
        io.to(roomId).emit("roomUserCount", { roomId, count });
      });
    } else {
      console.error("Invalid roomIds:", roomIds);
    }
  });

  // Send message to the room
  socket.on("chat", async ({ roomId, message, sender }) => {
    if (roomId && message) {
      io.to(roomId).emit("chat", {
        message,
        roomId,
        sender,
        time: new Date(),
      });
      // Save the message to the database
      const newMessage = await Message.create({
        chatId: roomId,
        content: message,
        sender: sender,
      });
      // io.to(roomId).emit("chat", newMessage); // Send saved message to clients
      // console.log(`Message sent to room ${roomId}: ${message}`);
    } else {
      console.error("Missing roomId or message");
    }
  });

  //Handle disconnection
  socket.on("disconnect", () => {
    onlineUsers--;
    console.log("A user disconnected", socket.id, onlineUsers);
    io.emit("userCount", onlineUsers);
  });
});

export { app, server, express, io };

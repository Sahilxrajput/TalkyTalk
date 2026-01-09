require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Message = require("../Models/message.Model");

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, //headers and cookie
  },
  pingTimeout: 60000, //60seconda
  pingInterval: 25000, //25 seconds
  transports: ["websocket"],
});

io.on("connection", (socket) => {
  // console.log("A user connected", socket.id);

  socket.on("userConnected", (userId) => {
    // console.log("userId:", userId);
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
        // console.log(`Room ${roomId} has ${count} users`);
        io.to(roomId).emit("roomUserCount", { roomId, count });
      });
    } else {
      console.error("Invalid roomIds:", roomIds);
    }
  });

  // Send message to the room
  socket.on("chat", async ({ roomId, message, sender, replyTo }) => {
    if (roomId && message) {
      let repliedMessage = null;
      if (replyTo) {
        try {
          repliedMessage = await Message.findById(replyTo).lean();
        } catch (err) {
          console.error("Error fetching replied message:", err);
        }
      }

      io.to(roomId).emit("chat", {
        message,
        roomId,
        sender,
        time: new Date(),
        replyTo: repliedMessage,
      });

      const newMessage = await Message.create({
        chatId: roomId,
        content: message,
        sender: sender,
        replyTo: replyTo || null,
        time: new Date(),
      });
    } else {
      console.error("Missing roomId or message");
    }
  });

  socket.on("call-user", (data) => {
    io.to(data.to).emit("incoming-call", {
      from: socket.id,
      offer: data.offer,
    });
  });

  socket.on("answer-call", (data) => {
    io.to(data.to).emit("call-accepted", {
      answer: data.answer,
    });
  });

  socket.on("reject-call", (data) => {
    io.to(data.to).emit("call-rejected");
  });

  socket.on("send-candidate", (data) => {
    io.to(data.to).emit("receive-candidate", {
      candidate: data.candidate,
    });
  });

  socket.on("register", (id) => {
    socket.join(id);
  });

  //Handle disconnection

  socket.on("disconnect", () => {
    // console.log("A user disconnected", socket.id);
    io.emit("userCount");
  });
});

module.exports = { app, server, express };

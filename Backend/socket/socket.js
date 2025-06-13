import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
const app = express();
const server = createServer(app);
import Message from "../Models/message.Model.js";

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, //headers and cookie
  },
  pingTimeout: 60000, //60seconda
  pingInterval: 25000, //25 seconds
  transports: ["websocket"],
});

console.log("Socket.io initialized");

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("userConnected", (userId) => {
    console.log("userId:", userId);
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
      console.log("newMessage :", newMessage);
    } else {
      console.error("Missing roomId or message");
    }
  });

  socket.on("connect_error", (err) => {
    socket.io.on("error", (err) => {
      console.error("💥 io error:", err);
    });

    socket.on("error", (err) => {
      console.error("💥 socket error:", err);
    });
  });

  //   socket.on('offer', ({ roomId, offer }) => {
  //   socket.to(roomId).emit('offer', offer);
  // });

  // socket.on('answer', ({ roomId, answer }) => {
  //   socket.to(roomId).emit('answer', answer);
  // });

  // socket.on('candidate', ({ roomId, candidate }) => {
  //   socket.to(roomId).emit('candidate', candidate);
  // });

  // socket.on("offer", (data) => socket.broadcast.emit("offer", data));
  // socket.on("answer", (data) => socket.broadcast.emit("answer", data));
  // socket.on("candidate", (data) => socket.broadcast.emit("candidate", data));

  //Handle disconnection

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    io.emit("userCount");
  });
});

export { app, server, express, io };

import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true, //headers and cookie
    },
    pingTimeout: 60000, //60seconda
    pingInterval: 25000, //25 seconds
})

console.log("Socket.io initialized");

io.on('connection', (socket) => {
  console.log("A user connected", socket.id);

  // Join a room
  socket.on('joinRoom', (roomIds) => {
    if (Array.isArray(roomIds)) { // Check if roomIds is an array
      roomIds.forEach((roomId) => {
        console.log('====================================');
        console.log("roomId", roomId);
        console.log('====================================');
        if (roomId && roomId._id) { // Ensure each room object has the _id property
          socket.join(roomId._id);
          console.log(`${socket.id} joined room: ${roomId._id}`);
        } else {
          console.error('Invalid room object', roomId);
        }
      });
    } else {
      console.error('Expected roomIds to be an array, but received:', roomIds);
    }
  
  
      // Send message to the room
      socket.on('groupChat', ({ roomName, message }) => {
        io.to(roomName).emit('groupChat', message);
      });
      // Notify others in the room
    //   socket.to(roomName).emit('message', `${socket.id} has joined the room.`);
    // });
  
  // Handle incoming chat message
  socket.on('chat', (payload) => {
    io.emit('chat', payload); // Broadcast to all including sender
    //socket.broadcast.emit("chat", payload);
  });




  //Handle disconnection
  socket.on('disconnect', () => {
    console.log("A user disconnected", socket.id);
  });
  // Closing the connection block
  });
});





export {app, server, express, io};
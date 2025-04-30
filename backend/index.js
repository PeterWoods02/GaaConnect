import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; 
import teamRouter from './api/team/index.js';
import statisticsRouter from './api/statistics/index.js';
import matchRouter from './api/match/index.js';
import userRouter from './api/user/index.js';
import eventRouter from './api/event/index.js';
import inviteRoutes from './api/invites/index.js';
import messageRouter from './api/message/index.js';
import './db/index.js';
import { Server } from 'socket.io';
import authRoutes from './api/user/authRoutes.js';
import Message from './api/message/messageModel.js';

dotenv.config();

const app = express();
const port = process.env.PORT; 


// Create HTTP server using the express app
const server = http.createServer(app);

// Initialize Socket.io with the HTTP server
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for now; restrict as needed
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

// WebSocket connection setup
io.on('connection', (socket) => {
  console.log('New WebSocket connection established');

  socket.on('joinMatchRoom', (matchId) => {
    console.log(`Socket ${socket.id} joined room for match ${matchId}`);
    socket.join(matchId);
  });

  // Optional: leave room if needed
  socket.on('leaveMatchRoom', (matchId) => {
    console.log(`Socket ${socket.id} left room for match ${matchId}`);
    socket.leave(matchId);
  });
  
  // Listen for admin actions (like goal, card, substitution)
  socket.on('adminAction', (actionData) => {
    // Emit the action to all connected clients
    if (actionData.id) {
      io.to(actionData.id).emit('matchUpdate', actionData);
    } else {
      console.log('Action missing matchId');
    }
  });


  // join personal message room
  socket.on('joinMessagingRoom', (userId) => {
    socket.join(userId);
    console.log(`${userId} joined messaging room`);
  });

  socket.on('sendMessage', async ({ sender, recipient, body }) => {
    try {
      console.log('Received message from socket:', { sender, recipient, body });
  
      const message = new Message({ sender, recipient, body });
      const saved = await message.save();
  
      const populatedMessage = await Message.findById(saved._id).populate('sender', 'name _id');
  
      console.log('sending message to recipient:', recipient);
      io.to(recipient).emit('receiveMessage', populatedMessage);
  
      console.log('sending message to sender:', sender);
      io.to(sender).emit('receiveMessage', populatedMessage);
    } catch (err) {
      console.error('error in sendMessage:', err.message);
    }
  });

  // leave room 
  socket.on('leaveMessagingRoom', (userId) => {
    socket.leave(userId);
    console.log(`${userId} left messaging room`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/team', teamRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/match', matchRouter);
app.use('/api/event', eventRouter);
app.use('/api/auth', authRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/message', messageRouter);
app.use('/uploads', express.static('public/uploads'));

if (process.env.NODE_ENV !== 'test') {
  server.listen(port, () => {
    console.info(`Server running at ${port}`);
  });
}

export default app;
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; 
import teamRouter from './api/team/index.js';
import statisticsRouter from './api/statistics/index.js';
import matchRouter from './api/match/index.js';
import userRouter from './api/user/index.js';
import eventRouter from './api/event/index.js';
import './db/index.js';
import { Server } from 'socket.io';
import authRoutes from './api/user/authRoutes.js';

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
  socket.on('admin-action', (actionData) => {
    console.log('Admin action received:', actionData);
    // Emit the action to all connected clients
    io.emit('match-update', actionData);
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

server.listen(port, () => {
    console.info(`Server running at ${port}`);
  });
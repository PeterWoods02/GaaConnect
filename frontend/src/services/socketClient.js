import { io } from 'socket.io-client';

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io('http://localhost:8080');
  }
};

export const joinUserRoom = (userId) => {
  if (!socket) connectSocket();
  socket.emit('joinMessagingRoom', userId);
};

export const sendAdminAction = (action) => {
  if (!socket) return;
  socket.emit('adminAction', action);
};

export const listenToMatchUpdates = (matchId, callback) => {
  if (!socket) connectSocket();

  socket.emit('joinMatchRoom', matchId);

  const wrappedCallback = (action) => {
    if (typeof action === 'string') {
      callback({ type: action });
    } else if (action?.type) {
      callback(action);
    }
  };

  socket.on('matchUpdate', wrappedCallback);
  socket.on('eventUpdate', wrappedCallback);

  return () => {
    socket.emit('leaveMatchRoom', matchId);
    socket.off('matchUpdate', wrappedCallback);
    socket.off('eventUpdate', wrappedCallback);
  };
};

// listen for messages sent to the user
export const listenToUserMessages = (callback) => {
  if (!socket) connectSocket();
  socket.on('receiveMessage', callback);
};

//stop listening
export const leaveUserRoom = (userId) => {
  if (!socket) return;
  socket.emit('leaveMessagingRoom', userId);
};

export default socket;

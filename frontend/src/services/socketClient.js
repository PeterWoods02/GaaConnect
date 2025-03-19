import io from 'socket.io-client';

let socket;

export const connectSocket = () => {
  socket = io('http://localhost:8080');
};

export const sendAdminAction = (action) => {
  if (!socket) return;
  socket.emit('adminAction', action);
};

export const listenToMatchUpdates = (matchId, callback) => {
  if (!socket) connectSocket();

  socket.emit('joinMatchRoom', matchId);

  socket.on('matchUpdate', callback);

  return () => {
    socket.emit('leaveMatchRoom', matchId);
    socket.off('matchUpdate', callback);
  };
};

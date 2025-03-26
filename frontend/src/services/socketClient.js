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

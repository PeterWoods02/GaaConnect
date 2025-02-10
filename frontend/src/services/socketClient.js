import io from 'socket.io-client';

// Initialize WebSocket connection
const socket = io('http://localhost:8080');  

// Listen for live updates like score and events
socket.on('live-update', (updateData) => {
  console.log('Live Update:', updateData);
  // dispatch a  call a state setter here to update UI
});

// Listen for match events (goals, cards, etc.)
socket.on('match-update', (actionData) => {
  console.log('Admin action received:', actionData);
  // Update the UI with new data (e.g., show goal celebrations)
});

// expose functions to send data from the frontend to the backend
const sendAdminAction = (actionData) => {
  socket.emit('admin-action', actionData);
};

export { sendAdminAction };

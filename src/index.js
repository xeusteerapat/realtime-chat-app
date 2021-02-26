const express = require('express');
const http = require('http');
const socketio = require('socket.io');
require('colors');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

io.on('connection', socket => {
  console.log('New connection...'.brightCyan);

  socket.emit('message', 'Welcome');
  socket.broadcast.emit('message', 'New user has joined... 😆');

  socket.on('sendMessage', message => {
    io.emit('message', message);
  });

  socket.on('sendLocation', location => {
    io.emit(
      'message',
      `https://google.com/maps?q=${location.latitude},${location.longitude}`
    );
  });

  socket.on('disconnect', () => {
    io.emit('message', 'User has left... 😭');
  });
});

server.listen(3000, () => {
  console.log(`Server on port 3000`);
});

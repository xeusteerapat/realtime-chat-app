const express = require('express');
const http = require('http');
const Filter = require('bad-words');
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

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed');
    }

    io.emit('message', message);
    callback();
  });

  socket.on('sendLocation', (location, callback) => {
    io.emit(
      'message',
      `https://google.com/maps?q=${location.latitude},${location.longitude}`
    );

    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', 'User has left... 😭');
  });
});

server.listen(3000, () => {
  console.log(`Server on port 3000`);
});

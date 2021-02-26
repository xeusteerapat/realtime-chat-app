const express = require('express');
const http = require('http');
const Filter = require('bad-words');
const socketio = require('socket.io');
const {
  generateMessage,
  generateLocationMessage,
} = require('./utils/messages');
require('colors');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

io.on('connection', socket => {
  console.log('New connection...'.brightCyan);

  socket.on('join', ({ username, room }) => {
    socket.join(room);

    socket.emit('message', generateMessage('Welcome to the Club.'));
    socket.broadcast
      .to(room)
      .emit('message', generateMessage(`${username} has joined... 😆`));
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed');
    }

    io.to('BKK').emit('message', generateMessage(message));
    callback();
  });

  socket.on('sendLocation', (location, callback) => {
    io.emit(
      'locationMessage',
      generateLocationMessage(
        `https://google.com/maps?q=${location.latitude},${location.longitude}`
      )
    );

    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('User has left... 😭'));
  });
});

server.listen(3000, () => {
  console.log(`Server on port 3000`);
});

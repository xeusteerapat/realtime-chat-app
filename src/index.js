const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

io.on('connection', () => {
  console.log('New socket connected...');
});

server.listen(3000, () => {
  console.log(`Server on port 3000`);
});

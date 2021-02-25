const socket = io();

socket.on('message', message => {
  console.log('Message from server: ', message);
});

document.querySelector('#message').addEventListener('submit', e => {
  e.preventDefault();

  const message = e.target.elements.message.value;
  socket.emit('message', message);
});

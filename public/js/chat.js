const socket = io();

socket.on('message', message => {
  console.log(message);
});

document.querySelector('#message').addEventListener('submit', e => {
  e.preventDefault();

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, error => {
    if (error) {
      return console.log(error);
    }

    console.log('Message Delivered');
  });
});

document.getElementById('send-location').addEventListener('click', e => {
  if (!navigator.geolocation) {
    return alert('Your browser does not support Geolocation.');
  }

  navigator.geolocation.getCurrentPosition(position => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    socket.emit('sendLocation', location, error => {
      if (error) {
        return console.log(error);
      }

      console.log('Location shared');
    });
  });
});

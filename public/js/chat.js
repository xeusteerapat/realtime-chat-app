const socket = io();

const messageForm = document.getElementById('message-form');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');
const sendLocationButton = document.getElementById('send-location');
const messages = document.getElementById('messages');

// Templates
const messageTemplate = document.getElementById('message-template').innerHTML;
const locationMessageTemplate = document.getElementById(
  'location-message-template'
).innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on('message', message => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm: a'),
  });

  messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', locationMessage => {
  const html = Mustache.render(locationMessageTemplate, {
    username: locationMessage.username,
    url: locationMessage.url,
    createdAt: moment(locationMessage.createdAt).format('h:mm: a'),
  });

  messages.insertAdjacentHTML('beforeend', html);
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();

  // Disabled btn after sent message
  messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, error => {
    // Re-enable btn
    messageFormButton.removeAttribute('disabled');
    messageFormInput.value = '';
    messageFormInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log('Message Delivered');
  });
});

sendLocationButton.addEventListener('click', e => {
  if (!navigator.geolocation) {
    return alert('Your browser does not support Geolocation.');
  }

  sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(position => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    socket.emit('sendLocation', location, error => {
      sendLocationButton.removeAttribute('disabled');

      if (error) {
        return console.log(error);
      }

      console.log('Location shared');
    });
  });
});

socket.emit('join', { username, room }, error => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});

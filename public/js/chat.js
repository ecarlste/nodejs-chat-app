const socket = io();

const $chatForm = document.querySelector('#chat-form');
const $chatFormInput = $chatForm.querySelector('input');
const $chatFormButton = $chatForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message', ({ text, createdAt, username }) => {
  const html = Mustache.render(messageTemplate, {
    username,
    message: text,
    createdAt: formatTime(createdAt)
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', ({ url, createdAt, username }) => {
  const html = Mustache.render(locationMessageTemplate, {
    username,
    url,
    createdAt: formatTime(createdAt)
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

$chatForm.addEventListener('submit', event => {
  event.preventDefault();
  $chatFormButton.setAttribute('disabled', 'disabled');

  const messageToSend = event.target.elements.message.value;

  socket.emit('sendMessage', messageToSend, () => {
    console.log('Message delivered!');
    $chatFormButton.removeAttribute('disabled');
    $chatFormInput.value = '';
    $chatFormInput.focus();
  });
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  $sidebar.innerHTML = html;
});

$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Your browser does not support geolocation');
  }

  $sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    socket.emit('sendLocation', { latitude, longitude }, () => {
      console.log('Location shared!');
      $sendLocationButton.removeAttribute('disabled');
    });
  });
});

socket.emit('join', { username, room }, error => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});

const formatTime = time => {
  return moment(time).format('h:mmA');
};

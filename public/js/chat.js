const socket = io();

const $chatForm = document.querySelector('#chat-form');
const $chatFormInput = $chatForm.querySelector('input');
const $chatFormButton = $chatForm.querySelector('button');

const $sendLocationButton = document.querySelector('#send-location');

socket.on('message', text => {
  console.log(text);
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

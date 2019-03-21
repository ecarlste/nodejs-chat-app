const socket = io();

socket.on('message', text => {
  console.log(text);
});

document.querySelector('#chat-form').addEventListener('submit', event => {
  event.preventDefault();

  const messageToSend = event.target.elements.message.value;

  socket.emit('sendMessage', messageToSend);
});

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Your browser does not support geolocation');
  }

  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    socket.emit('sendLocation', { latitude, longitude });
  });
});

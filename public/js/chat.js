const socket = io();

socket.on('message', text => {
  console.log(text);
});

document.querySelector('#chat-form').addEventListener('submit', event => {
  event.preventDefault();

  const messageToSend = document.querySelector('#chat-input').value;

  socket.emit('sendMessage', messageToSend);
});

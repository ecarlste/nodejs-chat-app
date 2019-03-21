const socket = io();

socket.on('message', text => {
  console.log(text);
});

document.querySelector('#chat-form').addEventListener('submit', event => {
  event.preventDefault();

  const messageToSend = event.target.elements.message.value;

  socket.emit('sendMessage', messageToSend);
});

const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New WebSocket connection');

  socket.on('join', ({ username, room }) => {
    socket.join(room);

    socket.emit('message', generateMessage('Welcome!'));
    socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined chat!`));

    // io.emit('message', generateMessage(message));
    // callback();
  });

  socket.on('sendMessage', (message, callback) => {
    io.to('LV426').emit('message', generateMessage(message));
    callback();
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    io.to('LV426').emit(
      'locationMessage',
      generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`)
    );
    callback();
  });

  socket.on('disconnect', () => {
    io.to('LV426').emit('message', generateMessage('A user has left.'));
  });
});

server.listen(port, () => {
  console.log(`Express server started. Listening on port ${port}`);
});

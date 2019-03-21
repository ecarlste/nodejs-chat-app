const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, getUser, getUsersInRoom, removeUser } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New WebSocket connection');

  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('message', generateMessage('admin', 'Welcome!'));
    socket.broadcast
      .to(user.room)
      .emit('message', generateMessage('admin', `${user.username} has joined chat!`));

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const { room, username } = getUser(socket.id);

    io.to(room).emit('message', generateMessage(username, message));
    callback();
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    const { room, username } = getUser(socket.id);

    io.to(room).emit(
      'locationMessage',
      generateLocationMessage(username, `https://google.com/maps?q=${latitude},${longitude}`)
    );
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', generateMessage('admin', `${user.username} has left chat.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Express server started. Listening on port ${port}`);
});

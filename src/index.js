const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

let count = 0;
io.on('connection', socket => {
  console.log('New WebSocket connection');

  socket.emit('countUpdated', count);

  socket.on('increment', () => {
    io.emit('countUpdated', ++count);
    console.log('incremented count to ' + count);
  });
});

server.listen(port, () => {
  console.log(`Express server started. Listening on port ${port}`);
});

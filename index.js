const express = require('express');
const http = require('http');
const { join } = require('path');

const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res, next) => {
  res.sendFile(join(__dirname, './index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected with socket id: ', socket.id);

  socket.on('chat message', (msg) => {
    console.log('message: ', msg);

    io.emit('send_message_to_all_users', msg);
  });
  socket.on('typing', () => {
    socket.broadcast.emit('show_typing_status');
  });
  socket.on('stopTyping', () => {
    socket.broadcast.emit('remove_typing_status');
  });
});

server.listen(3000, () => {
  console.log('server listen on port 3000');
});

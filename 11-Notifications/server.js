// backend/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const notificationRoutes = require('./routes/notificationRoutes');
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(bodyParser.json());
app.set('io', io);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

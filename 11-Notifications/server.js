
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const { authenticate } = require('./controllers/userController');
const pool = require('./config/db');


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
app.use('/api/users', userRoutes);
app.use('/api/notifications', authenticate, notificationRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('user-online', async (userId) => {
   
    try {
      await pool.query('UPDATE users SET online = true WHERE id = ?', [userId]);
      const [onlineUsers] = await pool.query('SELECT username FROM users WHERE online = true');
      io.emit('online-users', onlineUsers.map(user => user.username));
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('disconnect', async () => {
    try {
      const userId = socket.userId;
      if (userId) {
        await pool.query('UPDATE users SET online = false WHERE id = ?', [userId]);
        const [onlineUsers] = await pool.query('SELECT username FROM users WHERE online = true');
        io.emit('online-users', onlineUsers.map(user => user.username));
      }
      console.log('User disconnected');
    } catch (error) {
      console.error(error);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

/* io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
 */
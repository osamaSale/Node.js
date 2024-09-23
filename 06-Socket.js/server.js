const express = require('express');
const app = express();
const PORT = 4000;

//New imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let activeUsers = [];
//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    socket.on("new-user-add", (newUserId) => {
        if (!activeUsers.some((user) => user.id === newUserId)) {
            activeUsers.push({ userId: newUserId, socketId: socket.id });
        }
        socketIO?.emit("get-users", activeUsers);
    });

     socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        socketIO.emit("get-users", activeUsers);
    }); 
 
    socket.on("send-message", (data) => {
        const { receiverId } = data;
        const user = activeUsers.find((user) => user.userId === receiverId);
       if (user) {
            socketIO.to(user.socketId).emit("recieve-message", data);
        }
        
    }); 
});

http.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
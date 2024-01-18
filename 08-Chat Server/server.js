const express = require("express");
const cors = require("cors");
const app = express();
const http = require('http').Server(app);
const connection = require("./connection/mysql");
const router = require("./router/router");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use(router);
app.get('/', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "https://main--chatsapplication.netlify.app"
  }
});
let users = []
socketIO.on('connection', (socket) => {
  socket.on("online", (data) => {
    let sql = `select * from users where id='${data}'`
    connection.query(sql, (err, result) => {
      const user = result.find((e) => e.id);
    if (!users.some((user) => user.id === data)) {
        users.push({ userId: user.id, socketId: socket.id})
      }
      socket.emit('get-users', users)
    })
  });



  socket.on("disconnect", () => {
    users = users.filter((u) => u.socketId !== socket.id);
    socket.emit("get-users", users);

  });
})








http.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});


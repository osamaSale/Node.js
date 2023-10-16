const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http")
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/", (req, res) => {
    res.send("osama")
})
const server = http.createServer(app)
const PORT = process.env.PORT || 5000;

const io = require("socket.io")(server, {
    cors: {
        origin: "https://reactchatsapp.netlify.app",
    },
});
let activeUsers = [];

io.on("connection", (socket) => {
    socket.on("new-user-add", (newUserId) => {
        if (!activeUsers.some((user) => user.userId === newUserId)) {
            activeUsers.push({ userId: newUserId, socketId: socket.id });
        }
        io.emit("get-users", activeUsers);
    });

    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        io.emit("get-users", activeUsers);
    });

    socket.on("send-message", (data) => {
        const { receiverId } = data;
        const user = activeUsers.find((user) => user.userId === receiverId);
       if (user) {
            io.to(user.socketId).emit("recieve-message", data);
        }
    });
});


server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
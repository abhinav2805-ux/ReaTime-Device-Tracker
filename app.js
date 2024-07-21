const express = require('express');
const app = express();
const http = require('http');

const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const path = require('path');

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("New user connected", socket.id);

    // Handle location updates from clients
    socket.on('send-location', (location) => {
        console.log(`Location received from user ${socket.id}:`, location);
        io.emit('received-location', { id: socket.id, ...location });
    });

    // Handle user disconnections
    socket.on('disconnect', () => {
        console.log("User disconnected", socket.id);
        io.emit('user-disconnected', socket.id);
    });
});

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

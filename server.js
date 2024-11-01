const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for time sync events
    socket.on('syncTime', (data) => {
        socket.broadcast.emit('syncTime', data); // Broadcast the time to other clients
    });

    // Listen for pause events
    socket.on('pauseVideo', () => {
        socket.broadcast.emit('pauseVideo'); // Broadcast the pause event to other clients
    });

    // Listen for play events
    socket.on('playVideo', () => {
        socket.broadcast.emit('playVideo'); // Broadcast the play event to other clients
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});
 

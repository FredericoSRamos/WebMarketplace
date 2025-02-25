const socketIo = require('socket.io');

let io;

const setupSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:3004', 'http://localhost:5000'],
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
            credentials: true
        }
    });
};

const getIo = () => {
    return io;
};

module.exports = { setupSocket, getIo };
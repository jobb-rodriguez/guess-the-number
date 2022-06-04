const http = require('http');
const io = require('socket.io');
const api = require('./api');

const httpServer = http.createServer(api);
const socketServer = io(httpServer);

const sockets = require('./sockets')

const PORT = 3000;

httpServer.listen(PORT);
console.log(`Listening on port ${PORT}...`);

sockets.listen(socketServer); 
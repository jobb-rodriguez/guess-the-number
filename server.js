const http = require('http');
const io = require('socket.io');
// const api = require('./api');

const httpServer = http.createServer();
const socketServer = io(httpServer);

// const sockets = require('./sockets')

const PORT = 3000;

let readyPlayerCount = 0;
let numberToGuess = -1;

httpServer.listen(PORT);
console.log(`Listening on port ${PORT}...`);

// sockets.listen(socketServer); 

function listen(io) {
    io.on('connection', (socket) => {
        console.log(`a user connected: ${socket.id}`)

        socket.on('ready', () => {
            console.log(`Player ready: ${socket.id}`);
        })
        readyPlayerCount++;
        if (readyPlayerCount % 2 == 0) {
            numberToGuess = Math.floor(Math.random() * 1001);
            console.log(numberToGuess);
            io.emit('startGame');
        }

        socket.on('guessNumber', (guess) => {
            console.log('guess received', guess, numberToGuess);
            // -1: lower; 0: higher; 1: correct
            let status = -1;
            if (guess === numberToGuess) {
                status = 1;
            } else if (guess < numberToGuess) {
                status = 0;
            }
            if (status === 1) {
                io.emit('correctGuess', socket.id);
            } else {
                io.to(socket.id).emit('incorrectGuess', status);
            }
        })

        socket.on('disconnect', (reason) => {
            console.log(`${socket.id} disconnected due to ${reason}`);
        })
    });
}

listen(socketServer);
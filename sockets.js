let readyPlayerCount = 0;
let numberToGuess = {};

function listen(io) {
    io.on('connection', (socket) => {
        let room = 'room' + Math.floor(readyPlayerCount / 2);
        console.log(`a user connected: ${socket.id}`)

        socket.on('ready', () => {
            socket.join(room);
            console.log(`Player ready: ${socket.id}`);

            readyPlayerCount++;
            if (readyPlayerCount % 2 == 0) {
                numberToGuess[room] = Math.floor(Math.random() * 1001);
                console.log(numberToGuess[room]);
                io.in(room).emit('startGame');
            }
        })

        socket.on('guessNumber', (guess) => {
            console.log('guess received', guess, numberToGuess[room]);
            // -1: lower; 0: higher; 1: correct
            let status = -1;
            if (guess === numberToGuess[room]) {
                status = 1;
            } else if (guess < numberToGuess[room]) {
                status = 0;
            }
            if (status === 1) {
                io.in(room).emit('correctGuess', socket.id);
            } else {
                io.to(socket.id).emit('incorrectGuess', status);
            }
        })

        socket.on('disconnect', (reason) => {
            console.log(`${socket.id} disconnected due to ${reason}`);
            socket.leave(room);
        })
    });
}

module.exports = {
    listen
}
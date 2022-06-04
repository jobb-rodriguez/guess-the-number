const socket = io('http://localhost:3000');
const app = Vue.createApp({
    data() {
        return {
            heading: 'Guess the Number',
            subheading: '',
            guess: '',
            message: 'Waiting for opponent...',
            placeholder: '...',
            isDisabled: true,
        }
    },
    methods: {
        startGame() {
            this.subheading = "Guess a number from 0 to 1000";
            this.placeholder = "Type here";
            this.message = '';
            this.isDisabled = false;
        },
        sendGuess() {
            console.log('guess sent!');
            this.guess = Number(this.guess);
            socket.emit('guessNumber', this.guess);
        },
        receiveResponse(status) {
            console.log('response received');
            if (status === 0) {
                this.subheading = "Guess higher";
                this.guess = '';
                this.placeholder = "Type here";
            } else {
                this.subheading = "Guess lower";
                this.guess = '';
                this.placeholder = "Type here";
            }
        },
        endGame(id) {
            console.log('winner found');
            if (id === socket.id) {
                this.subheading = "YOU WIN";
            } else {
                this.subheading = "YOU LOSE";
            }
            this.guess = '';
            this.message = "Refresh to restart the game";
            this.placeholder = "Thank you for playing!"
            this.isDisabled = true;
        }
    },
    mounted() {
        socket.on('connect', () => {
            console.log(socket.id);
            socket.emit('ready');
        });
        socket.on('startGame', () => {
            this.startGame();
        });
        socket.on('incorrectGuess', (status) => {
            this.receiveResponse(status);
        });
        socket.on('correctGuess', (id) => {
            this.endGame(id);
        });
    }
})

app.mount('#app')
// This is a function
// Need to fix CORS because client and server port are different
const io = require('socket.io')(3001, {
    cors: {
        // Give permission to access the server
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Communication for the client
io.on('connection', socket => {
    console.log("connected");
})
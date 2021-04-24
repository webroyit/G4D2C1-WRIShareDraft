const mongoose = require("mongoose");
const Document = require('./Document');

// Connect to MongoDB
mongoose.connect("mongodb+srv://<username>:<password>@cluster0.oy8wd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    // For backwards compatibility
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})

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
    // Put the socket into its own room
    socket.on("get-document", documentId => {
        const data = "";
        socket.join(documentId);
        socket.emit("load-document", data)

        socket.on('send-changes', delta => {
            // Send changes to everyone else expect itself
            socket.broadcast.to(documentId).emit("receive-changes", delta);
        })
    })
})
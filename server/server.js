const io = require('socket.io')(5000, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on('connection', socket => {
    console.log(socket.id)
    socket.on('right-answer', answerTime => {
        console.log('right answer', socket.id)
        socket.emit('congrats', answerTime);
        io.to('room1').emit('a', 'goiaba');
    });

    socket.on('name', username => {
        console.log('username', username, socket.id)
    });

    socket.on('join', () => {
        socket.join('room1');
        console.log('joined')
    })

    

    
    
});
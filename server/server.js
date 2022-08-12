import {Server} from 'socket.io';
import { expressionGenerator } from './utils.js';

const io = new Server(5000, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

let userCount = {}
let room = {players:[]};

io.on('connection', socket => {
    console.log(socket.id)
    socket.on('right-answer', answerTime => {
        socket.emit('congrats', answerTime);
        socket.emit('acertaram', 'nao foi vc');
    });

    // socket.on('name', username => {
    //     socket.emit('name', username);
    //     console.log('username', username, socket.id);
    // });

    socket.on('roomCreated', (data) => {
        // userCount[roomName] = userCount[roomName] ? userCount[roomName] + 1 : 1; 
        socket.join(data.roomName);
        userCount[data.roomName] = 1; 
        room['players'][0] = {playerName:data.playerName};
        room[data.roomName] = {roomCreator:socket.id};
        io.emit('newRoom', data.roomName);
        socket.emit('roomCreated', data.roomName);
        console.log(userCount[data.roomName], data.roomName, socket.id, data.playerName);
        // if(userCount[data.roomName] == 2) io.to(data.roomName).emit('startGame', "comecem os jogos");
    });

    socket.on('roomJoined', (data) => {
        socket.join(data.roomName);
        room['players'][userCount[data.roomName]] = {playerName:data.playerName};
        userCount[data.roomName] = userCount[data.roomName] + 1; 
        
        io.to(data.roomName).emit('players', room['players']);
    });

    socket.on('ready', (data) => {
        // console.log(data)
        const playerName = data.playerName;
        const isReady = data.isReady;
    
        io.to(data.roomName).emit('whoIsReady', {playerName, isReady});
        // if (room['players'].length === 2) {

        //     io.to(data.roomName).emit('setExpression', ) 
        // }
    })

    socket.on('expression', (info) => {
        if (room[info.roomName]?.roomCreator === socket.id) {
            const expression = expressionGenerator(info.numberOfOperations, info.level);
            console.log(expression);
            io.to(info.roomName).emit('setExpression', expression);
        }
    })
    // socket.on('shablau')
});
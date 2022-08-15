import {Server} from 'socket.io';
import { expressionGenerator } from './utils.js';
import {Room, Player} from './room.js';

const io = new Server(5000, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

let userCount = {};
let room = {};

io.on('connection', socket => {

    console.log(socket.id);
    socket.on('right-answer', data => {
        let question = data.question + 1;
        let winnerInfo;
        for (let p of room[data.roomName].getPlayers()) {
            if (p.playerName === data.playerName) {
                // p.points = ((p.points) + 100000/data.answerT) || 100000/data.answerT;
                p.setScore(data.answerT);
                // p.totalTimePassed = (p.totalTimePassed + data.answerT) || data.answerT;
                p.setTotalTimePlayed(data.answerT);
                // p.velocity = p.totalTimePassed / question;
                p.setVelocity(question);
                winnerInfo = p;
                break;
            }
        }
        // socket.emit('congrats', data.roomName);
        io.to(data.roomName).emit('updateInfo', winnerInfo);
    });

    socket.on('roomCreated', (data) => {
        socket.join(data.roomName);
        userCount[data.roomName] = 1; 
        // room[data.roomName] = {players:[]};
        room[data.roomName] = new Room(data.roomName, socket.id, 2);
        // room[data.roomName]['players'][0] = {playerName:data.playerName};
        room[data.roomName].addPlayer(new Player(data.playerName));
        console.log('here', room[data.roomName].getSize(), room[data.roomName].getPlayers());
        // room[data.roomName].roomCreator = socket.id;
        socket.emit('redirectToRoom', data.roomName);
        io.emit('newRoom', data.roomName);

        console.log(userCount[data.roomName], data.roomName, socket.id, data.playerName);
    });

    socket.on('roomJoined', (data) => {

        socket.join(data.roomName);
        // room[data.roomName]['players'][userCount[data.roomName]] = {playerName:data.playerName};
        room[data.roomName].addPlayer(new Player(data.playerName));
        console.log('here', room[data.roomName].getSize())
        // userCount[data.roomName] = userCount[data.roomName] + 1; 
        io.to(data.roomName).emit('players', room[data.roomName].getPlayers());

    });

    socket.on('ready', (data) => {
        const playerName = data.playerName;
        const isReady = data.isReady;

        io.to(data.roomName).emit('whoIsReady', {playerName, isReady});
    });

    socket.on('expression', (info) => {
        console.log("entrou aqui")
        if (room[info.roomName].getCreator() === socket.id) { //only room creator can request new expressions, to avoid multiple requests
            const expression = expressionGenerator(info.numberOfOperations, info.level);
            console.log(expression);

            io.to(info.roomName).emit('setExpression', expression);
        }
    });
    
});
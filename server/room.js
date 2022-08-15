class Room {
	constructor(roomName, creator, maxSize, password) {
		this.roomName = roomName;
		this.creator = creator;
		this.players = [];
		this.maxSize = maxSize;
		this.password = password;
	}
	getSize() {
		return this.players.length;
	}
	addPlayer(player) {
        console.log('size', this.getSize(), this.getPlayers())
		if (this.getSize() < this.maxSize) 
			this.players = [...this.players, player];
		else throw new Error('room is full!')
	}
    getCreator() {
        return this.creator;
    }
    getPlayers() {
        return this.players;
    }
}

class Player {
    constructor(playerName) {
        this.playerName = playerName;
    }
    setScore(answerTime) {
        this.points = 100000/answerTime + (this.points || 0);
    }
    setTotalTimePlayed(lastAnswerTime) {
        this.totalTimePlayed = lastAnswerTime + (this.totalTimePlayed || 0);
    }
    setVelocity(questions) {
        this.velocity = this.totalTimePlayed / questions;
    }
}

export {Room, Player};
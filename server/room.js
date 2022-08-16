class Room {
	constructor(roomName, creator, maxSize, password) {
		this.roomName = roomName;
		this.creator = creator;
		this.players = [];
		this.maxSize = maxSize;
		this.password = password;
        this.level = 0;
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
    setLevel(question) {
        const levelUp = question && question % 5 === 0; //if question is over 0 and multiple of 5...
        this.level = this.level + (levelUp && 1); // it levels up
    }
    getLevel() {
        return this.level;
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
'use strict'
var playerCore = require('./player.js');
const readline = require('readline');


module.exports = class playerAdapter{
	constructor(name,id){
		this._name = name;
		this._id = id;
		this.rl = readline.createInterface({
		  input: process.stdin,
		  output: process.stdout
		});
	};
	getInput(question,callback){
		this.rl.question(question,(answer)=>{
			callback(answer);
			this.rl.close();
			return;
		})
	};
}

// var pPlayer = new pseudoPlayer('dealer',1000,'dioug',12);

// pPlayer.getInput("THIS IS A TEST\n\nSOME NEW WSHIT");
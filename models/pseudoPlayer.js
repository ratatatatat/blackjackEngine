'use strict'
var playerCore = require('./player.js');
const readline = require('readline');


class pseudoPlayer{
	constructor(type,bankroll,name,id){
		this.player = new playerCore(type,bankroll,name,id);
		this.rl = readline.createInterface({
		  input: process.stdin,
		  output: process.stdout
		});
	};
	getInput(question){
		this.rl.question(question,(answer)=>{
			console.log(answer);
		})
	};
}

var pPlayer = new pseudoPlayer('dealer',1000,'dioug',12);

pPlayer.getInput("THIS IS A TEST\n\nSOME NEW WSHIT");
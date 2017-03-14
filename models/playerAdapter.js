'use strict'
var playerCore = require('./player.js');
var readline = require('readline');

module.exports = class playerAdapter{
	constructor(name,id){
		this._name = name;
		this._id = id;
	};
	getInput(quest,callback){
		this.rl = readline.createInterface({
				  input: process.stdin,
				  output: process.stdout
				});

		this.rl.question(quest,(answer)=>{
			console.log("Inside callbac for rl.question");
			callback(answer);
			// setTimeout(function(){
			// 	rl.pause();
			// },300);
			// rl.pause();
			// return;
		});
	};
	closeConnect(callback){
		this.rl.close();
		callback();
	};
}

// var pPlayer = new pseudoPlayer('dealer',1000,'dioug',12);

// pPlayer.getInput("THIS IS A TEST\n\nSOME NEW WSHIT");
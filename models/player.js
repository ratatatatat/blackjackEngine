'use strict'
var RSVP = require('rsvp');
var Bet = require('./bet.js');

class player{
	constructor(type,bankroll,name){
		this._bets = []; // Bets Array, A player can have multiple bets 
		this._bankRoll = bankroll; // Player's initial bankroll
		this._name = name; //Player's name
		this._id = id; //player's id
	};
	createBet(betSize){
		var betId = this._bets.length;
		var newBet = new Bet(betSize,betId,'regular')
		this._bets.push(newBet);
	};

	//Actions:
	//	-Hit
	//	-Stand
	//	-Surrender
	//	-Split
	//	-Double Down
	//All These Functions Are Related To Getting Count Values
	payPlayer(pot){
		this._bankRoll = this._bankRoll + pot;
	}
	/// End of Count Functions
};

var dealer = new player('dealer',0);
var handArray = [{'name':'K'},{'name':'3'},{'name':'A'},{'name':'A'}];
handArray.forEach(function(element,index){
	dealer.hit(element,function(){
		var count = dealer.getCount();
		console.log("count: ", count);		
	});

});
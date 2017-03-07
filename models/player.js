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
	createBet(betSize,betType){
		var betId = this._bets.length;
		var newBet = new Bet(betSize,betId,betType);
		this._bets.push(newBet);
	};
	setActions(actionsArray){
		this._betActions = actionsArray;
	};
	getBets(){
		return this._bets;
	};
	getOneBet(betId){
		for (var i = = 0; i < this._bets.length; i++) {
			if(this._bets[i] == betId){
				return this._bets[i];
			}
		};
	};
	setBetActions(betId,betActions){
		this._bets.forEach(function(element,index){
			if(element['_id'] == betId){
				element.setActions(betActions);
			}
		}.bind(this));
	};
	//Actions:
	//	-Hit
	//	-Stand
	//	-Surrender
	//	-Split
	//	-Double Down
	payPlayer(pot){
		this._bankRoll = this._bankRoll + pot;
	};
};

var dealer = new player('dealer',0);
var handArray = [{'name':'K'},{'name':'3'},{'name':'A'},{'name':'A'}];
handArray.forEach(function(element,index){
	dealer.hit(element,function(){
		var count = dealer.getCount();
		console.log("count: ", count);		
	});

});
'use strict'
var RSVP = require('rsvp');
var Bet = require('./bet.js');
var playerAdapter = require('./playerAdapter.js');

module.exports = class player{
	constructor(type,bankroll,name,id){
		this._type = type;
		this._bets = []; // Bets Array, A player can have multiple bets 
		this._splitBets = [];// Split Bets Array. 
		this._bankRoll = bankroll; // Player's initial bankroll
		this._name = name; //Player's name
		this._id = id; //player's id
		this._playerAdapter = new playerAdapter(name,id);
	};
	createBet(betSize,betType){
		var betId = this._bets.length;
		var newBet = new Bet(betSize,betId,betType);
		this._bets.push(newBet);
	};
	createSplitBet(bet,callback){
		//Pass in the bet
		//Set Bet status to dead;
		bet.setStatus('dead');
		var wager = bet._bet;
		var origHand = bet._hand.getHand();
		var firstHand = origHand[0];
		var secondHand = origHand[1];
		var betType = 'split';
		var origBetId = bet._id;
		var firstSplit = new Bet(wager,origBetId,betType);
		firstSplit._hand.addCard(firstHand,function(){

		});
		var secondSplit = new Bet(wager,origBetId,betType);
		secondSplit._hand.addCard(secondHand,function(){

		});
		var splitObj = {
			'id': origBetId,
			'splits': [firstSplit,secondSplit]
		};
		this._splitBets.push(splitObj);
		//Callbacks the original betId for easy reference;
		callback(origBetId);
	};
	getSplitBet(betId,callback){
		this._splitBets.forEach(function(element){
			if(element['id'] == betId){
				callback(element);
			};
		});
	};
	setActions(actionsArray){
		this._betActions = actionsArray;
	};
	getBets(){
		return this._bets;
	};
	getOneBet(betId){
		for (var i = 0; i < this._bets.length; i++) {
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
	//Communication Connection
};

// var dealer = new player('dealer',0);
// var handArray = [{'name':'K'},{'name':'3'},{'name':'A'},{'name':'A'}];
// handArray.forEach(function(element,index){
// 	dealer.hit(element,function(){
// 		var count = dealer.getCount();
// 		console.log("count: ", count);		
// 	});

// });
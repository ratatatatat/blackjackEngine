'use strict'
var RSVP = require('rsvp');
var Hand = require('./hand.js');
// var hand = new Hand();

module.exports = class bet{
	constructor(betSize,_id,type){
		console.log("Constructor gets called");
		this._bet = betSize;
		this._id = _id;
		this._type = type;//regular,double-down,split
		this._status = 'live' // can be live, stand, blackjack, bust, won, lost, dead
		this._doubled = false;
		this._hand = new Hand();
		this._isDoubled = false;
	};
	setActions(betActions){
		this._actions = betActions; //An array of possible actions
	};
	setStatus(status){
		console.log("should be setting the following status: ", status);
		this._status = status;
	};
	getActions(){		
		return this._actions;
	};
	getBetSize(){
		return this._bet;
	};
	hitHand(card,callback){
		this._hand.addCard(card,callback);
	};
	getScore(){
		return this._hand.getCount();
	};
	getHand(){
		return this._hand.getHand();
	};
	getHandObj(){
		return this._hand;
	};
	doubleDown(callback){
		this._bet = 2 * this._bet;
		this._isDoubled = true;
		callback();
	};
};




// var Bet = new bet(45,1,'regular');
// Bet.hitHand({'name':'A'},function(){
// 	console.log(Bet.getScore());
// });
// console.log("betId",Bet._id);
// console.log(Bet.getBetSize());
// setTimeout(function(){
// 	Bet.hitHand({'name':'10'},function(){
// 		console.log(Bet.getScore());
// 	});
// },1000);
// setTimeout(function(){
// 	console.log(Bet.getHand());
// },3000);
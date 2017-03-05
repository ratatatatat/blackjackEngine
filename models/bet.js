'use strict'
var RSVP = require('rsvp');
var Hand = require('./hand.js');
// var hand = new Hand();

class bet{
	constructor(betSize){
		console.log("Constructor gets called");
		this._bet = betSize;
		this._hand = new Hand();
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
	}
};

var Bet = new bet(45);
Bet.hitHand({'name':'A'},function(){
	console.log(Bet.getScore());
});
console.log(Bet.getBetSize());
setTimeout(function(){
	Bet.hitHand({'name':'10'},function(){
		console.log(Bet.getScore());
	});
},1000);
setTimeout(function(){
	console.log(Bet.getHand());
},3000);
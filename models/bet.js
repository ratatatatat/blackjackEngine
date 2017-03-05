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
	};
	doubleDown(){
		this._bet = 2 * this._bet;
		this._type = 'double-down';
	};
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
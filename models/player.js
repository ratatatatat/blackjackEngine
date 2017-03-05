'use strict'
var RSVP = require('rsvp');



class player{
	constructor(type,bankroll){
		// Id
		// Name
		//A player has a bankroll and
		// can place bets 
		// and perform actions on those bets
	};
	//Actions:
	//	-Hit
	//	-Stand
	//	-Surrender
	//	-Split
	//	-Double Down
	//	-Split
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
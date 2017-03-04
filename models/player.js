'use strict'
var RSVP = require('rsvp');



class player{
	constructor(type,bankroll){
		this._type = type;
		this._hands = 0
		this._handCards = []
		this._count = 0 // Base Count
		this._altCount = 0 // Only Update in presence of 'A'
		if(type == 'dealer'){
			this._bankroll = bankroll;
		}
	};
	hit(card){
		this._handCards.push(card);
	};
	getCount(callback){
		var handObj = player._seperateCards(this._handCards);
		player._makeCount(handObj,callback);
	};
	static _seperateCards(handArray){
		var aceArray = [];
		var nonAceArray = [];
		handArray.forEach(function(card){
			if(card.name == 'A'){
				aceArray.push(card);
			}else{
				nonAceArray.push(card);
			}
		});
		return {'aces':aceArray, 'nonAces':nonAceArray};
	};
	static _convertValue(cardObj){
		console.log("Inside _convertValue: ", cardObj);
		if(cardObj['name' == 'A']){
			return [1,11];
		}else if(cardObj['name'] == 'J' || cardObj['name'] == 'Q' || cardObj['name'] == 'K'){
			return [10];
		}else{
			return [Number(cardObj['name'])];
		}
	};
	static _makeCount(handObj){
		var baseCountArray = handObj['nonAces'];
		console.log(baseCountArray);
		var aceCountArray = handObj['aces'];
		var countPromise = new RSVP.Promise(function(fulfill, reject) {
			var count = 0;
			// console.log("Promise gets executed");
			baseCountArray.forEach(function(element,index){
				console.log("Inside for each");
				console.log(element);
				cardValue = player._convertValue(element);
				count = count + cardValue[0];
				console.log(element);
				console.log(index);
				if(index == (baseCountArray.length -1)){
					console.log("for Each should terminate");
					fulfill(count);
				}
			});
		  console.log('2');
		});

		countPromise.then(function(count) {
			console.log('Fulfill gets called, count '+String(count) );
			callback(null,count)  
		}, function(count) {
			console.log("Rejection gets called");  
			callback(null,count)
		});
	};
};

var dealer = new player('dealer',0);
var handArray = [{'name':'A'},{'name':'A'},{'name':'K'},{'name':'3'}];
// // console.log(dealer.seperateCards(handArray));
handArray.forEach(function(element,index){
	dealer.hit(element);
	dealer.getCount(function(err,count){
		console.log("New hit: ",element);
		if(err == null){
			console.log("Err");
		}else{
			console.log("Count ",count);
		}
	})
});
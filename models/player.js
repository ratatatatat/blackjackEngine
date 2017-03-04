'use strict'
var RSVP = require('rsvp');



class player{
	constructor(type,bankroll){
		this._type = type;
		this._hands = 0;
		this._handCards = [];
		this._count = [];
		if(type == 'dealer'){
			this._bankroll = bankroll;
		}
	};
	hit(card,callback){
		this._handCards.push(card);
		var handObj = player._seperateCards(this._handCards);
		// this._count = player._makeCount(handObj);
		player._makeCount(handObj,function(countArray){
			this._count = countArray;
			callback();
		}.bind(this));
	};
	getCount(){
		return this._count;
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
		if(cardObj['name'] == 'A'){
			return [1,11];
		}else if(cardObj['name'] == 'J' || cardObj['name'] == 'Q' || cardObj['name'] == 'K'){
			return [10];
		}else{
			return [Number(cardObj['name'])];
		}
	};
	static _makeCount(handObj,callback){
		var baseCountArray = handObj['nonAces'];
		var aceCountArray = handObj['aces'];
		var countPromise = new RSVP.Promise(function(fulfill, reject) {
			var count = 0;
			baseCountArray.forEach(function(element,index){
				var cardValue = player._convertValue(element);
				count = count + cardValue[0];
				if(index == (baseCountArray.length -1)){
					fulfill(count);
				}
			});
		});

		countPromise.then(function(count) {
			// callback(null,count)
			player._countPermutate(count,aceCountArray,callback);  
		}, null);
	};
	static _countPermutate(baseCount,aceArray,callback){
		var aceCount1 = baseCount;
		var aceCount2 = baseCount;
		if(aceArray.length == 0){
			callback([baseCount]);
		}else if(aceArray.length == 1){
			aceCount1 = aceCount1 + 1;
			aceCount2 = aceCount2 + 11;
			callback([aceCount1,aceCount2]);
			// callback(null,this._count);
		}else{
			aceArray.forEach(function(element,index){
				if(index == 0){
					aceCount1 = aceCount1 + 1;
					aceCount2 = aceCount2 + 11;
				}else if(index == (aceArray.length -1)){
					aceCount1 = aceCount1 + 1;
					aceCount2 = aceCount2 + 1;
					callback([aceCount1,aceCount2]);
					// callback(null,this._count);
				}else{
					aceCount1 = aceCount1 + 1;
					aceCount2 = aceCount2 + 11;
				}
			});
		}
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
'use strict'

var RSVP = require('rsvp');

module.exports = class hand{
	constructor(initHandArray){
		this._handCards = [];
		this._count = [];
		this._status = 'in-game';
	};
	addCard(cardObj,callback){
		this._handCards.push(cardObj);
		var handObj = hand._seperateCards(this._handCards);
		hand._makeCount(handObj,function(countArray){
			this._count = [];
			countArray.forEach(function(element,index){
				if(element < 22){
					this._count.push(element);
				}
				if(index == countArray.length -1){
					callback();
				}
			}.bind(this));
		}.bind(this));
	};
	getCount(){
		return this._count;
	};
	getHand(){
		return this._handCards;
	};
	isSplittable(callback){
		var cardArray = this._handCards;
		// console.log("cardArray",cardArray);
		if((cardArray.length == 2) && (cardArray[0]['name'] == cardArray[1]['name'])){
			callback(true);
		}else{
			callback(false);
		}	
	};
	isBlackJack(callback){
		var countArray = this._count;
		var handArray = this._handCards;
		if((handArray.length == 2) && (countArray.indexOf(21) != -1)){
			console.log("Should be returning blackjack")
			callback(true);
		}else{
			callback(false);
		}
	};
	//All These Functions Are Related To Getting Count Values
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
	static cleanCount(countArray,callback){
		var cleanArray = [];
		countArray.forEach(function(element,index){
			if(element < 22){
				cleanArray.push(element);
			}
			if(index == countArray.length -1){
				callback(cleanArray);
			}
		})
	}

	static _makeCount(handObj,callback){
		var baseCountArray = handObj['nonAces'];
		var aceCountArray = handObj['aces'];
		var countPromise = new RSVP.Promise(function(fulfill, reject) {
			var count = 0;
			if(baseCountArray.length == 0){
				fulfill(count);
			}else{
				baseCountArray.forEach(function(element,index){
					var cardValue = hand._convertValue(element);
					count = count + cardValue[0];
					if(index == (baseCountArray.length -1)){
						fulfill(count);
					}
				});
			}
		});

		countPromise.then(function(count) {
			// callback(null,count)
			hand._countPermutate(count,aceCountArray,callback);  
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
				}else{
					aceCount1 = aceCount1 + 1;
					aceCount2 = aceCount2 + 11;
				}
			});
		}
	};
	/// End of Count Functions
};


// var Hand = new hand();
// var handStack = [{'name':'A'},{'name':'10'}];
// handStack.forEach(function(element,index){
// 	Hand.addCard(element,function(){
// 		var count = Hand.getCount();
// 		console.log("count: ", count);
// 		Hand.isBlackJack(function(bJ){
// 			console.log("blackJack?",bJ);
// 		});		
// 	});
// });
// Hand.isSplittable(function(bSplit){
// 	console.log("splittable",bSplit);
// });	
// Hand.isBlackJack(function(bJ){
// 	console.log("blackJack?",bJ);
// });	
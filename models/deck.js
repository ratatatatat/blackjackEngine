
'use strict'

module.exports = class Deck{
	constructor(bShuffle, numberDecks){
		this.decks = [];
		this.dealt = [];
		for(var i = 0; i < numberDecks; i++){
			var dummyDeck = this.genDeck();
			if(bShuffle == true){
				var shuffledDeck = this.shuffle(dummyDeck);
				shuffledDeck.forEach(function(element){
					this.decks.push(element);
				}.bind(this));
			}else{
				dummyDeck.forEach(function(element){
					this.decks.push(element);
				}.bind(this));
				this.decks.concat(dummyDeck);
			}
		}
	};
	getDeck(){
		return this.decks;
	};
	getCard(){
		var topCard = this.decks.shift();
		this.dealt.push(topCard);
		return topCard;
	};
	getRemaining(){
		return this.decks;
	};
	getDealt(){
		return this.dealt;
	};
	genDeck(){
		var suit = ['D','C','H','S'];
		var deck = [];
		suit.forEach(function(element){
			for(var count = 1; count < 14; count++){
				var dummyObj = {};
				dummyObj['suit'] = element;
				dummyObj['value'] = count;
				dummyObj['name'] = this.getName(count);
				deck.push(dummyObj);
		    }
		}.bind(this));
		return deck;
	};
	getName(val){
		if(val == '1'){
			return String('A');
		}else if(val == '11'){
			return String('J');
		}else if(val == '12'){
			return String('Q');
		}else if(val == '13'){
			return String('K')
		}else{
			return String(val);
		}
	};
	shuffle(array){
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	};
}


// var genDeck = function(){
// 	suit = ['D','C','H','S'];
// 	deck = []
// 	suit.forEach(function(element){
// 		for(count = 1; count < 14; count++){
// 			dummyObj = {};
// 			dummyObj['suit'] = element;
// 			dummyObj['value'] = count;
// 			dummyObj['name'] = getName(count);
// 			deck.push(dummyObj);
// 	    }
// 	});
// 	return deck
// };

// var getName = function(val){
// 	if(val == '1'){
// 		return String('A');
// 	}else if(val == '11'){
// 		return String('J');
// 	}else if(val == '12'){
// 		return String('Q');
// 	}else if(val == '13'){
// 		return String('K')
// 	}else{
// 		return String(val)
// 	}
// };

// function shuffle(array) {
//   var currentIndex = array.length, temporaryValue, randomIndex;

//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {

//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;

//     // And swap it with the current element.
//     temporaryValue = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//   }

//   return array;
// }

// var deck = genDeck();
// console.log("Deck", deck)

// console.log("shuffledDeck",shuffle(deck));
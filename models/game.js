'use strict'
var player = require('./player.js');
var deck = require('./deck.js');
var readline = require('readline');
var async = require('async');

//Instantiate a game with rules(config)

//
//	Set The Rules 
//	Create Max number of players
//	The Dealer Stand Rule
//	The Number of Decks
//	The Percent Till Deck Gets ReShuffled
//	Payouts
//	Double-down
//	Split Rule
//	Dealer BlackJack

//	Games
//	Player Joins Game
//	Player Places Bets
//	Game Starts
//	All actions are taken on Bets
//	All Accounts are settled

module.exports = function table(config){
	this.maxPlayers = config['maximumPlayers'];
	this.blackJackPayout = config['blackJackPayout'];
	this.minBet = config['minBet'];
	this.maxBet = config['maxBet'];
	this.removeDealt = config['removeDealt'];//Boolean that decides whether to reshuffle dealt cards back into chute.
	this.reshuffleThreshold = config['reshuffleThreshold'];//Percentage of cards, before reshuffling with all decks.
	this.numberOfDecks = config['numberOfDecks'];//Number of decks to use in the game. 
	this.dealerStandRule = config['dealerStand'];//Dealer Stand Rule
	//Deck Reconfig
	this.deck = new deck(true,2);
	this.dealer = new player('dealer',0,'house',0);
	this.players = [];//Initialize the player array.

	this.addPlayers = function(playerObj){
		this.players.push(playerObj);
	};

	this.removePlayers = function(){
		this.players = [];
	};

	this.startGame = function(){
		// Initialize the deck
		// this.deck = new deck(true,1);
		//Initialize dealer hand
		this.dealer.createBet(0,'regular');
		this.players.push(this.dealer);
	};

	this.dealTable = function(){
		this.players.forEach(function(element,index){
			var player = element;
			player._bets.forEach(function(element,index){
				var bet = element;
				var hitCard = this.deck.getCard();
				bet._hand.addCard(hitCard,function(){
					this.setBetStatus(bet);
					return;
				}.bind(this));
			}.bind(this));
		}.bind(this));		
	};

	this.dealTablePairs = function(){
		this.players.forEach(function(element,index){
			var player = element;
			player._bets.forEach(function(element,index){
				var bet = element;
				this.deck.getCertainCard('A',function(hitCard){
					bet._hand.addCard(hitCard,function(){
						this.setBetStatus(bet);
						return;
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));		
	};

	this.getCounts = function(){
		this.players.forEach(function(element){
			var player = element;
			player._bets.forEach(function(element){
				var bet = element;
				var hand = bet._hand;
				var count = hand.getCount();
			})
		});
	};

	this.firstDeal = function(){
		this.dealTable();
		this.dealTable();
	};

	this.firstPairDeal  = function(){
		this.dealTablePairs();
		this.dealTablePairs();
	};

	this.checkStatus = function(){
		//Check all bets on the table for Blackjack and mark bets as win,lost 
		this.players.forEach(function(element){
			var player = element;
			player._bets.forEach(function(element){
				var bet = element;
				var hand = bet._hand;
				var count = hand.getCount();
				if((hand._handCards.length == 2) && (count.indexOf(21) != -1)){
					bet.setStatus('blackjack');
				}else if((hand._handCards.length > 2) && (count.length == 0)){
					console.log("should be setting bust");
					bet.setStatus('bust');
				}else{
					console.log("should be setting live");
					bet.setStatus('live');
				}
			})
		});
	};

	this.setBetStatus = function(bet,finalHit){
		var hand = bet._hand;
		var count = hand.getCount();
		console.log("hand after hit,",hand.getHand());
		console.log("count",count);
		if((hand._handCards.length == 2) && (count.indexOf(21) != -1)){
			bet.setStatus('blackjack');
		}else if((hand._handCards.length > 2) && (count.length == 0)){
			console.log("should be setting bust");
			bet.setStatus('bust');
		}else{
			if(finalHit  == true){
				console.log('stand status get set after final hit');
				bet.setStatus('stand')
			}else{
				console.log("should be setting live");
				bet.setStatus('live');
			}
		}
	};

	this.decideActions = function(bet){
		console.log("bet",bet);
		console.log(bet._status);
		var actions = [];
		if(bet._status == 'bust' || bet._status == 'blackjack' || bet._status == 'stand'){
			return actions;
		}else{
			console.log("Inside the decideActions elese");
			var hand = bet._hand._handCards;
			var count = bet._hand.getCount();
			actions = this.constructAction(bet,hand,count);
			return actions;
		}
	};

	this.constructAction = function(bet,hand,count){
		var actions = ['stand'];
		actions.push(this.isHittable(bet));
		if(this.isSplittable(hand)){
			actions.push('split');
		}
		if(this.isDoubleDown(hand,count,bet)) {
			actions.push('double down');
		}
		// if(this.offerInsurance()){
		// 	actions.push('insurance');
		// }
		return actions;
	};

	this.isHittable = function(bet){
		if(bet._isDoubled == true || bet._type == 'split'){
			return 'final-hit';
		}else{
			return 'hit';
		}
	};

	this.isDoubleDown = function(hand,count,bet){
		console.log("count",count);
		if((hand.length == 2 || count.indexOf(9) != -1 || count.indexOf(10) != -1 || count.indexOf(11) != 11) && bet._isDoubled == false){
			return true;
		}else{
			return false;
		}
	};

	this.isSplittable = function(hand){
		var cardArray = hand;
		// console.log("cardArray",cardArray);
		if((cardArray.length == 2) && (cardArray[0]['name'] == cardArray[1]['name'])){
			return true;
		}else{
			return false;
		}	
	};

	this.offerInsurance = function(){
		//Look at the dealer's hand.
		// IMPLEMENT LATER
		return false;
	};

	this.engagePlayer = function(player){
		//Start the players's bets:
		var bets = player._bets;
		bets.forEach(function(element,index){
			var bet = element;
			this.playLoop(player,bet)
		}.bind(this));
	};

	this.playLoop = function(player,bet,callback){
		// console.log("Inside playLoop,", player,bet);
		console.log("playLoop",bet._status);
		if(bet._status == 'bust'){
			console.log("Just Busted")
			return;
		}else if(bet._status == 'live'){
			this.engageBet(player,bet,callback);
		}else{
			if(typeof callback == 'function'){
				callback();
			}
			return;
		}
	};

	this.engageBet = function(player,bet,callback){
		var actions = this.decideActions(bet);
		var count = bet._hand.getCount();
		var hand = bet._hand.getHand();
		console.log(hand);
		this.genActionMsg(actions,hand, count,player._name,function(actionPrompt){
			player._playerAdapter.getInput(actionPrompt,function(response){
				console.log("Thi is the player's response: ",response);
				//SPITS OUT INDEX OF ACTION
				var chosenAction = this.getChosenAction(response,actions);
				player._playerAdapter.closeConnect(function(){
					this.playHandler(chosenAction,bet,player,function(){
						this.playLoop(player,bet,callback);
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	};

	this.getChosenAction = function(index,actionArray){
		return actionArray[index];
	};

	this.genActionMsg = function(actionArray,hand,count,playerName,callback){
		var baseMessage = "Hello "+playerName+'\n';
		baseMessage = baseMessage + "Hand: " +  String(hand) + '\n';
		baseMessage = baseMessage + "Count " + String(count) + '\n';
		baseMessage = baseMessage + "Please choose an action:\n";
		actionArray.forEach(function(element,index){
			var line = String(index) + ' ' + String(element) + '\n';
			baseMessage = baseMessage + line;
			if(index == actionArray.length -1){
				baseMessage = baseMessage + '\n\n >';
				callback(baseMessage);
			}
		}.bind(this));
	};

	this.hitHand = function(bet,callback){
		var hitCard = this.deck.getCard();
		// console.log(bet);
		console.log("hitCard: ",hitCard)
		bet._hand.addCard(hitCard,function(){
			this.setBetStatus(bet);
			callback();
		}.bind(this));	
	};

	this.finalHit = function(bet,callback){
		var hitCard = this.deck.getCard();
		bet._hand.addCard(hitCard,function(){
			// bet._status = 'stand';//Force a stand after this
			this.setBetStatus(bet,true);
			callback();
		}.bind(this));
	};

	this.standHand = function(bet,callback){
		bet._status = 'stand';
		callback();		
	};

	this.splitBet = function(bet,player,callback){
		player.createSplitBet(bet,function(origBetId){
			player.getSplitBet(origBetId,function(splitBetObj){
				var splits = splitBetObj.splits;
				async.eachOfSeries(splits,function(item,key,callback){
					console.log("ITEM",item);
					console.log("KEY",key);
					this.playLoop(player,item,callback)
				}.bind(this),function(err){
					// callback();
					return;
					//Final Function
				});
				// this.playLoop(player,splitBetObj.splits[0],function(){
				// 	this.playLoop(player,splitBetObj.splits[1],null)
				// }.bind(this));


			}.bind(this));
		}.bind(this));
	};


	this.playHandler = function(action,bet,player,callback){
		if(action == 'hit'){
			console.log("hitting Hand");
			this.hitHand(bet,callback);
		}else if(action == 'stand'){
			console.log('stand hand');
			this.standHand(bet,callback);
		}else if(action == 'double down'){
			console.log("doubling bet");
			this.doubleDownHand(bet,callback);
		}else if(action == 'final-hit'){
			console.log("final hit on hand");
			this.finalHit(bet,callback);
		}else if(action == 'split'){
			console.log("split the bet");
			this.splitBet(bet,player,callback);
		}
	};

	this.doubleDownHand = function(bet,callback){
		bet.doubleDown(function(){
			this.setBetStatus(bet);
			callback();
		}.bind(this));
	};

};

// var config = {
// 	maximumPlayers: 1,
// 	blackJackPayout: 1.5,
// 	minBet: 5,
// 	maxBet: 100,
// 	removeDealt: true,
// 	reshuffleThreshold: .25,
// 	numberOfDecks: 1,
// 	dealerStand: 'soft-17'
// };

// var newTable = new table(config);

// var dummyPlayer = new player('player',100,'Rajiv',1);
// dummyPlayer.createBet(5,'regular');
// newTable.addPlayers(dummyPlayer);
// setTimeout(function(){
// 	newTable.startGame();
// 	newTable.firstDeal();
// },2000);
// setTimeout(function(){
// 	newTable.getCounts();
// 	newTable.checkStatus();
// 	newTable.players.forEach(function(element){
// 		var player = element;
// 		player._bets.forEach(function(bet){
// 			console.log(bet);
// 		});
// 		return;	
// 	});
// },3000);

// setTimeout(function(){
// 	newTable.players.forEach(function(element,index){
// 		var player = element;
// 		if(player._type != 'dealer'){
// 			newTable.engagePlayer(player);
// 		}
// 	});
// },4000);
// newTable.startGame();
// console.log("newPlayers",newTable.players);
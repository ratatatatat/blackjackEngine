'use strict'
var player = require('./player.js');
var deck = require('./deck.js');
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

function table(config){
	this.maxPlayers = config['maximumPlayers'];
	this.blackJackPayout = config['blackJackPayout'];
	this.minBet = config['minBet'];
	this.maxBet = config['maxBet'];
	this.removeDealt = config['removeDealt'];//Boolean that decides whether to reshuffle dealt cards back into chute.
	this.reshuffleThreshold = config['reshuffleThreshold'];//Percentage of cards, before reshuffling with all decks.
	this.numberOfDecks = config['numberOfDecks'];//Number of decks to use in the game. 
	this.dealerStandRule = config['dealerStand'];//Dealer Stand Rule
	//Deck Reconfig
	this.deck = new deck(true,1);
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

	this.setBetStatus = function(bet){
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
	};

	this.decideActions = function(bet){
		// console.log("bet",bet);
		var actions = [];
		if(bet._status == 'bust' || bet._status == 'blackjack'){
			return actions;
		}else {
			var hand = bet._hand._handCards;
			var count = bet._hand.getCount();
			var actions = this.constructAction(hand,count);
			return actions;
		}
	};

	this.constructAction = function(hand,count){
		var actions = ['stand','hit'];
		// if(this.isSplittable()){
		// 	actions.push('split');
		// }
		// if(this.isDoubleDown(hand,count)){
		// 	actions.push('double-down');
		// }
		// if(this.offerInsurance()){
		// 	actions.push('insurance');
		// }
		return actions;

	};

	this.isDoubleDown = function(hand,count){
		if(hand.length == 2 || count.indexOf(9) != -1 || count.indexOf(10) != -1 || count.indexOf(11) != 11){
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

	this.playLoop = function(player,bet){
		// console.log("Inside playLoop,", player,bet);
		if(bet._status == 'bust'){
			console.log("Just Busted")
		}
		if(bet._status == 'live'){
			this.engageBet(player,bet);
		}else{
			return;
		}
	};

	this.engageBet = function(player,bet){
		var actions = this.decideActions(bet);
		var count = bet._hand.getCount();
		var hand = bet._hand.getHand();
		this.genActionMsg(actions,hand, count,player._name,function(actionPrompt){
			player._playerAdapter.getInput(actionPrompt,function(response){
				console.log("Thi is the player's response: ",response);
				//SPITS OUT INDEX OF ACTION
				var chosenAction = this.getChosenAction(response,actions);
				this.playHandler(chosenAction,bet,function(){
					console.log("playerHandler callback gets called");
					this.playLoop(player,bet);
				}.bind(this));
				// callback(player,bet);
				// this.playLoop(player,bet);
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
				baseMessage = baseMessage + '\n\n >>';
				callback(baseMessage);
			}
		}.bind(this));
	};

	this.hitHand = function(bet,callback){
		var hitCard = this.deck.getCard();
		console.log(bet);
		bet._hand.addCard(hitCard,function(){
			this.setBetStatus(bet);
			callback();
		}.bind(this));	
	};

	this.standHand = function(bet,callback){
		bet._stand = 'stand';
		callback();		
	};

	this.playHandler = function(action,bet,callback){
		this.handlers(action,bet,callback);
	};

	this.handlers = function(action,bet,callback){
		if(action == 'hit'){
			console.log("hitting Hand");
			this.hitHand(bet,callback);
		}
		if(action == 'stand'){
			console.log('stand hand');
			this.standHand(bet,callback);
		}
	};

	// this.playHandler = function(action,bet){
	// 	this.handlers[action](bet);
	// };



};

var config = {
	maximumPlayers: 1,
	blackJackPayout: 1.5,
	minBet: 5,
	maxBet: 100,
	removeDealt: true,
	reshuffleThreshold: .25,
	numberOfDecks: 1,
	dealerStand: 'soft-17'
};

var newTable = new table(config);

var dummyPlayer = new player('player',100,'Rajiv',1);
dummyPlayer.createBet(5,'regular');
newTable.addPlayers(dummyPlayer);
setTimeout(function(){
	newTable.startGame();
	newTable.firstDeal();
},2000);
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

setTimeout(function(){
	newTable.players.forEach(function(element,index){
		var player = element;
		if(player._type != 'dealer'){
			newTable.engagePlayer(player);
		}
	});
},4000);
// newTable.startGame();
// console.log("newPlayers",newTable.players);
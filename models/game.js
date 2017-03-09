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
		this.deck = new deck(true,1);
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
					return;
				});
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
				console.log(hand);
				console.log("Player", player);
				console.log("count", count);
			})
		})
	};

	this.firstDeal = function(){
		this.dealTable();
		this.dealTable();
	};

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
	newTable.dealTable();
	newTable.dealTable();
},2000);
setTimeout(function(){
	newTable.getCounts();
},3000);
// newTable.startGame();
// console.log("newPlayers",newTable.players);
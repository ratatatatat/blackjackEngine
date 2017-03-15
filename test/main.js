var table = require('../models/game.js');
var player = require('../models/player.js');
var deck = require('../models/deck.js');

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
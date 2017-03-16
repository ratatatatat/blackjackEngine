var table = require('../models/game.js');
var player = require('../models/player.js');
var deck = require('../models/deck.js');
var async = require('async');
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
var dummyPlayer2 = new player('player',100,'Victor',2);
dummyPlayer.createBet(5,'regular');
dummyPlayer2.createBet(5,'regular');
newTable.addPlayers(dummyPlayer);
newTable.addPlayers(dummyPlayer2);
setTimeout(function(){
	newTable.startGame();
	newTable.firstDeal();
},2000);


setTimeout(function(){
	console.log("players at the table",newTable.players.length);

	async.eachOfSeries(newTable.players,function(item,key,cb){
		var player = item;
		if(player._type != 'dealer'){
			newTable.engagePlayer(player,cb);
		}else{
			cb();
		}
	},function(err){
		console.log("callback for async called");
		newTable.engageDealer(function(){
			console.log("Done Engaging Dealer");
			newTable.settleTable(function(){
				console.log("Done settling the table");
				console.log("players",newTable.players);
			});
		});
	});

},4000);
// newTable.startGame();
// console.log("newPlayers",newTable.players);
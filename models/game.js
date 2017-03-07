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
	this.dealerStandRule = config['dealerStand'];
	this.
};
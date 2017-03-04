var genDeck = function(){
	suit = ['D','C','H','S'];
	deck = []
	suit.forEach(function(element){
		for(count = 1; count < 14; count++){
			dummyObj = {};
			dummyObj['suit'] = element;
			dummyObj['value'] = count;
			dummyObj['name'] = getName(count);
			deck.push(dummyObj);
	    }
	});
	return deck
};

var getName = function(val){
	if(val == '1'){
		return String('A');
	}else if(val == '11'){
		return String('J');
	}else if(val == '12'){
		return String('Q');
	}else if(val == '13'){
		return String('K')
	}else{
		return String(val)
	}
};

var deck = genDeck();
console.log("Deck", deck)
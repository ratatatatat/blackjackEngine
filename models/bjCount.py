def scoreCount(cardArray):
	count = 0
	for element in cardArray:
		value = convertValue(element)
		if(len(value) == 1):
			count = count + value[0]
		elif(len(value) == 2):
			bufCount1 = count + value[0] 
			bufCount2 = count + value[1]
			if((bufCount1 > 21 and bufCount2 < 22)):
				count = bufCount2
			elif((bufCount2 > 21) and (bufCount1 < 22)):
				count = bufCount1
			

def convertValue(card):
	if(card.name == 'A'):
		return[1,11]
	elif((card.name == 'J') or (card.name == 'Q') or (card.name == 'K')):
		return [10]
	else:
		return [int(card.name)]
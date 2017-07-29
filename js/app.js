//app.js

var cardType = ["club","diamond","heart","spade"];
var cardValue = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "king", "queen"];
var grid = new Array(16);
var countSelectedCard = 0;
var firstSelectedCard = -1;
var secondSelectedCard = -1;
var flipNot = new Array(16);
var score = 0;



function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

function initFlip(){
	for(i=0;i<16;i++)
		flipNot[i]= false;
}
class Card{
	constructor(type, value){
		this.type = type;
		this.value = value;
	}

	isEqual(card){

		if(this.type!=card.type)
			return false;
		if(this.value!=card.value)
			return false;
		return true;
	}
}

//generate 8 differents cards	
function generateCards(){
	var cards = new Array(8);
	var type = random(0,3);
	var val = random(0,12);
	var card = new Card(cardType[type], cardValue[val]);
	cards[0] = card;
	var i = 1;
	while (i < 8) {
		n = random(0,3);
		m = random(0,12);
		if (type!=n && val!=m){
			cards[i] = new Card(cardType[n], cardValue[m]);
			type = n ;
			val = m;
			i++;
		}		
	}

	return cards;
}

function initGrid(){	
	var cards = generateCards();
	// fill the game grid	
	k = 0
	for (i =0; i<16; i++){
		grid[i]= cards[k];
		k++;
		if (k == cards.length)
			k = 0;
		
	}	
}

function randomizePositionInGrid(){

	for(k = 0 ; k < 4; k++){
		i = random(0,15);
		j = random(0,15);

		temp = grid[i];
		grid[i] = grid[n];
		grid[n]= temp;
	}
}


function loadGridBoard(){

	var i = 0;
	$( ".back > img" ).each(function( elt ) {
		src = 'img/icons/'+grid[i].value+'-'+grid[i].type+'.png';
		$(this).attr('src', src);
    	i++;
  });	
}


function hideCard(card_id){
	//flip back the selected card

	elt = "#card-".concat(card_id);
	$(elt).children(".back").hide();
	$(elt).children(".front").show();
}



initGrid();
randomizePositionInGrid();
loadGridBoard();
initFlip();

$(".card").click(function(){


	card_id = parseInt($(this).attr('id').split('-')[1]);

	if (flipNot[card_id-1]){
		return;
	}

	if (firstSelectedCard > 0) { secondSelectedCard = card_id;}
	else{	firstSelectedCard = card_id;	}

	if (firstSelectedCard!=secondSelectedCard)
		countSelectedCard++;


	$(this).children(".front").hide();
	$(this).children(".back").show(function(){

		if(countSelectedCard ==2){

			if (!grid[firstSelectedCard -1].isEqual(grid[secondSelectedCard -1])){					
				hideCard(firstSelectedCard);
				hideCard(secondSelectedCard);
			}
			else{
				score++;
				flipNot[firstSelectedCard-1]=true;
				flipNot[secondSelectedCard-1]=true;
			}

			$("#score").html(score);
			countSelectedCard = 0;
			firstSelectedCard = -1;
			secondSelectedCard = -1;
			
		}
		
	});
	
		
});
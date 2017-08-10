//app.js

var cardType = ["club", "diamond", "heart", "spade"];
var cardValue = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "king", "queen"];
var grid = [];
var countSelectedCard = 0;
var firstSelectedCard = -1;
var secondSelectedCard = -1;
var flipNot = [];
var score = 0;
var moves = 0;
var numStar = 3;

class Card{
	constructor(type, value){
		this.type = type;
		this.value = value;
	}

	isEqual(card){
		if(this.type!=card.type || this.value!=card.value)
			return false;
		return true;
	}
}

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

function initFlip(){
	for(var i=0;i<16;i++)
		flipNot[i]= false;
}

function generateCards(){
	//generate 8 differents cards
	var cards = new Array(8);
	var type = random(0,3);
	var val = random(0,12);
	var card = new Card(cardType[type], cardValue[val]);
	cards[0] = card;
	var i = 1;
	while (i < 8) {
		var n = random(0,3);
		var m = random(0,12);
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
	//append the first series of 8 cards
	grid.push.apply(grid, cards);
	//append the second series of 8 cards
	grid.push.apply(grid, cards);
}

function randomizePositionInGrid(){

	for(var k = 0 ; k < 4; k++){
		var i = random(0,15);
		var j = random(0,15);

		var temp = grid[i];
		grid[i] = grid[j];
		grid[j]= temp;
	}
}

function loadGridBoard(){
	var i = 0;
	$( ".back > img" ).each(function( elt ) {
		var src = 'img/icons/'+grid[i].value+'-'+grid[i].type+'.png';
		$(this).attr('src', src);
    	i++;
  });
}

function hideCard(card_id){
	//flip back the selected card
	var elt = "#card-".concat(card_id);
	$(elt).children(".back").hide();
	$(elt).children(".front").show();
}

function updateStarRating(){
	if (moves>=11 && moves<17){
		$("#star-3").attr('src', 'img/icons/star-empty.png');
		numStar--;
	}
	else if (moves > 17){
		$("#star-2").attr('src', 'img/icons/star-empty.png');
		numStar--;
	}
}

function gameOver(){
	$('#gameover').modal("show");
	Timer.stop();
	for(var i=0; i<numStar;i++){
		$('.rating').append('<img src="img/icons/star-full.png" alt="star-rating"/>');
	}
	$('.score').append('<p>'+score+'</p>');
}

function resetGame(){
	score = 0;
	moves = 0;
	Timer.reset();
	Timer.start();
	initGrid();
	randomizePositionInGrid();
	loadGridBoard();
	for(var i=1; i<17;i++){
		hideCard(i);
	}
	initFlip();
	$("#score").html(score);
	$("#moves").html(moves);
	$('#gameover').modal("hide");
}

function initTimer(){
	Timer.init('timer');
	Timer.start();
}

$(".card").click(function(){

	var card_id = parseInt($(this).attr('id').split('-')[1]);

	if (flipNot[card_id-1])
		return;

	if (firstSelectedCard > 0) { secondSelectedCard = card_id;}
	else {	firstSelectedCard = card_id;	}

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
			moves++;
			$("#score").html(score);
			$("#moves").html(moves);
			countSelectedCard = 0;
			firstSelectedCard = -1;
			secondSelectedCard = -1;

			if (score == 8 )
				gameOver();
		}
	});
	updateStarRating();
});

$('.reset').click(resetGame);

$(".stop").click(gameOver);

initGrid();
randomizePositionInGrid();
loadGridBoard();
initFlip();
initTimer();

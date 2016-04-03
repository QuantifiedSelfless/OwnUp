var players;
var totalPlayers;
var placements = {
    1 : {x: windowWidth*.5 ,
         y: windowHeight*.75,
         rotate: 0},
    2 : {x: windowWidth*.5 ,
         y: windowHeight*.25,
         rotate: 180},
    3 : {x: windowWidth*.25 ,
         y: windowHeight*.5,
         rotate: 270},
    4 : {x: windowWidth*.75 ,
         y: windowHeight*.75,
         rotate: 90}
};
var activeButtons = [false, false, false, false];

function preload() {
    replay = loadFont('static/BPreplay/BPreplay.otf');
    // Grab URL Params
    // Get each users' exhibit data
    // Add to global players array
    players = [{"quotes":[]},
                {"quotes":[]},
                {"quotes":[]},
                {"quotes":[]}];
    totalPlayers = players.length;
    //if total players > 4, may want to throw exception
 
}

function setup() {
    myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent('processing');
    angleMode(DEGREES);
    
}

function draw() {
    background(255);
    myGame.update();
    myGame.display();
}

//Full Game
var Game = function (players) {
    this.numPlay = players.length;
    this.quotes = this.allQuotes(players);
    this.cards = this.addCards(players);

    this.update = function () {

    }

    this.display = function () {

    }

    this.addCards = function () {
        allCards = [];
        for (i in players) {
            card = new Card( placements[i + 1].x,
                             placements[i + 1].y,
                             placements[i + 1].rotate,
                             i );
            allCards.push(card);
            activeButtons[i] = true;
        }
        return allCards;

    }

    this.allQuotes = function (allPlays) {
        quotes = []
        for (play in allPlays) {
            quotes.push(allPlays[play].quotes)
        }
        shuffle(quotes);
        return quotes;
    }

}

var Card = function (x, y, angle, index) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.cardIndex = index;
    this.selected = false;

    // Basic Card Display
    // Needs to support a special case if selected
    this.display = function () {
        if (this.selected == false){
            push();
                rotate(this.angle);
            pop();
        }

    }

    this.update = function () {

    }


}

var Timer = function () {

    this.reset = function () {

    }

    this.update = function () {

    }

    this.display = function () {

    }
}

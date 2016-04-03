var allPlayers;
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
         rotate: 90},
    4 : {x: windowWidth*.75 ,
         y: windowHeight*.75,
         rotate: 270}
};
var activeButtons = [false, false, false, false];

function preload() {
    replay = loadFont('static/BPreplay/BPreplay.otf');
    // Grab URL Params
    // Get each users' exhibit data
    // Add to global players array
    allPlayers = [{"quotes":[],
                "name": ""},
                {"quotes":[],
                 "name": ""},
                {"quotes":[],
                 "name": ""},
                {"quotes":[],
                 "name": ""}];
    totalPlayers = players.length;
    //if total players > 4, may want to throw exception
 
}

function setup() {
    myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent('processing');
    angleMode(DEGREES);
    rectMode(CENTER);
    textAlign(CENTER);

    myGame = new Game(allPlayers)
    
}

//Do I really want a draw loop?
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
    this.timer = new Timer(windowWidth*.5, windowHeight*.5, 7);

    this.update = function () {

    }

    this.display = function () {

    }

    this.addCards = function (players) {
        allCards = [];
        for (i in players) {
            card = new Card( placements[i + 1].x,
                             placements[i + 1].y,
                             placements[i + 1].rotate,
                             i,
                             players[i].name );
            allCards.push(card);
            activeButtons[i] = true;
        }
        return allCards;
    }

    this.timerTick = function () {

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

// Card Objects for Players
var Card = function (x, y, angle, index, name) {
    this.x = x;
    this.y = y;
    this.height = windowHeight*.25;
    this.width = windowWidth*.45;
    this.angle = angle;
    this.cardIndex = index;
    this.selected = false;
    this.quote = '';
    this.name = name;

    // Basic Card Display
    // Needs to support a special case if selected
    this.display = function () {
        if (this.selected == false){
            push();
                rotate(this.angle);
                //Show rect, name, quote
                strokeWeight(8);
                stroke('#333030');
                rect(this.x, this.y, this.width, this.height);
                fill(0);
                text(this.name, this.x, this.y + this.height*.2 );
                text(this.quote, this.x, this.y + this.height*.4, this.width*.9, this.height*.55);
            pop();
        } else {
            push();
                rotate(this.angle);
                //show extra highlighting rectangle
                fill("#6bbc4f");
                rect(this.x, this.y, this.width + this.width*.1, this.height + this.height*.1);
                strokeWeight(8);
                stroke('#333030');
                rect(this.x, this.y, this.width, this.height);
                fill(0);
                text(this.name, this.x, this.y + this.height*.2 );
                text(this.quote, this.x, this.y + this.height*.4, this.width*.9, this.height*.55);
            pop();
        }

    }

    this.update = function () {
        //change quote
        //decide if this card was selected

    }


}

// Game Timer
var Timer = function (x, y, roundTime) {
    this.x = x;
    this.y = y;
    this.fullTime = roundTime;
    this.currTime = 0;

    this.reset = function () {
        this.currTime = this.fullTime;

    }

    this.update = function () {
        if (this.currTime > 0) {
            this.currTime--;
        }

    }

    this.display = function () {
        push();
            fill("#e44b23");
            text(this.currTime, this.x, this.y);
        pop();

    }
}

// Background quotes that weren't owned
var UnOwned = function () {

    this.reset = function () {

    }

    this.update = function () {

    }

    this.display = function () {

    }
}

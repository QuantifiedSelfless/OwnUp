var allPlayers;
var totalPlayers;
var activeButtons = [false, false, false, false];
var myGame;
var placements;


//Full Game
var Game = function (players) {

    this.placements = {
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
             y: windowHeight*.5,
             rotate: 270}
    };
    
    this.start = function () {
        this.timer.startTimer();
        me = this;
        this.timerInterval = setInterval(function () {
            me.timerTick();}, 1000);
    }

    this.update = function () {


    }

    this.display = function () {
        this.timer.display();
        for (i in this.cards) {
            this.cards[i].display();
        }

    }

    this.buttonPress = function (button) {
        clearInterval(this.timerInterval);
        console.log('button press');
        this.roundOn = false;
        this.cards[button].selected = true;
        me = this
        setTimeout( function () {
            me.nextQuote();}, 3000);
    }

    this.nextQuote = function () {
        if (this.quotes.length > 0) {
            myQuote = this.quotes.pop();
            console.log(myQuote);
            for (card in this.cards) {
                this.cards[card].selected = false;
                this.cards[card].quote = myQuote;
            }
            this.roundOn = true;
            this.timer.reset();
            me = this;
            this.timerInterval = setInterval(function () {
                me.timerTick();}, 1000);
        } else {
            console.log("GAME OVER YOOOOO!");
        }

    }

    this.addCards = function (players) {
        allCards = [];
        for (i in players) {
            ind = parseInt(i);
            placement = ind + 1;
            card = new Card( this.placements[placement].x,
                             this.placements[placement].y,
                             this.placements[placement].rotate,
                             placement - 1,
                             players[placement - 1].name );
            allCards.push(card);
            activeButtons[i] = true;
        }
        return allCards;
    }

    this.timerTick = function () {
        ticking = this.timer.update();
        console.log(this.roundOn);
        if (ticking == false) {            
            clearInterval(this.timerInterval);
            this.noOwn = true;
            this.roundOn = false;
            me = this;
            setTimeout(function () {
                me.nextQuote();}, 3000);
        }

    }

    this.allQuotes = function (allPlays) {
        quotes = []
        for (var i=0; i<allPlays.length; i++) {
            var mine = allPlays[i];
            for (var j=0; j<mine.quotes.length; j++) {
                new_one = mine.quotes[j];
                console.log(new_one);
                quotes.push(new_one);
            }
        }
        randoqs = shuffle(quotes);
        return randoqs;
    }

    this.numPlay = players.length;
    this.quotes = this.allQuotes(players);
    this.cards = this.addCards(players);
    this.timer = new Timer(windowWidth*.5, windowHeight*.5, 7);
    this.timerInterval = null;
    this.roundOn = false;
    this.noOwn = false;

}

// Card Objects for Players
var Card = function (x, y, angle, index, name) {
    this.x = 0;
    if (index < 2){
        this.y = .2*windowWidth;
    } else {
        this.y = .33*windowWidth;
    }
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
                //Show rect, name, quote
                translate(windowWidth/2, windowHeight/2);
                strokeWeight(0);
                angleMode(DEGREES);
                rectMode(CENTER);
                textAlign(CENTER);
                rotate(this.angle);

                stroke('#333030');
                fill("#4470B1");
                rect(this.x, this.y, this.width, this.height);
                strokeWeight(0);
                fill(255);
                textFont(exo);
                textSize(32);
                text(this.name, this.x, this.y - this.height*.25 );
                textFont(forum);
                textSize(26);
                text(this.quote, this.x, this.y + this.height*.1, this.width*.9, this.height*.55);
            pop();
        } else {
            push();

                //show extra highlighting rectangle
                fill("#48775E");
                translate(windowWidth/2, windowHeight/2);
                strokeWeight(0);
                angleMode(DEGREES);
                rectMode(CENTER);
                textAlign(CENTER);
                rotate(this.angle);
                // rect(this.x, this.y, this.width + this.width*.1, this.height + this.height*.1);
                strokeWeight(8);
                stroke('#333030');
                fill("#3EBF72")
                rect(this.x, this.y, this.width, this.height);
                fill(255);
                strokeWeight(0);
                textFont(exo);
                textSize(32);
                text(this.name, this.x, this.y - this.height*.25 );
                textFont(forum);
                textSize(26);
                text(this.quote, this.x, this.y + this.height*.1, this.width*.9, this.height*.55);
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

    this.startTimer = function () {
        this.currTime = 2;
    }

    this.update = function () {
        if (this.currTime > 0) {
            this.currTime--;
            return true;
        } else {
            console.log('no one did shit');
            return false;
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

function keyPressed() {
    if (keyCode === ENTER && myGame.roundOn == true) {
        myGame.buttonPress(1);
    }
}

function preload() {
    exo = loadFont('static/font/exo/Exo-Black.otf');
    forum = loadFont('static/font/forum/Forum-Regular.otf');
    // Grab URL Params
    // Get each users' exhibit data
    // Add to global players array
    allPlayers = [{"quotes":["I've never actually seen a hamburger because they aren't that cool and I really don't want them or whatever.",
                             "I'm not wild about Power Rangers anymore."],
                "name": "Joey Fatone"},
                {"quotes":["Are cheetos made from cheetahs?",
                           "Soldiers are brave and I stick to that."],
                 "name": "Robert McNamara"},
                {"quotes":["The tooth fairy does exist.",
                            "In ten years there will be flying cars."],
                 "name": "Stacey Popstar"},
                {"quotes":["The atomic bomb split time in half.",
                             "Ferrets were created by The Devil."],
                 "name": "Bob Dylan"}];
    totalPlayers = allPlayers.length;
    //if total players > 4, may want to throw exception
 
}

function setup() {
    myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent('processing');
    angleMode(DEGREES);
    rectMode(CENTER);
    textAlign(CENTER);
    myGame = new Game(allPlayers)
    myGame.start();
}

//Do I really want a draw loop?
function draw() {
    background("#303741");
    myGame.update();
    myGame.display();
}

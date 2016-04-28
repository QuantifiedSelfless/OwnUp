var allPlayers = [];
var totalPlayers;
var activeButtons = [false, false, false, false];
var myGame;
var ready = false;
var placements;
var socket = io.connect('http://localhost:3000');
socket.on('rfid', function (data) {
    setTimeout(function () {window.location = "http://localhost:8000"}, 2000)
});


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
        for (card in this.cards) {
            this.cards[card].beginning = true;
        }
        this.timerInterval = setInterval(function () {
            me.timerTick();}, 1000);
    }

    this.update = function () {


    }

    this.display = function () {
        this.unowned.display();
        this.timer.display();
        if (this.gameover == false){
            for (i in this.cards) {
                this.cards[i].display();
            }
        }

    }

    this.buttonPress = function (button) {
        clearInterval(this.timerInterval);
        console.log('button press');
        this.roundOn = false;
        this.cards[button].selected = true;
        me = this
        setTimeout( function () {
            me.nextQuote();}, 500);
    }

    this.nextQuote = function () {
        if (this.noOwn == true) {
            this.unowned.addQuote(this.myQuote);
            this.noOwn = false;
        }

        if (this.quotes.length > 0) {
            this.myQuote = this.quotes.pop();
            for (card in this.cards) {
                this.cards[card].selected = false;
                this.cards[card].lies = false;
                this.cards[card].beginning = false;
                this.cards[card].quote = this.myQuote;
            }
            this.roundOn = true;
            this.timer.reset();
            me = this;
            this.timerInterval = setInterval(function () {
                me.timerTick();}, 1000);
        } else {
            console.log("GAME OVER YOOOOO!");
            this.gameover = true;
            setTimeout( function () {
                window.location = "http://localhost:8000";
            }, 10000)
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
        if (ticking == false && this.roundOn == true) {            
            clearInterval(this.timerInterval);
            this.noOwn = true;
            for (card in this.cards) {
                this.cards[card].lies = true;
            }
            this.roundOn = false;
            me = this;
            setTimeout(function () {
                me.nextQuote();}, 500);
        } else if (ticking == false && this.roundOn == false) {
            clearInterval(this.timerInterval);
            me = this;
            setTimeout(function () {
                me.nextQuote();}, 500);
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
    this.unowned = new UnOwned();
    this.myQuote = '';
    this.gameover = false;

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
    this.lies = false;
    this.beginning = false;

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
                if (this.lies == true){
                    fill("#AA4B39");
                } else {
                    fill("#4470B1");
                }
                // fill('#ae4817');
                rect(this.x, this.y, this.width, this.height);
                strokeWeight(0);
                fill(255);
                textFont(exo);
                textSize(32);
                text(this.name, this.x, this.y - this.height*.25 );
                textFont(forum);
                textSize(26);
                if (this.beginning == true){
                   text("Instructions: If the quote that appears on the card is yours, press the button in front of you to own up to it!", this.x, this.y + this.height*.1, this.width*.9, this.height*.55); 
                } else {
                    text(this.quote, this.x, this.y + this.height*.1, this.width*.9, this.height*.55);
                }
            pop();
        } else {
            push();

                //show extra highlighting rectangle
                translate(windowWidth/2, windowHeight/2);
                angleMode(DEGREES);
                rectMode(CENTER);
                textAlign(CENTER);
                rotate(this.angle);
                // rect(this.x, this.y, this.width + this.width*.1, this.height + this.height*.1);
                strokeWeight(0);
                stroke('#333030');
                fill("#3EBF72");
                // fill("#395124");
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
        this.currTime = 10;
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
            textFont(forum);
            strokeWeight(0);
            textSize(42);
            fill("#C9DAF4");
            text(this.currTime, this.x, this.y);
        pop();

    }
}

// Background quotes that weren't owned
var UnOwned = function () {
    this.words = []

    this.addQuote = function ( quote ) {
        newWord = { 
            "text": quote,
            "x": random(windowWidth),
            "y": random(windowHeight),
            "rotate": floor(random(360))
        };
        this.words.push(newWord);
        console.log(this.words);
    }

    this.display = function () {
        for (i in this.words) {
            push();
                angleMode(DEGREES);
                rectMode(CENTER);
                textFont(nimbus);
                textSize(24);
                strokeWeight(0);
                fill('#ECC118');
                translate(this.words[i].x, this.words[i].y);
                rotate(this.words[i].rotate);
                text(this.words[i].text, 0, 0);
            pop();
        }

    }
}

function keyPressed() {
    if (keyCode === ENTER && myGame.roundOn == true) {
        myGame.buttonPress(1);
    }
}

socket.on('button1', function () {
    if (myGame.roundOn == true && activeButtons[0] == true){
        myGame.buttonPress(0);
    }
});

socket.on('button2', function () {
    if (myGame.roundOn == true && activeButtons[1] == true) {
        myGame.buttonPress(1);
    }
});
socket.on('button3', function () {
    if (myGame.roundOn == true && activeButtons[2] == true) {
        myGame.buttonPress(2);
    }
});
socket.on('button4', function () {
    if (myGame.roundOn == true && activeButtons[3] == true) {
        myGame.buttonPress(3);
    }
});

function make_AJAX_call(data, tryCount, retryLimit){
    $.ajax({
        type: 'GET',
        url: "http://quantifiedselfbackend.local:6060/ownup/quotes",
        data: data,
        success: function(data) {
            console.log(data.data);
            allPlayers.push(data.data);
            if (allPlayers.length == totalPlayers){
                getGoing();
            }
        },
        error: function(resp) {
            console.log("Error: Ajax call failed");
            tryCount++;
            if (tryCount >= retryLimit){
                window.location = "http://localhost:8000?error=try_again";
            }
            else { //Try again with exponential backoff.
                setTimeout(function(){ 
                    return make_AJAX_call(data, tryCount, retryLimit);
                }, Math.pow(2, tryCount) * 1000);
                return false;
            }
        }
    });
    return false;
}

function preload() {
    exo = loadFont('static/font/exo/Exo-Black.otf');
    forum = loadFont('static/font/forum/Forum-Regular.otf');
    nimbus = loadFont('static/font/nimbus-mono/nimbusmono-regular.otf');
    // Grab URL Params
    // Get each users' exhibit data
    // Add to global players array
    var baseurl = 'http://quantifiedselfbackend.local:6060/ownup/quotes?';
    urlparams = getURLParams();
    totalPlayers = Object.keys(urlparams).length;
    for (key in Object.keys(urlparams)){ 
        thing = Object.keys(urlparams)[key]; 
        userid = urlparams[thing];
        make_AJAX_call({rfid: userid}, 0, 3);
        
    }
    

    // allPlayers = [{"quotes":["I've never actually seen a hamburger because they aren't that cool and I really don't want them or whatever.",
    //                          "I'm not wild about Power Rangers anymore."],
    //             "name": "Joey Fatone"},
    //             {"quotes":["Are cheetos made from cheetahs?",
    //                        "Soldiers are brave and I stick to that."],
    //              "name": "Robert McNamara"},
    //             {"quotes":["The tooth fairy does exist.",
    //                         "In ten years there will be flying cars."],
    //              "name": "Stacey Popstar"},
    //             {"quotes":["The atomic bomb split time in half.",
    //                          "Ferrets were created by The Devil."],
    //              "name": "Bob Dylan"}];
 
}

function setup() {
    myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent('processing');
    angleMode(DEGREES);
    rectMode(CENTER);
    textAlign(CENTER);
}

function getGoing () {
    myGame = new Game(allPlayers);
    myGame.start();
    ready = true;
}

//Do I really want a draw loop?
function draw() {
    background("#303741");
    // background("#38230F");
    if (ready == true){
        myGame.update();
        myGame.display();
    } else {
        push();
            textFont(forum);
            strokeWeight(0);
            textSize(42);
            fill("#C9DAF4");
            text("Hold on while we load up your quotes!", windowWidth/2, windowHeight/2);
        pop();
    }
}

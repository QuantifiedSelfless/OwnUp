

function preload() {
    replay = loadFont('static/BPreplay/BPreplay.otf');
    //grab user data
    players = [{}]
 
}

function setup() {
    myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent('processing');
    
}

function draw() {
    background(255);
    myGame.update();
    myGame.display();
}

//Full Game
var Game = function (players) {
    this.numPlay = players.length;

    this.update = function () {

    }

    this.display = function () {

    }

    this.addPlayer = function () {

    }

}

var Card = function () {

    // Basic Card Display
    // Needs to support a special case if selected
    this.display = function () {

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

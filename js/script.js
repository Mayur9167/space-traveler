
var myGamePiece;
var myObstacles = [];
var myScore;

var myHighScore;



function startGame() {
    myGamePiece = new component(30, 30, "spaceship.png", 200, 550,"image");
    myScore = new component("20px", "Consolas", "black", 320, 40, "text");
    myHighScore = new component("25px", "Consolas", "black", 10, 40, "text");
    myGameArea.start();
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37:
                moveleft();
                break;
            case 38:
                moveup();
                break;
            case 39:
                moveright();
                break;
            case 40:
                movedown();
                break;
        }
    }
    
    document.onkeyup = function(e) {
        clearmove();
    }
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y,type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
      }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image,
              this.x,
              this.y,
              this.width, this.height);
          } else {
        ctx.fillStyle = color;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
          } else {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }    
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var y, width, gap, minWidth, maxWidth, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            // update high score
            if (myGameArea.frameNo > getHighScore()) {
                setHighScore(myGameArea.frameNo);
            }
            return;
        } 
    }
    myGameArea.clear();

    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        y = 40;
        minWidth = 20;
        maxWidth = 200;
        width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
        minGap = 80;
        maxGap = 100;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(width, 15, "green", 0, y));
        myObstacles.push(new component( width +width + gap, 15, "green", width + gap, y));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y += 1;
        myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myHighScore.text = "HIGH SCORE: " + getHighScore();
    myHighScore.update();

    function getHighScore() {
        // retrieve high score from local storage or default to 0
        return localStorage.getItem("highscore") || 0;
    }
    
    function setHighScore(score) {
        // store high score in local storage
        localStorage.setItem("highscore", score);
    }
    myGamePiece.newPos();    
    myGamePiece.update();
}



function getHighScore() {
    // retrieve high score from local storage or default to 0
    return localStorage.getItem("highscore") || 0;
}

function setHighScore(score) {
    // store high score in local storage
    localStorage.setItem("highscore", score);
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function moveup() {
    myGamePiece.speedY = -2; 
}

function movedown() {
    myGamePiece.speedY = 2; 
}

function moveleft() {
    myGamePiece.speedX = -2; 
}

function moveright() {
    myGamePiece.speedX = 2; 
}

function clearmove() {
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}




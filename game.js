var canvas = document.getElementById("ctx");
var c = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 500;
var frameCount = 0;
var keys = [];
var scene = "game";
var game;
var spawn = {
	x: 0,
	y: 0
}
var bSquares = [];

{
var music = new buzz.sound("music/Nowhere-Land.mp3");
	music.setVolume(20).loop().play();
	var jump = new buzz.sound("soundfx/Jump.wav");
	jump.setVolume(20);
	var wallJump = new buzz.sound("soundfx/Wall-Jump.wav");
	wallJump.setVolume(20);
	var coin = new buzz.sound("soundfx/Coin.wav");
	coin.setVolume(30);
	var coin2 = new buzz.sound("soundfx/Coin2.wav");
	coin2.setVolume(30);
	var portal = new buzz.sound("soundfx/Portal.wav");
	portal.setVolume(40);
	var dead = new buzz.sound("soundfx/Dead.wav");
	dead.setVolume(60);
	var boing = new buzz.sound("soundfx/Boing.wav");
	boing.setVolume(100);
	var bboing = new buzz.sound("soundfx/Big-Boing.wav");
	bboing.setVolume(100);
}

var Camera = {}

function random(min, max) {
	var w = max-min;
	return Math.random()*w+min;	
}
            
function rectCollide(a, b) {
	return a.x+a.width > b.x && a.y+a.height > b.y && a.x < b.x+b.width && a.y < b.y+b.height;    
}

function cornerCenter(a, b) {
    return a.x+a.width > b.x-b.width/2 && a.y+a.height > b.y-b.height/2 && a.x < b.x+b.width/2 && a.y < b.y+b.height/2;
}

function triangle(x1, y1, x2, y2, x3, y3) {
	c.beginPath();
	c.moveTo(x1, y1);
	c.lineTo(x2, y2);
	c.lineTo(x3, y3);
	c.fill();
}

var Particle = function(x, y, velx, vely, s, color) {
	this.x = x;
	this.y = y;
	this.velx = velx;
	this.vely = vely;
	this.s = s;
	this.color = color;
	this.r = Math.random()*Math.PI*2;
	this.rs = random(0, 0.4);	
}
			
Particle.prototype.draw = function() {
	c.save();
	c.translate(this.x, this.y);
	c.rotate(this.r);
	c.fillStyle = this.color;
	c.fillRect(-this.s/2, -this.s/2, this.s, this.s);
	c.restore();	
}
			
Particle.prototype.update = function() {
	this.x+=this.velx;
	this.y+=this.vely;
	this.s-=0.4;
	this.r+=this.rs;	
}

var particles = [];

var Coin = function(x, y) {
	this.x = x;
	this.y = y;
	this.width = 30;
	this.height = 30;
};

Coin.prototype.draw = function() {
	c.save();
	c.translate(this.x, this.y);
	c.scale(Math.sin(frameCount/20), 1);
	
	c.fillStyle = "#CCE014";
	
	c.beginPath();
	c.arc(0, 0, this.width/2, 0, Math.PI*2, true);
	c.fill();
	
	c.fillStyle = "#E1F716";
	
	c.beginPath();
	c.arc(0, 0, this.width/2-4, 0, Math.PI*2, true);
	c.fill();
	
	c.restore();
};

var coins = [];

var ElecOrb = function(x, y) {
	this.originX = x;
	this.originY = y;
	this.x = x+10;
	this.y = 0;
	this.width = 30;
	this.height = 30;
	
	this.r = random(0, Math.PI*2);
};

ElecOrb.prototype.draw = function() {
	c.strokeStyle = "#BDCF1B";
	c.lineWidth= 3;
	
	c.save();
	
	c.translate(this.x, this.y);
	c.rotate((frameCount+this.r)/30);
	c.scale(1, Math.sin((frameCount+this.r)/20));
	
	c.beginPath();
	c.arc(0, 0, this.width/2, 0, Math.PI*2, true);
	c.stroke();
	
	c.restore();
	
	c.save();
	
	c.translate(this.x, this.y);
	c.rotate((frameCount+this.r)/30);
	c.scale(Math.cos((frameCount+this.r)/20+Math.PI), 1);
	
	c.beginPath();
	c.arc(0, 0, this.width/2, 0, Math.PI*2, true);
	c.stroke();
	
	c.restore();
};

ElecOrb.prototype.update = function() {
	this.x = Math.cos(frameCount/20+this.r)*120+this.originX;
	this.y = Math.sin(frameCount/20+this.r)*120+this.originY;
};

var orbs = [];

var Block = function(x, y, width, height, type) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.type = type;    
};
                        
Block.prototype.draw = function() {
	switch(this.type) {
		case "normal":
			c.fillStyle = "rgb(10, 10, 10)";
			c.fillRect(this.x, this.y, this.width, this.height);
			break;	
		case "phantomblock":
			c.fillStyle = "rgb(10, 10, 10)";
			c.fillRect(this.x, this.y, this.width, this.height);
			break;
		case "portal":
			c.fillStyle = "rgb(100, 0, 255)";
			c.beginPath();
			c.arc(this.x+this.width/2, this.y+this.height/2, this.width+Math.sin(frameCount)/2-10, 0, Math.PI*2, true);
			c.fill();
			
			var px = random(this.x-20, this.x+this.width+20);
			var py = random(this.y-20, this.y+this.height+20);
			
			particles.push(new Particle(px, py, ((this.x+this.width/2)-px)/17, ((this.y+this.height/2)-py)/17, 5, "rgb(100, 0, 255)"));
			
			var px = random(this.x-20, this.x+this.width+20);
			var py = random(this.y-20, this.y+this.height+20);
			
			particles.push(new Particle(px, py, ((this.x+this.width/2)-px)/17, ((this.y+this.height/2)-py)/17, 5, "rgb(100, 0, 255)"));
			
			break;
		case "bspike":
			c.fillStyle = "rgb(200, 0, 0)";
			triangle(this.x+this.width/2, this.y, this.x+this.width, this.y+this.height, this.x, this.y+this.height);
			break;
		case "sspike":
			c.fillStyle = "rgb(200, 0, 0)";
			triangle(this.x+this.width/6, this.y, this.x+this.width/3, this.y+this.height, this.x, this.y+this.height);
			c.save();
			c.translate(this.width/3, 0);
			triangle(this.x+this.width/6, this.y, this.x+this.width/3, this.y+this.height, this.x, this.y+this.height);
			c.restore();
			
			c.save();
			c.translate(this.width/3*2, 0);
			triangle(this.x+this.width/6, this.y, this.x+this.width/3, this.y+this.height, this.x, this.y+this.height);
			c.restore();
			break;
		case "bounce":
			c.fillStyle = "rgb(0, 100, 255)";
			c.fillRect(this.x, this.y, this.width, this.height);
			
			particles.push(new Particle(random(this.x, this.x+this.width), this.y, 0, random(-5, 0), random(0, 6), "rgb(0, 100, 255)"));
			particles.push(new Particle(random(this.x, this.x+this.width), this.y, 0, random(-5, 0), random(0, 6), "rgb(0, 100, 255)"));
			break;
		case "lava":
			c.fillStyle = "rgb(200, 0, 0)";
			c.fillRect(this.x, this.y, this.width, this.height);
			
			particles.push(new Particle(random(this.x+5, this.x+this.width-5), random(this.y, this.y+this.height-5), 0, random(-2, 0), random(0, 6), "rgb(170, 0, 0)"));
			break;
		case "electric":
			
			c.fillStyle = "rgb(10, 10, 10)";
			c.fillRect(this.x, this.y, this.width, this.height);
			
			c.fillStyle = "#E3ED24";
			c.beginPath();
			c.arc(this.x+this.width/2, this.y+this.height/2, this.width/3+random(-1, 1), 0, Math.PI*2, true);
			c.fill();
			
	}            
}
            
var level = 0;

var messages = [
	[
		{x: 100, y: 300, message: "Welcome to my world", size: 40},
		{x: 300, y: 340, message: "Use LEFT and RIGHT to move, and UP for jump.", size: 20},
		{x: 400, y: 380, message: "I hope you find your stay enjoyable", size: 20},
		{x: 815, y: 500, message: "Touch this to continue", size: 15}
	],
	[	
		{x: 100, y: 500, message: "I'm travelling to meet the king. Many safeguards have been placed to keep intruders out.", size: 25},
		{x: 700, y: 550, message: "Its a dangerous path, spikes and lava everywhere", size: 20}
	],
	[
		{x: 300, y: 300, message: "I can wall jump to get to higher places.", size: 20},
		{x: 300, y: 340, message: "Just cling onto a wall with LEFT or RIGHT then press UP", size: 20},
		{x: 300, y: 380, message: "You can essentially infinitely scale walls this way", size: 20},
		{x: 600, y: 210, message: "A coin! Grab it! There's one in every level.", size: 15},
	],
	[
		{x: 300, y: 300, message: "The journey will be dangerous...", size: 30},
		{x: 320, y: 340, message: "but I have to meet the king.", size: 20}
	],
	[
		{x: 60, y: 700, message: "Jumping while on the blue pads really propells me upwards.", size: 20},
		{x: 60, y: 720, message: "(also, avoid the electric orbs. they kill you)", size: 18}
	],
	[
		{x:500, y:300, message: "Some blocks are just illusions...", size:25}
	],
	[
		{x:200, y:200, message: "So much lava in a place like this?!", size: 30},
		{x:250, y:250, message: "That's definitely unnatural, definitely a trap set by the king", size: 25},
		{x:300, y:300, message: "It's almost as if he's trying to keep me out...", size: 30}
	],
	[
		
	]
];

var levels = [
	[
		"....................................",
		".                                  .",
		".     c                            .",
		".   ....                           .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".   P                             p.",
		".                                  .",
		".                                  .",
		"...................................."
	],
	[
		"....................................................",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                       c                          .",
		".                                                  .",
		".:::::........................................:::::.",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".                                                  .",
		".  P                                              p.",
		".                              s^s   .llll.        .",
		"...................................................."
	],
	[
		"....................................",
		".                                  .",
		".                                 p.",
		".                                  .",
		".                                  .",
		".                                  .",
		".         ..........................",
		".                                  .",
		".                                  .",
		".                             c    .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		".                                  .",
		"..........................         .",
		".                                  .",
		".  P                               .",
		".                                  .",
		"...................................."
	],
	[
		".......................................................................",
		".                                                                     .",
		".                                                                     .",
		".                             .                                       .",
		".                             .                                       .",
		".                      p      .                                       .",
		".                      ...    .      ...         ...                  .",
		".                                                           ...       .",
		".                                                                     .",
		".                                                                     .",
		".                                                                     .",
		".                                                                     .",
		".                                                                    ^.",
		".                                                                    ..",
		".                                                                  ^...",
		".                                                                  ....",
		".                                                                ^.....",
		".                                          s^^....:....................",
		".  P                           s  ................        .............",
		".             ......llllllllll....................      c .............",
		".......................................................................",
	],
	[
		"......................................",
		".                                    .",
		".                                    .",
		".                                    .",
		".                                    .",
		".                                    .",
		".             p                      .",
		".  ..................                .",
		".  .                                 .",
		".  .                          b      .",
		".  .                          .      .",
		".  .                                 .",
		".  .                                 .",
		".  .                                 .",
		".  .   c               e             .",
		".  .                                 .",
		".  .                                 .",
		".............. b                     .",
		".              e                     .",
		".                                    .",
		".                                    .",
		".                             b      .",
		".                             ........",
		".                                    .",
		".                    b               .",
		".                    .               .",
		".                                    .",
		".                                    .",
		".                         e          .",
		".                                    .",
		".                            .........",
		".                 b                  .",
		".                 .                  .",
		".                .                   .",
		".   P           .                    .",
		".              .                     .",
		".             .                      .",
		"......................................"
	],
	[
		"............................................",
		".                                          .",
		".          c                               .",
		".                                          .",
		".::::....                                  .",
		".                                          .",
		".                                          .",
		".                                          .",
		".                                          .",
		".                                          .",
		".                                          .",
		".                                          .",
		".                                          .",
		".                .                         .",
		".            .    ::::::::                 .",
		". P       ..lllllllllllllll..           :::.",
		".     ......lllllllllllllll.....        :  .",
		".  .............................        : p.",
		"............................................"
	],
	[
		"................................................................................................",
		".                                                                                              .",
		".                      c                                                                       .",
		".                    .............                                                             .",
		".                                .                                                             .",
		".                                .                                                             .",
		".                                .                                                             .",
		".                                .                                                             .",
		".                                                                                              .",
		".                                    .                                                         .",
		".                                                                                              .",
		".                                             .                                                .",
		".  P                                                                                           .",
		".                                                .                                             .",
		".                                                                                           p  .",
		"....................      .                             .                        ...............",
		"...................                          .                                     .............",
		"...................                 .                                            ...............",
		"....................                                                .             ..............",
		"...................                                                            .................",
		"....................                                                              ..............",
		"..................                                                              ................",
		"...................                                                              ...............",
		"....................lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll...............",
		"....................llllllllllllllllllllllllllllllllllllllllllllllllllllllllllll................",
		"................................................................................................",
	],
	[
		".............................................................",
		".                                                           .",
		".   P                                                       .",
		".                                                           .",
		".............................................               .",
		".                                                           .",
		".                                                           .",
		".                                                   ^^^^^^^^.",
		".                  ..........................................",
		".                  .                                        .",
		".                  .                                        .",
		".                  .                                        .",
		".      ^           .                                        .",
		".      .           .                                     p  .",
		".         ^        .          ...............................",
		".         .        .          .                             .",
		".                  .          .                    c        .",
		".                  .          .                             .",
		".   ^              .          .                             .",
		".   .              .          .                 .           .",
		".                  .                                        .",
		".          ^       .                       .                .",
		".          .               .                                .",
		".                  ..          .      .                     .",
		".llllllllllllllllll.                                        .",
		".llllllllllllllllll.llllllllllllllllllllllllllllllllllllllll.",
		".llllllllllllllllll.llllllllllllllllllllllllllllllllllllllll.",
		"............................................................."
	]
];

var blocks = [];
            
for (var i = 0 ; i < levels.length ; i++) {
	blocks.push([]);
	orbs.push([]);
	coins.push([]);
	for (var t = 0 ; t < levels[i].length ; t++) {
		for (var j = 0 ; j < levels[i][t].length ; j++) {
			switch(levels[i][t][j]) {
				case ".":
					blocks[i].push(new Block(j*27, t*27, 28, 28, "normal"));
					break;
				case "p":
					blocks[i].push(new Block(j*27+3, t*27+3, 21, 21, "portal"));
					break;
				case "^":
					blocks[i].push(new Block(j*27, t*27+5, 28, 26, "bspike"));
					break;
				case "s":
					blocks[i].push(new Block(j*27, t*27+18, 28, 10, "sspike"));
					break;
				case "b":
					blocks[i].push(new Block(j*27, t*27+23, 28, 5, "bounce"));
					break;
				case "l":
					if (levels[i][t-1][j] === "l") {
						blocks[i].push(new Block(j*27, t*27+1, 28, 28, "lava"));
					} else {
						blocks[i].push(new Block(j*27, t*27+7, 28, 15+8, "lava"));
					}
					break;
				case "e":
					blocks[i].push(new Block(j*27, t*27, 28, 28, "electric"));
					orbs[i].push(new ElecOrb(j*27+14, t*27+14));
					break;
				case "c":
					coins[i].push(new Coin(j*27, t*27));
					break;
				case ":":
					blocks[i].push(new Block(j*27, t*27, 28, 28, "phantomblock"));
					break;
				case "P":
					if (i === level) {
						spawn.x = j*27;
						spawn.y = t*27;
					}
			}
		}   
	}
}
                        
var Player = function() {
	this.x = spawn.x;
	this.y = spawn.y;
	this.width = 23;
	this.height = 23;
	
	this.velX = 0;
	this.velY = 0;
	this.falling = true;
	
	this.clingWall = "none";
	this.wallJumped = false;
	
	this.coins = 0;
	this.coinFade = 0;
	this.coinFadeTimer = 0;
	this.coinTextSize = 20;
	
}
            
Player.prototype.draw = function() {
	c.strokeStyle = "rgb(100, 0, 0)";
	c.lineWidth = 3;
	c.strokeRect(this.x, this.y, this.width, this.height);   
}
            
Player.prototype.interact = function() {
    
    if (keys["ArrowLeft"]) {
        this.velX-=0.5;
    }
                
    if (keys["ArrowRight"]) {
        this.velX+=0.5;
    }
                
    if (keys["ArrowUp"] && !this.falling) {
        this.velY-=8;
		if (this.clingWall !== "none") {
			for (var i = 0 ; i < 8 ; i++) {
				particles.push(new Particle(this.x+this.width/2, this.y+this.height/2, Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, 6, "rgb(200, 0, 0)"));
			}
			wallJump.play();
		} else {
			jump.play();
		}
		if (this.clingWall === "left") {
			this.velX += 6;
		}
		if (this.clingWall === "right") {
			this.velX -= 6;
		}
    }
    this.falling = true;
	this.clingWall = "none";
                
    this.velY+=0.3;
                
    this.x+=this.velX;
    this.collide(this.velX, 0);
    this.y+=this.velY;
    this.collide(0, this.velY);
                
	this.velX /= 1.1;
	
	if (frameCount%3 === 0 && this.velX < -0.7) {
		particles.push(new Particle(this.x+this.width, this.y+this.height, Math.cos(random(0, Math.PI*2)), Math.sin(random(0, Math.PI*2)), 4, "rgb(100, 0, 0)"));
	}
	
	if (frameCount%3 === 0 && this.velX > 0.7) {
		particles.push(new Particle(this.x, this.y+this.height, Math.cos(random(0, Math.PI*2)), Math.sin(random(0, Math.PI*2)), 4, "rgb(100, 0, 0)"));
	}
	
	this.coinFadeTimer--;
	
	if (this.coinFadeTimer > 30) {
		this.coinFade += (1-this.coinFade)/5;
	}
	 
	if (this.coinFadeTimer === 30) {
		this.coins++;
	}
	
	if (this.coinFadeTimer === 30) {
		this.coinTextSize = 22;
	}
	
	if (this.coinFadeTimer === 20) {
		this.coinTextSize = 20;
	}
	
	if (this.coinFadeTimer < 10) { 
		this.coinFade += (0-this.coinFade)/5;
	}
	
}

Player.prototype.collide = function(velX, velY) {
	for (var i = 0 ; i < coins[level].length ; i++) {
		if (cornerCenter(this, coins[level][i])) {
			coin.play();
			this.coinFadeTimer = 50;
			coins[level].splice(i, 1);
			
		}
	}
	for (var i = 0 ; i < orbs[level].length ; i++) {
		if (cornerCenter(this, orbs[level][i])) {
			this.die();
		}
	}
	for (var i = 0 ; i < blocks[level].length ; i++) {
		if (!(blocks[level][i].x > -Camera.x+330 && blocks[level][i].x < Camera.x + 420 && blocks[level][i].y > -Camera.y+120 && blocks[level][i].y < Camera.y + 300)) {
			continue;
		}
        if (rectCollide(this, blocks[level][i]) && (blocks[level][i].type === "normal" || blocks[level][i].type === "electric")) {
            if (velX > 0) {
                this.velX = 0;
                this.x = blocks[level][i].x-this.width;
				if (keys["ArrowRight"]) {
					this.clingWall = "right";
					if (frameCount%2 === 0 && this.velY > 0.4) {
						particles.push(new Particle(this.x+this.width, this.y, Math.cos(random(0, Math.PI*2)), Math.sin(random(0, Math.PI*2)), 4, "rgb(10, 10, 10)"));
					}
					this.velY/=1.1;
					if (this.velY > -0.3 && this.velY < 0.3) {
						this.falling = false;
					}
					this.wallJumped = true;
				} else {
					this.clingWall = "none";
				}
            }
            if (velX < 0) {
                this.velX = 0;
                this.x = blocks[level][i].x+blocks[level][i].width;
				if (keys["ArrowLeft"]) {
					this.clingWall = "left";
					if (frameCount%2 === 0 && this.velY > 0.4) {
						particles.push(new Particle(this.x, this.y, Math.cos(random(0, Math.PI*2)), Math.sin(random(0, Math.PI*2)), 4, "rgb(10, 10, 10)"));
					}
					this.velY/=1.1;
					if (this.velY > -2 && this.velY < 0.3) {
						this.falling = false;
					}
					this.wallJumped = true;
				} else {
					this.clingWall = "none";
				}
            }
            if (velY > 0) {
                this.velY = 0;
                this.y = blocks[level][i].y-this.height;
				this.wallJumped = false;
				this.falling = false;
            }
            if (velY < 0) {
                this.velY = 0;
                this.y = blocks[level][i].y+blocks[level][i].height;
            	this.falling = true;
			}
			continue;
        }
		if (rectCollide(this, blocks[level][i]) && (blocks[level][i].type === "bounce")) {
            if (velX > 0) {
                this.velX = 0;
                this.x = blocks[level][i].x-this.width;
            }
            if (velX < 0) {
                this.velX = 0;
                this.x = blocks[level][i].x+blocks[level][i].width;
            }
            if (velY > 0) {
                this.velY = -3;
                this.y = blocks[level][i].y-this.height;
				this.falling = false;
				
				if (keys["ArrowUp"]) {
					for (var i = 0 ; i < 20 ; i++) {
						particles.push(new Particle(this.x+this.width/2, this.y+this.height/2,	Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, 8, "#2257D4"));
					}
				} else {
					for (var i = 0 ; i < 20 ; i++) {
						particles.push(new Particle(this.x+this.width/2, this.y+this.height/2,	Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, 5, "#2257D4"));
					}
				}
				
				if (keys["ArrowUp"]) {
					jump.stop();
					bboing.play();
				} else {
					boing.play();
				}
				
            }
            if (velY < 0) {
                this.velY = 0;
                this.y = blocks[level][i].y+blocks[level][i].height;
            	this.falling = true;
			}
			continue;
        }
		if (rectCollide(this, blocks[level][i]) && (blocks[level][i].type === "bspike"|| blocks[level][i].type === "sspike")) {
            if (velX > 0) {
                this.velX = 0;
                this.x = blocks[level][i].x-this.width;
            }
            if (velX < 0) {
                this.velX = 0;
                this.x = blocks[level][i].x+blocks[level][i].width;
            }
            if (velY > 0) {
                this.velY = 0;
                this.die();
            }
            if (velY < 0) {
                this.velY = 0;
                this.y = blocks[level][i].y+blocks[level][i].height;
            	this.falling = true;
			}
			continue;
        }
		if (rectCollide(this, blocks[level][i]) && (blocks[level][i].type === "lava")) {
			this.die();
		}
		if (rectCollide(this, blocks[level][i]) && (blocks[level][i].type === "portal")) {
			portal.play();
			level++;
			for (var i = 0 ; i < levels[level].length ; i++) {
				for (var t = 0 ; t < levels[level][i].length ; t++) {
					if (levels[level][i][t] === "P") {
						this.x = t*28;
						this.y = i*28;
						spawn.x = t*28;
						spawn.y = i*28;
						break;
					}
				}
			}
			this.velX = 0;
			this.velY = 0;
			particles = [];
			game.t = 1;
			break;
		}
	}
}

Player.prototype.die = function() {
	dead.play();
	for (var i = 0 ; i < 20 ; i++) {
		particles.push(new Particle(this.x+this.width/2, this.y+this.height/2, Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, 10, "rgb(200, 0, 0)"));
	}
	game.dTimer = 60;
	this.falling = false;
}
            
var bob = new Player();

Camera.x = bob.x;
Camera.y = bob.y;

for (var i = 0 ; i < 700 ; i+=30) {
	for (var t = 0 ; t < 500 ; t+=30) {
		var r = Math.round(random(220, 255));
		bSquares.push({x: i, y: t, c: "rgb("+r+","+r+","+r+")"});
	}
}

var Game = function() {
	this.t = 0;
	this.dTimer = 0;
};

Game.prototype.interact = function() {
	
	/*for (var i = 0 ; i < bSquares.length ; i++) {
		c.fillStyle = bSquares[i].c;
		var x = bSquares[i].x+Camera.x/4;
		var y = bSquares[i].y+Camera.y/4;
		if (x > 700) {
			var l = x-700-30;
			x = l;
		}
		if (y > 500) {
			var l = y-500-30;
			y = l;
		}
		c.fillRect(x, y, 30, 30);
	}*/
	
	Camera.x += (bob.x-Camera.x)/5;
    Camera.y += (bob.y-Camera.y)/5;
	
	if (levels[level][0].length*27 < 700) {
		Camera.x = (levels[level][0].length*27)/2;
	} else if (Camera.x < 339) {
		Camera.x = 339;
	} else if (Camera.x > levels[level][0].length*27-361) {
		Camera.x = levels[level][0].length*27-361;
	}
	
	if (levels[level].length*27 < 500) {
		Camera.y = (levels[level].length*27)/2;
	} else if (Camera.y < 240) {
		Camera.y = 240;
	} else if (Camera.y > levels[level].length*27-265) {
		Camera.y = levels[level].length*27-265;
	}
	
	c.save();
	
	c.translate(-Camera.x + 350-bob.width/2, -Camera.y+250-bob.height/2);
	
	for (var i = 0 ; i < blocks[level].length ; i++) {
		if (blocks[level][i].x > -Camera.x+330 && blocks[level][i].x < Camera.x + 360 && blocks[level][i].y > -Camera.y+220 && blocks[level][i].y < Camera.y + 260) {
			blocks[level][i].draw();
		}
	}
	
	for (var i = 0 ; i < coins[level].length ; i++) {
		coins[level][i].draw();
	}
	
	for (var i = 0 ; i < orbs[level].length ; i++) {
		orbs[level][i].draw();
		orbs[level][i].update();
	}
	
	for (var i = 0 ; i < particles.length ; i++) {
		particles[i].draw();
		particles[i].update();
		if (particles[i].s <= 0) {
			particles.splice(i, 1);
			i--;
		}
	}
	
	for (var i = 0 ; i < messages[level].length ; i++) {
		var t = messages[level][i];
		c.font = t.size+"px Abel";
		c.fillStyle = "#000000";
		c.fillText(t.message, t.x, t.y);
	}
	
	if (this.dTimer < 0) {
		bob.draw();
		bob.interact();
	}
	
	c.restore();
	
	c.font = bob.coinTextSize+"px Abel";
	c.fillStyle = "rgba(0, 0, 0, "+bob.coinFade+")";
	c.fillText("Coins: "+bob.coins, 40, 50);
	
	c.fillStyle = "rgba(255, 255, 255,"+this.t+")";
	c.fillRect(0, 0, 700, 500);
	
	this.t-=0.08;
	
	if (this.t <= 0) {
		this.t = 0;
	}
	
	this.dTimer-=1;
	
	if (this.dTimer === 0) {
		portal.play();
		this.t = 1;
		bob.x = spawn.x;
		bob.y = spawn.y;
		bob.velX = 0;
		bob.velY = 0;
	}
	
}

var game = new Game();

function init() {
	window.requestAnimationFrame(draw);
}

init();

function draw() {
	for (var i = 0 ; i < bSquares.length ; i++) {
		c.fillStyle = bSquares[i].c;
		c.fillRect(bSquares[i].x, bSquares[i].y, 30, 30);
	}
	switch(scene) {
		case "game":
			game.interact();
			break;
	}
	frameCount++;
	window.requestAnimationFrame(draw);
}
            
window.addEventListener("keydown", function(e) {
    keys[e.key] = true;
	e.preventDefault();
});

window.addEventListener("keyup", function(e) {
    keys[e.key] = false;
	e.preventDefault();
});
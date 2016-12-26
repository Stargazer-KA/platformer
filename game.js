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

var sounds = [];

var music = new buzz.sound("music/Nowhere-Land.mp3");
music.setVolume(20).loop().play();

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

var particles = [];

var coins = [];

var orbs = [];
            
var level = 0;

var messages = [
	[]
];

var levels = [
	[
		".......................................",
		".                                     .",
		".                                     .",
		".                                     .",
		".                                     .",
		".                                     .",
		".                                     .",
		".                                     .",
		".                                     .",
		".                                     .",
		".                                     .",
		".                                     .",
		".                                     .",
		".                                     .",
		".                                     .",
		".                                     .",
		"..                                    .",
		".                                     .",
		"..                                S   .",
		".  P           ........................",
		".           ^^.........................",
		"......................................."
	]
];

var enemies = [];

var blocks = [];
            
for (var i = 0 ; i < levels.length ; i++) {
	blocks.push([]);
	orbs.push([]);
	coins.push([]);
	enemies.push([]);
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
					break;
				case "S":
					enemies[i].push(new Strotter(j*27, t*27, 23, 23));
					break;
			}
		}   
	}
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
	
	for (var i = 0 ; i < enemies[level].length ; i++) {
		enemies[level][i].draw();
		enemies[level][i].update();
		if (enemies[level][i].dead) {
			enemies[level].splice(i, 1);
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
		sounds.push(new buzz.sound("soundfx/Portal.wav").setVolume(40));
		
		this.t = 1;
		bob.x = spawn.x;
		bob.y = spawn.y;
		bob.velX = 0;
		bob.velY = 0;
		enemies[level] = [];
	
		for (var i = 0 ; i < levels.length ; i++) {
			enemies.push([]);
			for (var t = 0 ; t < levels[i].length ; t++) {
				for (var j = 0 ; j < levels[i][t].length ; j++) {
					switch(levels[i][t][j]) {
						case "S":
							enemies[i].push(new Strotter(j*27, t*27, 23, 23));
							break;
					}
				}   
			}
		}
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
	for (var i = 0 ; i < sounds.length ; i++) {
		sounds[i].play();
		sounds.splice(i, 1);
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
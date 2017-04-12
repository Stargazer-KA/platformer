//Get the canvas element from the html file.
var canvas = document.getElementById("ctx");
//Get the context of the canvas and store it in variable c
var c = canvas.getContext("2d");
//Set the dimensions of the canvas to 700x500
canvas.width = 700;
canvas.height = 500;
//Defining a frame count, an array for handling key presses, a string for checking which state the program is in, a game object, a spawnpoint  for the player, and an array filled with sqaures for the backdrop.
var frameCount = 0;
var keys = [];
var scene = "game";
var game;
var spawn = {
	x: 0,
	y: 0
}
var bSquares = [];

//Array for handling multiple sounds at one time.
var sounds = [];

//Set the music and play it.
var music = new buzz.sound("music/Nowhere-Land.mp3");
music.setVolume(20).loop().play();

//Define a camera object.
var Camera = {}

//Define a random function
function random(min, max) {
	var w = max-min;
	return Math.random()*w+min;	
}

//Function for checking if object a is colliding with object b if and when objects a and b are anchored to the top right corner.
function rectCollide(a, b) {
	return a.x+a.width > b.x && a.y+a.height > b.y && a.x < b.x+b.width && a.y < b.y+b.height;    
}

//Function for checking if object a is colliding with object b if and when object a is anchored to the top right corner, and object b is anchored to the center of itself.
function cornerCenter(a, b) {
    return a.x+a.width > b.x-b.width/2 && a.y+a.height > b.y-b.height/2 && a.x < b.x+b.width/2 && a.y < b.y+b.height/2;
}

//Function for drawing triangles.
function triangle(x1, y1, x2, y2, x3, y3) {
	c.beginPath();
	c.moveTo(x1, y1);
	c.lineTo(x2, y2);
	c.lineTo(x3, y3);
	c.fill();
}

function dist(x1, y1, x2, y2) {
	return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}

//Arrays for the particle, coin, orb, and bomb entities.
var particles = [];

var coins = [];

var orbs = [];

var bombs = [];

var bullets = [];

//Current level
var level = 0;

//Array that handles text on screen.
var messages = [
	[],
	[],
	[]
];

//Array that handles levels.
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
		".                          B          .",
		".                                     .",
		".                                     .",
		".           F                         .",
		"..                        F      QQQQ .",
		".                                     .",
		"..                    P               .",
		".              ........................",
		". p          ^.........................",
		"......................................."
	],
	[
		"............................................",
		".                                          .",
		".                                          .",
		".                               b          .",
		".                               b          .",
		".                               b          .",
		".                               b          .",
		".                               b          .",
		".  P                            b        p .",
		".                               b          .",
		"..........bbbbbbbbbbbbbbbbbbb...............",
		"..........                   ...............",
		"..........                   ...............",
		"..........                   ...............",
		"..........                   ...............",
		"..........                   ...............",
		"..........                   ...............",
		"..........lllllllllllllllllll...............",
		"............................................"
	]
];

//Arrays for the enemy and block entities.
var enemies = [];

var blocks = [];

//Processes the levels array and turns the text into readable blocks.
for (var i = 0 ; i < levels.length ; i++) {
	//Adds empty arrays to arrays filled with entities to seperate entities by level.
	blocks.push([]);
	orbs.push([]);
	coins.push([]);
	enemies.push([]);
    bombs.push([]);
	//Loop through the rows of the strings.
	for (var t = 0 ; t < levels[i].length ; t++) {
		//Loop through the individual characters in the strings.
		for (var j = 0 ; j < levels[i][t].length ; j++) {
			//A switch statement based off the character of the current string.
			switch(levels[i][t][j]) {
				case ".":
					blocks[i].push(new Block(j*27, t*27, 28, 28, "normal"));
					break;
				case "b":
					blocks[i].push(new Block(j*27, t*27, 28, 28, "breaker"));
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
				case "_":
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
					enemies[i].push(new Walker(j*27, t*27, 23, 23));
					break;
                case "B":
                    bombs[i].push(new Bomb(j*27, t*27, 0, 0, 23/2, 200));
					break;
				case "F":
					enemies[i].push(new Flyer(j*27, t*27, 23, 23));
					break;
                case "Q":
                    blocks[i].push(new Block(j*27, t*27, 28, 28, "bomb spawner"));
                    break;
			}
		}   
	}
}

//Creates a new instance of player called bob.
var bob = new Player();

//Sets the Camera x and y to the position of bob.
Camera.x = bob.x;
Camera.y = bob.y;

//Creates the sqaures in the background
for (var i = 0 ; i < 700 ; i+=30) {
	for (var t = 0 ; t < 500 ; t+=30) {
		var r = Math.round(random(220, 255));
		bSquares.push({x: i, y: t, c: "rgb("+r+","+r+","+r+")"});
	}
}

//Game class.
var Game = function() {
	//Initiallize two timer variables.
	this.t = 0;
	this.dTimer = 0;
    this.screenShake = 0;
    this.shakeX = 0;
    this.shakeY = 0;
};

//All the stuff going on in the game.
Game.prototype.interact = function() {
    
	//Moves the camera towards the player through easing
	Camera.x += (bob.x-Camera.x)/5;
    Camera.y += (bob.y-Camera.y)/5;
	
	//Limits the camera's movement to within the level
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
	
	//Moves the entities according to the player.
	c.translate(-Camera.x + 350-bob.width/2, -Camera.y+250-bob.height/2);
	
    c.translate(this.shakeX, this.shakeY);
    this.shakeX = random(-this.screenShake, this.screenShake);
    this.shakeY = random(-this.screenShake, this.screenShake);
    if (this.screenShake > 0.1) {
        this.screenShake/=1.5;
    }
    if (this.screenShake > 20) {
        this.screenShake = 20;
    }
    
	//Draws all blocks onscreen, and splices broken blocks.
	for (var i = 0 ; i < blocks[level].length ; i++) {
		if (blocks[level][i].x > -Camera.x+330 && blocks[level][i].x < Camera.x + 360 && blocks[level][i].y > -Camera.y+220 && blocks[level][i].y < Camera.y + 260) {
			blocks[level][i].draw();
		}
		if (blocks[level][i].destroyed) {
			for (var t = 0 ; t < 5 ; t++) {
				particles.push(new Particle(blocks[level][i].x+blocks[level][i].width/2, blocks[level][i].y+blocks[level][i].height/2, Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, 10, "rgb(20, 20, 20)"));
			}
			blocks[level].splice(i, 1);
			sounds.push(new buzz.sound("soundfx/Break.wav").setVolume(60));
			i--;
		}
	}
	
	//Draws all the coins.
	for (var i = 0 ; i < coins[level].length ; i++) {
		coins[level][i].draw();
	}
	
	//Draws all orbs
	for (var i = 0 ; i < orbs[level].length ; i++) {
		orbs[level][i].draw();
		orbs[level][i].update();
	}
	
	//Draws all the bombs.
	for (var i = 0 ; i < bombs[level].length ; i++) {
		if (bombs[level][i].timer > 3) {
			bombs[level][i].draw();
		}
		bombs[level][i].update();
		if (bombs[level][i].timer < 0) {
			bombs[level].splice(i, 1);
		}
	}
	
	//Draws all particles and deletes ones that have disappeared.
	for (var i = 0 ; i < particles.length ; i++) {
		particles[i].draw();
		particles[i].update();
		if (particles[i].s <= 0.1) {
			particles.splice(i, 1);
			i--;
		}
	}
	
	//Draws all enemies and deletes enemies that are dead
	for (var i = 0 ; i < enemies[level].length ; i++) {
		enemies[level][i].draw();
		enemies[level][i].update();
		if (enemies[level][i].dead) {
			enemies[level].splice(i, 1);
			i--;
		}
	}
	
    for (var i = 0 ; i < bullets.length ; i++) {
        bullets[i].draw();
        bullets[i].update();
        if (bullets[i].dead) {
            bullets.splice(i, 1);
            i--;
        }
    }
    
	//Draws all the messages onscreen 
	for (var i = 0 ; i < messages[level].length ; i++) {
		var t = messages[level][i];
		c.font = t.size+"px Abel";
		c.fillStyle = "#000000";
		c.fillText(t.message, t.x, t.y);
	}
	
	//If the bob's death timer is above zero, bob is dead and thus the player should not be able to control him.
	if (this.dTimer < 0) {
		bob.draw();
		bob.interact();
	}
	
	c.restore();
	
	//Display the text with the given size of text and transparency
	c.font = bob.coinTextSize+"px Abel";
	c.fillStyle = "rgba(0, 0, 0, "+bob.coinFade+")";
	c.fillText("Coins: "+bob.coins, 40, 50);
	
	//Displays the rectangle that cause the fade when entering a portal
	c.fillStyle = "rgba(255, 255, 255,"+this.t+")";
	c.fillRect(0, 0, 700, 500);
	
	//Constantly subtract from the transparency of the rectangle
	this.t-=0.08;
	
	//If the transparency of the rectangle becomes less than zero then set it to zero.
	if (this.t <= 0) {
		this.t = 0;
	}
	
	//Subtract from the death timer.
	this.dTimer-=1;
	
	//If the deathtimer is at zero, you have respawned.
	if (this.dTimer === 0) {
		//Play the portal sound.
		sounds.push(new buzz.sound("soundfx/Portal.wav").setVolume(40));
		
		//Add the fade effect by setting transparency to one.
		this.t = 1;
		//Reset variables.
		bob.x = spawn.x;
		bob.y = spawn.y;
		bob.velX = 0;
		bob.velY = 0;
		enemies[level] = [];
		bombs[level] = [];
		
		//Respawn blocks and enemies.
		for (var i = 0 ; i < blocks[level].length ; i++) {
			if (blocks[level][i].type === "breaker") {
				blocks[level].splice(i, 1);
				i--;
			}
		}
		for (var t = 0 ; t < levels[level].length ; t++) {
			for (var j = 0 ; j < levels[level][t].length ; j++) {
				switch(levels[level][t][j]) {
					case "S":
						enemies[level].push(new Walker(j*27, t*27, 23, 23));
						break;
					case "b":
						blocks[level].push(new Block(j*27, t*27, 28, 28, "breaker"));
						break;
					case "B":
						bombs[level].push(new Bomb(j*27, t*27, 0, 0, 23/2, 200));
						break;
					case "F":
						enemies[level].push(new Flyer(j*27, t*27, 23, 23));
				}
			}   
		}
		
	}
	
}

//Create a new game instance
var game = new Game();

//Initiallize the draw function
function init() {
	window.requestAnimationFrame(draw);
}

//Running the init code
init();

//Draw function
function draw() {
	//Draw all the squares in the background
	for (var i = 0 ; i < bSquares.length ; i++) {
		c.fillStyle = bSquares[i].c;
		c.fillRect(bSquares[i].x, bSquares[i].y, 30, 30);
	}
	//Run the code from the game instance
	switch(scene) {
		case "game":
			game.interact();
			break;
	}
	//Play sounds
	for (var i = 0 ; i < sounds.length ; i++) {
		sounds[i].play();
		sounds.splice(i, 1);
	}
	//Up the framecount every frame
	frameCount++;
	window.requestAnimationFrame(draw);
}

//Handle key events.
window.addEventListener("keydown", function(e) {
    keys[e.key] = true;
	e.preventDefault();
});

window.addEventListener("keyup", function(e) {
    keys[e.key] = false;
	e.preventDefault();
});
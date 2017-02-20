//Create a player class.
var Player = function() {
	//The x position and y position will be the spawnpoint
	this.x = spawn.x;
	this.y = spawn.y;
	//Set the dimensions of the player to 23x23
	this.width = 23;
	this.height = 23;
	
	//Variables which control the velocity of the player
	this.velX = 0;
	this.velY = 0;
	this.falling = true;
	
	//Variables that control wall jumping mechanics.
	this.clingWall = "none";
	this.wallJumped = false;
	
	//Variables which control coins.
	this.coins = 0;
	this.coinFade = 0;
	this.coinFadeTimer = 0;
	this.coinTextSize = 20;
	
}

//Draws the player, a red square, using variables.
Player.prototype.draw = function() {
	c.strokeStyle = "rgb(100, 0, 0)";
	c.lineWidth = 3;
	c.strokeRect(this.x, this.y, this.width, this.height);   
}

//Lets the player interact with bob.
Player.prototype.interact = function() {
    
	//If player is pressing left, go left, same with the player going right.
    if (keys["ArrowLeft"]) {
        this.velX-=0.5;
    }
                
    if (keys["ArrowRight"]) {
        this.velX+=0.5;
    }
    
	//If the player is on the ground and the up key is pressed...
    if (keys["ArrowUp"] && !this.falling) {
		//Jump
        this.velY-=8;
		//If player is on a wall...
		if (this.clingWall !== "none") {
			//Spawn particles and play the wall jump sound.
			for (var i = 0 ; i < 8 ; i++) {
				particles.push(new Particle(this.x+this.width/2, this.y+this.height/2, Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, 6, "rgb(200, 0, 0)"));
			}
			sounds.push(new buzz.sound("soundfx/Wall-Jump.wav").setVolume(20));
		} else {
			//Otherwise play the normal jump sound.
			sounds.push(new buzz.sound("soundfx/Jump.wav").setVolume(20));
		}
		//If player is clinging to a wall on his left, have him bounce to the right.
		if (this.clingWall === "left") {
			this.velX += 6;
		}
		//Vice versa.
		if (this.clingWall === "right") {
			this.velX -= 6;
		}
    }
	//Makes it so that unless it is changed later on, by default the player is falling and not clinging onto a wall.
    this.falling = true;
	this.clingWall = "none";
    
	//Constantly apply gravity to the player.
    this.velY+=0.3;
    
	//Apply the velocity of the player to the player and handle collisions.
    this.x+=this.velX;
    this.collide(this.velX, 0);
    this.y+=this.velY;
    this.collide(0, this.velY);
    
	//Constantly decelerate the player
	this.velX /= 1.1;
	
	//Spawns particles for when the player is moving.
	if (frameCount%3 === 0 && this.velX < -0.7) {
		particles.push(new Particle(this.x+this.width, this.y+this.height, Math.cos(random(0, Math.PI*2)), Math.sin(random(0, Math.PI*2)), 4, "rgb(100, 0, 0)"));
	}
	
	if (frameCount%3 === 0 && this.velX > 0.7) {
		particles.push(new Particle(this.x, this.y+this.height, Math.cos(random(0, Math.PI*2)), Math.sin(random(0, Math.PI*2)), 4, "rgb(100, 0, 0)"));
	}
	
	//Constantly subtract from the timer that deals with coins.
	this.coinFadeTimer--;
	
	//Handles the animation that occurs when you get a coin.
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

//Handles player collision.
Player.prototype.collide = function(velX, velY) {
	//Handles coin collision.
	for (var i = 0 ; i < coins[level].length ; i++) {
		//If the player and a coin collides...
		if (cornerCenter(this, coins[level][i])) {
			//Play a sound and trigger the coin animation and delete the coin
			sounds.push(new buzz.sound("soundfx/Coin.wav").setVolume(30));
			this.coinFadeTimer = 50;
			coins[level].splice(i, 1);
		}
	}
	//Handles collisions for electrical orbs
	for (var i = 0 ; i < orbs[level].length ; i++) {
		//If a player hits an electrical orb, he dies.
		if (cornerCenter(this, orbs[level][i])) {
			this.die();
		}
	}
	//Handles block collisions
	for (var i = 0 ; i < blocks[level].length ; i++) {
		//If a block is offscreen don't check for collisions.
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
		if (rectCollide(this, blocks[level][i]) && blocks[level][i].type === "breaker") {
			blocks[level][i].isRunning = true;
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
					sounds.push(new buzz.sound("soundfx/Big-Boing.wav").setVolume(100));
				} else {
					sounds.push(new buzz.sound("soundfx/Boing.wav").setVolume(100));
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
				break;
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
			sounds.push(new buzz.sound("soundfx/Portal.wav").setVolume(40));
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
	for (var i = 0 ; i < enemies[level].length ; i++) {
		if (rectCollide(this, enemies[level][i]) && enemies[level][i].type() === "Walker") {
			if (velY > 0) {
				this.velY=-5;
				enemies[level][i].die();
			} else {
				this.die();
			}
		} 
	}
	for (var i = 0 ; i < bombs[level].length ; i++) {
		if (bombs[level][i].exploding && dist(this.x, this.y, bombs[level][i].x, bombs[level][i].y) < 50) {
			this.die();
		}
	}
}

Player.prototype.die = function() {
	sounds.push(new buzz.sound("soundfx/Dead.wav").setVolume(60));
	for (var i = 0 ; i < 20 ; i++) {
		particles.push(new Particle(this.x+this.width/2, this.y+this.height/2, Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, 10, "rgb(200, 0, 0)"));
	}
	game.dTimer = 60;
	this.falling = false;
}
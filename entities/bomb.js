
var Bomb = function(x, y, velx, vely, size, timer) {
	this.x = x-size;
	this.y = y-size;
	this.velx = velx;
	this.vely = vely;
	this.size = size;
	this.width = size*2;
	this.height = size*2;
    
    this.timer = timer;
    this.btimer = 0;
    
    this.falling = true;
	this.exploding = false;
}

Bomb.prototype.draw = function() {
	if (Math.round(this.btimer)%(this.timer)/1000 === 0) {
		c.fillStyle = "rgb(200, 0, 0)";
		sounds.push(new buzz.sound("soundfx/Bip.wav").setVolume(100));
	} else {
		c.fillStyle = "#000000";
	}
	c.beginPath();
	c.arc(this.x+this.width/2, this.y+this.height/2, this.size, 0, 360, false);
	c.fill();
}

Bomb.prototype.update = function() {
	
    this.btimer++;
    
	if (this.falling) {
    	this.vely+=0.3;
	}
    
    this.x+=this.velx;
    this.collide(this.velx, 0);
    this.y+=this.vely;
    this.collide(0, this.vely);
    
    this.velx /= 1.05;
    
    this.timer--;
    
    if (this.timer < 10 && this.timer > 0) {
        this.explode();
    }
    
    if (this.timer === 10) {
        game.screenShake += 3;
    }
    
}

Bomb.prototype.collide = function(velx, vely) {
	for (var i = 0 ; i < blocks[level].length ; i++) {
        if (rectCollide(this, blocks[level][i]) && (blocks[level][i].type === "normal" || blocks[level][i].type === "electric")) {
            if (velx > 0) {
				this.velx = -2;
                this.x = blocks[level][i].x-this.width;
            }
            if (velx < 0) {
				this.velx = 2;
                this.x = blocks[level][i].x+blocks[level][i].width;
            }
            if (vely > 0) {
                this.vely = 0;
                this.y = blocks[level][i].y-this.height;
				this.falling = false;
            } 
            if (vely < 0) {
                this.vely = 0;
                this.y = blocks[level][i].y+blocks[level][i].height;
            	this.falling = true;
			}
			continue;
        }
    }
    for (var i = 0 ; i < bombs[level].length ; i++) {
        if (bombs[level][i].timer < 10 && dist(this.x, this.y, bombs[level][i].x, bombs[level][i].y) < 50) {
            if (this.timer > 15) {
                this.timer = 15;
            }
        }
    }
}

Bomb.prototype.explode = function() {
	sounds.push(new buzz.sound("soundfx/Explosion.wav").setVolume(50));
    for (var i = 0 ; i < 10 ; i++) {
        particles.push(new Particle2(this.x+random(-30, 30), this.y+random(-30, 30), 10, "rgb("+Math.round(random(200, 255))+","+Math.round(random(0, 200))+", 0)"));
    }
	for (var i = 0 ; i < 5 ; i++) {
		var x = Math.round(random(50, 100));
		particles.push(new Particle3(this.x+this.width/2, this.y+this.height/2, Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, 10, "rgb("+x+","+x+","+x+")"));
	}
	this.exploding = true;
}

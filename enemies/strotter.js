var Strotter = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.velX = 2;
	this.velY = 0;
	this.falling = true;
	this.dead = false;
}

Strotter.prototype.draw = function() {
	c.strokeStyle = "#14489b";
	c.lineWidth = 3;
	c.strokeRect(this.x, this.y, this.width, this.height);
}

Strotter.prototype.update = function () {
	
	this.x+=this.velX;	
	this.velY+=0.3;
                
    this.x+=this.velX;
    this.collide(this.velX, 0);
    this.y+=this.velY;
    this.collide(0, this.velY);
	
	if (frameCount%3 === 0 && this.velX < -0.7) {
		particles.push(new Particle(this.x+this.width, this.y+this.height, Math.cos(random(0, Math.PI*2)), Math.sin(random(0, Math.PI*2)), 4, "#14489b"));
	}
	
	if (frameCount%3 === 0 && this.velX > 0.7) {
		particles.push(new Particle(this.x, this.y+this.height, Math.cos(random(0, Math.PI*2)), Math.sin(random(0, Math.PI*2)), 4, "#14489b"));
	}	
	
}

Strotter.prototype.collide = function(velX, velY) {
	for (var i = 0 ; i < orbs[level].length ; i++) {
		if (cornerCenter(this, orbs[level][i])) {
			this.die();
		}
	}
	for (var i = 0 ; i < blocks[level].length ; i++) {
		if (rectCollide(this, blocks[level][i]) && (blocks[level][i].type === "normal" || blocks[level][i].type === "electric")) {
			if (velX > 0) {
				this.velX = -2;
                this.x = blocks[level][i].x-this.width;
            }
            if (velX < 0) {
				this.velX = 2;
                this.x = blocks[level][i].x+blocks[level][i].width;
            }
            if (velY > 0) {
                this.velY = 0;
                this.y = blocks[level][i].y-this.height;
				this.falling = false;
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
		if (rectCollide(this, blocks[level][i]) && (blocks[level][i].type === "bspike"|| blocks[level][i].type === "sspike")) {
            if (velX > 0) {
                this.velX = -2;
                this.x = blocks[level][i].x-this.width;
            }
            if (velX < 0) {
                this.velX = 2;
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
	}
}

Strotter.prototype.die = function() {
	for (var i = 0 ; i < 20 ; i++) {
		particles.push(new Particle(this.x+this.width/2, this.y+this.height/2, Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, 10, "#14489b"));
	}
	sounds.push(new buzz.sound("soundfx/Dead.wav").setVolume(60));
	this.dead = true;
}

Strotter.prototype.type = function() {
	return "strotter";
}

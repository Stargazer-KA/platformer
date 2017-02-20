
var Bomb = function(x, y, velx, vely, size, timer) {
	this.ox = x;
	this.oy = y;
	this.x = x-size;
	this.y = y-size;
	this.velx = velx;
	this.vely = vely;
	this.size = size;
	this.width = size/2;
	this.height = size/2;
    
    this.timer = timer;
    
    this.falling = true;
	this.exploding = false;
}

Bomb.prototype.draw = function() {
	if (frameCount%(this.timer)/1000 === 0) {
		c.fillStyle = "rgb(200, 0, 0)";
		sounds.push(new buzz.sound("soundfx/Bip.wav").setVolume(100));
	} else {
		c.fillStyle = "#000000";
	}
	c.beginPath();
	c.arc(this.ox, this.oy, this.size, 0, 360, false);
	c.fill();
}

Bomb.prototype.update = function() {
	
	if (this.falling) {
    	this.vely+=0.3;
	}
    
    this.ox+=this.velx;
    this.collide(this.velx, 0);
    this.oy+=this.vely;
    this.collide(0, this.vely);
	this.x = this.ox-this.size;
	this.y = this.oy-this.size;
    
    this.velx /= 1.1;
    
    this.timer--;
    
    if (this.timer < 10 && this.timer > 0) {
        this.explode();
    }
    
}

Bomb.prototype.collide = function(velx, vely) {
	for (var i = 0 ; i < blocks[level].length ; i++) {
        if (rectCollide(this, blocks[level][i]) && (blocks[level][i].type === "normal" || blocks[level][i].type === "electric")) {
            if (velx > 0) {
				this.velx = -2;
                this.ox = blocks[level][i].x-this.width;
            }
            if (velx < 0) {
				this.velx = 2;
                this.ox = blocks[level][i].x+blocks[level][i].width;
            }
            if (vely > 0) {
                this.vely = 0;
                this.oy = blocks[level][i].y-this.height;
				this.falling = false;
            }
            if (vely < 0) {
                this.vely = 0;
                this.oy = blocks[level][i].y+blocks[level][i].height;
            	this.falling = true;
			}
			continue;
        }
    }
}

Bomb.prototype.explode = function() {
	sounds.push(new buzz.sound("soundfx/Explosion.wav").setVolume(60));
    for (var i = 0 ; i < 5 ; i++) {
        particles.push(new Particle2(this.ox+random(-30, 30), this.oy+random(-30, 30), 10, "rgb("+Math.round(random(200, 255))+","+Math.round(random(0, 200))+", 0)"));
    }
	for (var i = 0 ; i < 5 ; i++) {
		var x = Math.round(random(50, 100));
		particles.push(new Particle3(this.x+this.width/2, this.y+this.height/2, Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, 10, "rgb("+x+","+x+","+x+")"));
	}
	this.exploding = true;
}


var Bomb = function(x, y, velx, vely, size, timer) {
	this.x = x;
	this.y = y;
	this.velx = velx;
	this.vely = vely;
	this.size = size;
    
    this.timer = timer;
    
    this.falling = true;
}

Bomb.prototype.draw = function() {
	c.fillStyle = "#000000";
	c.beginPath();
	c.arc(this.x, this.y, this.size, 0, 360, false);
	c.endPath();
}

Bomb.prototype.update = function() {
	
    this.vely+=0.3;
    
    this.x+=this.velx;
    this.collide(this.velx, 0);
    this.y+=this.vely;
    this.collide(0, this.vely);
    
    this.velx /= 1.1;
    
    this.timer--;
    
    if (this.timer === 0) {
        this.explode();
    }
    
}

Bomb.prototype.collide = function(velx, vely) {
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
    }
}

Bomb.prototype.explode = function() {
    for (var i = 0 ; i < 20 ; i++) {
        particles.push(new Particle2(this.x+this.width/2, this.y+this.height/2, Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, 10, "rgb("+random(70, 100)+","+random(70, 100)+","+random(70, 100)+");"));
    }
}

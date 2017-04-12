
var Bullet = function(x, y, velX, velY, size, color) {
	this.x = x-size;
	this.y = y-size;
	this.velX = velX;
	this.velY = velY;
	this.size = size;
    this.width = size*2;
    this.height = size*2;
    
	this.color = color;
    this.dead = false;
}

Bullet.prototype.draw = function() {
	c.fillStyle = this.color;
	c.beginPath();
	c.arc(this.x+this.width/2, this.y+this.height/2, this.size, 0, 360, false);
	c.fill();
}

Bullet.prototype.update = function() {
	
	this.x+=this.velX;
    this.collide(this.velX, 0);
	this.y+=this.velY;
    this.collide(0, this.velY);
    
}

Bullet.prototype.collide = function(velx, vely) {
    for (var i = 0 ; i < blocks[level].length ; i++) {
        if (rectCollide(this, blocks[level][i]) && (blocks[level][i].type === "normal" || blocks[level][i].type === "electric")) {
            if (velx > 0) {
                this.x = blocks[level][i].x-this.width;
            }
            if (velx < 0) {
                this.x = blocks[level][i].x+blocks[level][i].width;
            }
            if (vely > 0) {
                this.y = blocks[level][i].y-this.height;
            } 
            if (vely < 0) {
                this.y = blocks[level][i].y+blocks[level][i].height;
			}
            this.pop();
        }
    }
}

Bullet.prototype.pop = function() {
    
    for (var t = 0 ; t < 5 ; t++) {
		particles.push(new Particle(this.x, this.y, Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, this.width/1.3, this.color));
    }
    
    this.dead = true;
    
}


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
	this.y+=this.velY;
	
}

Bullet.prototype.collide = function(velx, vely) {
    for (var i = 0 ; i < blocks[level].legnth ; i++) {
        if (rectCollide(this, blocks[level][i])) {
            this.pop();
        }
    }
}

Bullet.prototype.pop = function() {
    
    for (var t = 0 ; t < 5 ; t++) {
		particles.push(new Particle(blocks[level][i].x+blocks[level][i].width/2, blocks[level][i].y+blocks[level][i].height/2, Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, 10, this.color));
    }
    
    this.dead = true;
    
}

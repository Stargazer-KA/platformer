var Bomber = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.velX = 0;
    this.velY = 0;
    this.falling = true;
    this.dead = false;
}

Bomber.prototype.draw = function() {
    c.strokeStyle = "#f44242";
	c.lineWidth = 3;
	c.strokeRect(this.x, this.y, this.width, this.height);
}

Bomber.prototype.update = function() {
    
    this.velY+=0.3;
    
    this.x+=this.velX;
    this.collide(this.velX, 0);
    this.y+=this.velY;
    this.collide(0, this.velY);
    
}

Bomber.prototype.collide = function(velX, velY) {
    
}

Bomber.prototype.die = function() {
    for (var i = 0 ; i < 20 ; i++) {
		particles.push(new Particle(this.x+this.width/2, this.y+this.height/2, Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, 10, "#f44242"));
	}
	sounds.push(new buzz.sound("soundfx/Dead.wav").setVolume(60));
	this.dead = true;
}

Bomber.prototype.type = function() {
    return "Bomber";
}

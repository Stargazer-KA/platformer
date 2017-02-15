var Particle = function(x, y, velx, vely, s, color) {
	this.x = x;
	this.y = y;
	this.velx = velx;
	this.vely = vely;
	this.s = s;
	this.color = color;
	this.r = Math.random()*Math.PI*2;
	this.rs = random(0, 0.4);	
}
			
Particle.prototype.draw = function() {
	c.save();
	c.translate(this.x, this.y);
	c.rotate(this.r);
	c.fillStyle = this.color;
	c.fillRect(-this.s/2, -this.s/2, this.s, this.s);
	c.restore();	
}
			
Particle.prototype.update = function() {
	this.x+=this.velx;
	this.y+=this.vely;
	this.s-=0.4;
	this.r+=this.rs;	
}

var Particle2 = function(x, y, s, color) {
	this.x = x;
	this.y = y;
	this.s = 1;
	this.ss = s;
	this.color = color;
	this.r = Math.random()*Math.PI*2;
	this.rs = random(0, 0.4);	
	this.stage = 1;
}

Particle2.prototype.draw = function() {
	c.save();
	c.translate(this.x, this.y);
	c.rotate(this.r);
	c.fillStyle = this.color;
	c.fillRect(-this.s/2, -this.s/2, this.s, this.s);
	c.restore();	
}

Particle2.prototype.update = function() {
	if (this.stage === 1) {
		this.s += (this.ss-this.s)/2;
		if (this.s > this.ss-0.1) {
			this.stage = 2;
		}
	} else if (this.stage === 2) {
		this.s += (0-this.s)/4;
	}
	this.r+=this.rs;
}

var Particle3 = function(x, y, velx, vely, s, color) {
	this.x = x;
	this.y = y;
	this.velx = velx;
	this.vely = vely;
	this.s = s;
	this.color = color;
	this.r = Math.random()*Math.PI*2;
	this.rs = random(0, 0.4);	
}
			
Particle3.prototype.draw = function() {
	c.save();
	c.translate(this.x, this.y);
	c.rotate(this.r);
	c.fillStyle = this.color;
	c.fillRect(-this.s/2, -this.s/2, this.s, this.s);
	c.restore();	
}
			
Particle3.prototype.update = function() {
	this.x+=this.velx;
	this.y+=this.vely;
	this.vely -= 0.2;
	this.s-=0.4;
	this.r+=this.rs;	
}

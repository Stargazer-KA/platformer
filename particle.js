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
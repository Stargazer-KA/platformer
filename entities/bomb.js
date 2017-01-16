
var Bomb = function(x, y, velx, vely, size) {
	this.x = x;
	this.y = y;
	this.velx = velx;
	this.vely = vely;
	this.size = size;
}

Bomb.prototype.draw = function() {
	c.fillStyle = "#000000";
	c.beginPath();
	c.arc(this.x, this.y, this.size, 0, 360, false);
	c.endPath();
}

Bomb.prototype.update = function() {
	
}

Bomb.prototype.collide = function(velx, vely) {
	
}

var Coin = function(x, y) {
	this.x = x;
	this.y = y;
	this.width = 30;
	this.height = 30;
};

Coin.prototype.draw = function() {
	c.save();
	c.translate(this.x, this.y);
	c.scale(Math.sin(frameCount/20), 1);
	
	c.fillStyle = "#CCE014";
	
	c.beginPath();
	c.arc(0, 0, this.width/2, 0, Math.PI*2, true);
	c.fill();
	
	c.fillStyle = "#E1F716";
	
	c.beginPath();
	c.arc(0, 0, this.width/2-4, 0, Math.PI*2, true);
	c.fill();
	
	c.restore();
};
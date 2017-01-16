var ElecOrb = function(x, y) {
	this.originX = x;
	this.originY = y;
	this.x = x+10;
	this.y = 0;
	this.width = 30;
	this.height = 30;
	
	this.r = random(0, Math.PI*2);
};

ElecOrb.prototype.draw = function() {
	c.strokeStyle = "#BDCF1B";
	c.lineWidth= 3;
	
	c.save();
	
	c.translate(this.x, this.y);
	c.rotate((frameCount+this.r)/30);
	c.scale(1, Math.sin((frameCount+this.r)/20));
	
	c.beginPath();
	c.arc(0, 0, this.width/2, 0, Math.PI*2, true);
	c.stroke();
	
	c.restore();
	
	c.save();
	
	c.translate(this.x, this.y);
	c.rotate((frameCount+this.r)/30);
	c.scale(Math.cos((frameCount+this.r)/20+Math.PI), 1);
	
	c.beginPath();
	c.arc(0, 0, this.width/2, 0, Math.PI*2, true);
	c.stroke();
	
	c.restore();
};

ElecOrb.prototype.update = function() {
	this.x = Math.cos(frameCount/20+this.r)*120+this.originX;
	this.y = Math.sin(frameCount/20+this.r)*120+this.originY;
};
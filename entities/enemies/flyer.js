
var Flyer = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.ox = x;
	this.oy = y;
	this.width = width;
	this.height = height;
	
	this.dead = false;
	this.r = random(0, Math.PI*2);
	this.r2 = random(0, Math.PI*2);
}

Flyer.prototype.draw = function() {
	c.strokeStyle = "#39e539";
	c.lineWidth = 3;
	c.strokeRect(this.x, this.y, this.width, this.height);
}

Flyer.prototype.update = function() {
	
	this.x = Math.sin(this.r+frameCount/10)*50+this.ox;
	this.y = Math.sin(this.r2+frameCount/15)*20+this.oy;
	
	particles.push(new Particle(random(this.x, this.x+this.width), random(this.y+this.height, this.y+this.height+10), 0, random(0, 5), random(0, 6), "#39e539"));
	
}

Flyer.prototype.die = function() {
	for (var i = 0 ; i < 20 ; i++) {
		particles.push(new Particle(this.x+this.width/2, this.y+this.height/2, Math.cos(random(0, Math.PI*2))*3, Math.sin(random(0, Math.PI*2))*3, 10, "#39e539"));
	}
	sounds.push(new buzz.sound("soundfx/Dead.wav").setVolume(60));
	this.dead = true;
}

Flyer.prototype.type = function() {
	return "Flyer";
}

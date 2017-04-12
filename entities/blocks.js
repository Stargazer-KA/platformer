var Block = function(x, y, width, height, type) {
	this.x = x;
	this.ox = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.type = type;    
	
	this.frame = 0;
	this.isRunning = false;
	this.destroyed = false;
    this.r = Math.round(random(150, 200));
};
                        
Block.prototype.draw = function() {
	switch(this.type) {
		case "normal":
			c.fillStyle = "rgb(10, 10, 10)";
			c.fillRect(this.x, this.y, this.width, this.height);
			break;	
		case "phantomblock":
			c.fillStyle = "rgb(10, 10, 10)";
			c.fillRect(this.x, this.y, this.width, this.height);
			break;
		case "portal":
			c.fillStyle = "rgb(100, 0, 255)";
			c.beginPath();
			c.arc(this.x+this.width/2, this.y+this.height/2, this.width+Math.sin(frameCount)/2-10, 0, Math.PI*2, true);
			c.fill();
			
			var px = random(this.x-20, this.x+this.width+20);
			var py = random(this.y-20, this.y+this.height+20);
			
			particles.push(new Particle(px, py, ((this.x+this.width/2)-px)/17, ((this.y+this.height/2)-py)/17, 5, "rgb(100, 0, 255)"));
			
			var px = random(this.x-20, this.x+this.width+20);
			var py = random(this.y-20, this.y+this.height+20);
			
			particles.push(new Particle(px, py, ((this.x+this.width/2)-px)/17, ((this.y+this.height/2)-py)/17, 5, "rgb(100, 0, 255)"));
			
			break;
		case "bspike":
			c.fillStyle = "rgb(200, 0, 0)";
			triangle(this.x+this.width/2, this.y, this.x+this.width, this.y+this.height, this.x, this.y+this.height);
			break;
		case "sspike":
			c.fillStyle = "rgb(200, 0, 0)";
			triangle(this.x+this.width/6, this.y, this.x+this.width/3, this.y+this.height, this.x, this.y+this.height);
			c.save();
			c.translate(this.width/3, 0);
			triangle(this.x+this.width/6, this.y, this.x+this.width/3, this.y+this.height, this.x, this.y+this.height);
			c.restore();
			
			c.save();
			c.translate(this.width/3*2, 0);
			triangle(this.x+this.width/6, this.y, this.x+this.width/3, this.y+this.height, this.x, this.y+this.height);
			c.restore();
			break;
		case "bounce":
			c.fillStyle = "rgb(0, 100, 255)";
			c.fillRect(this.x, this.y, this.width, this.height);
			
			particles.push(new Particle(random(this.x, this.x+this.width), this.y, 0, random(-5, 0), random(0, 6), "rgb(0, 100, 255)"));
			particles.push(new Particle(random(this.x, this.x+this.width), this.y, 0, random(-5, 0), random(0, 6), "rgb(0, 100, 255)"));
			break;
		case "lava":
			c.fillStyle = "rgb(200, 0, 0)";
			c.fillRect(this.x, this.y, this.width, this.height);
			
			particles.push(new Particle(random(this.x+5, this.x+this.width-5), random(this.y, this.y+this.height-5), 0, random(-2, 0), random(0, 6), "rgb(170, 0, 0)"));
			break;
		case "electric": 
			
			c.fillStyle = "rgb(10, 10, 10)";
			c.fillRect(this.x, this.y, this.width, this.height);
			
			c.fillStyle = "#E3ED24";
			c.beginPath();
			c.arc(this.x+this.width/2, this.y+this.height/2, this.width/3+random(-1, 1), 0, Math.PI*2, true);
			c.fill();
			break;
		case "breaker":
			c.fillStyle = "rgb(10, 10, 10)";
			c.fillRect(this.ox, this.y, this.width, this.height);
			
			if (this.frame > 0) {
				this.ox = this.x+random(-2, 2);
			}
			
			if (this.frame === 60) {
				this.destroyed = true;
			}
			
			if (this.isRunning) {
				this.frame++;
			}
            break;
        case "bomb spawner":
            c.fillStyle = "rgb(10, 10, 10)";
			c.fillRect(this.x, this.y, this.width, this.height);
			
			c.fillStyle = "#ea493a";
			c.beginPath();
			c.arc(this.x+this.width/2, this.y+this.height/2, this.width/3+random(-1, 1), 0, Math.PI*2, true);
			c.fill();
            
            if (frameCount%this.r === 0) {
                bombs[level].push(new Bomb(this.x+this.width/2, this.y+this.height/2, random(-10, 10), -5, 23/2, 200));
            }
            break;
            
	}            
}
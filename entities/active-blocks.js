var ActiveBlock = function(x, y, width, height, type) {
	this.x = x;
	this.ox = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.type = type;    
	
	this.frame = 0;
	this.destroyed = false;
    this.r = Math.round(random(150, 200));
};
                        
ActiveBlock.prototype.draw = function() {
	switch(this.type) {
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
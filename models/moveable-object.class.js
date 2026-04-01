class MoveableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    currentImage = 0;
    startTime = new Date().getTime();


    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25)
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) { 
            return true;
        } else {
            return this.y < 100;
        }
    }

    // character is colliding (chicken)
    isColliding(mo) {
        return this.x + this.width - 20 > mo.x &&
            this.y + this.height - 20 > mo.y &&
            this.x + 20 < mo.x + mo.width &&
            this.y + 20 < mo.y + mo.height;
    }

    // character is colliding (coins/bottles)
    isCollidingCollectable(item) {
        return this.x + this.width > item.x + 5 &&
            this.y + this.height > item.y + 5 &&
            this.x < item.x + item.width - 5 &&
            this.y < item.y + item.height - 5;
    }

      hit() {
        const now = new Date().getTime();
        
        if (now - this.startTime < 3000) {
            return; 
        }
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        }
        this.lastHit = now; 
    }


    isHurt() {
        let timepassed = (new Date().getTime() - this.lastHit) / 1000;
        return timepassed < 1; 
    }

    isDead() {
        return this.energy == 0;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length; 
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed
    }

    jump() {
        this.speedY = 30;
    }
}
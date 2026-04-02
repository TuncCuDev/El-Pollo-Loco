class MoveableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    currentImage = 0;
    groundY = 100;
    startTime = new Date().getTime();
    crySound = new Audio('sounds/lostinglife.mp3');
       

    /**
     * Throws and jumps are affected by this.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25)
    }

    /**
     * Checks if an object is above the ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) { 
            return true;
        } else {
            return this.y < this.groundY;
        }
    }

    /** 
     *  Checks if the character collides with a movable object.
     */ 
    isColliding(mo) {
        return this.x + this.width - 50 > mo.x &&
            this.y + this.height - 50 > mo.y &&
            this.x + 50 < mo.x + mo.width &&
            this.y + 50 < mo.y + mo.height;
    }

    /**
     * Checks if the character collides with coins or bottles.
     */
    isCollidingCollectable(item) {
        return this.x + this.width > item.x + 50&&
            this.y + this.height > item.y + 50 &&
            this.x < item.x + item.width - 50 &&
            this.y < item.y + item.height - 50 ;
    }

    /**
     * Reduces the energy when hit.
     */
    hit() {
        const now = new Date().getTime();
        
        if (now - this.startTime < 1000) {
            return; 
        }
        this.energy -= 5;
        this.playCrySound();
        this.lastHit = now;
        this.updateHitStatus(now);
    }

    /**
     * Playing cry sound for being hurt.
     */
    playCrySound() {
        if (!soundOn) return;
        const sound = this.crySound.cloneNode();
        sound.volume = 0.1;
        sound.play();
    }

    /**
     * Updates last hit timestamp.
     */
    updateHitStatus(timestamp) {
        if (this.energy < 0) {
            this.energy = 0;
        }
        this.lastHit = timestamp;
    }

    /**
     * For flashing effect or invincibility.
     */
    isHurt() {
        let timepassed = (new Date().getTime() - this.lastHit) / 1000;
        return timepassed < 1; 
    }

    /**
     * Returns true if the characte´s energy is 0.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Cycles through images for animations.
    */
    playAnimation(images) {
        let i = this.currentImage % images.length; 
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the chracter right by speed.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves left.
     */
    moveLeft() {
        this.x -= this.speed
    }

    /**
     * Sets vertical spped upward.
     */
    jump() {
        this.speedY = 30;
    }
}
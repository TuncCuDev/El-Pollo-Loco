class MoveableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 20;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    currentImage = 0;
    groundY = 100;
    startTime = new Date().getTime();
    crySound = new Audio('assets/sounds/lostinglife.mp3');
       

    /**
     * Throws are affected by this.
     */
    applyGravityThrow() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25)
    }

    /**
     * Jumps are affected by this.
     */
    applyGravityJump() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            }

            if (this.y >= 100) {
                this.y = 100;      
                this.speedY = 0;       
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
     *  @param {Object} mo - The movable object to check collision with.
     */ 
    isColliding(mo) {
        return this.x + this.width - 50 > mo.x &&
            this.y + this.height - 50 > mo.y &&
            this.x + 50 < mo.x + mo.width &&
            this.y + 50 < mo.y + mo.height;
    }

    /**
     * Checks if the character collides with coins or bottles.
     * @param {Object} item - The collectible item (coin, bottle, etc.) to check collision with.
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
        if (soundOn && this.world.gameIsRunning) this.playCrySound();
        this.lastHit = now;
        this.updateHitStatus(now);
    }

    /**
     * Playing cry sound for being hurt.
     */
    playCrySound() {
        this.crySound.volume = 0.5;
        this.crySound.currentTime = 0;
        this.crySound.play();
    }

    /**
     * Updates last hit timestamp.
     * @param {number} timestamp - The current time or frame when the character was hit.
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
     * @param {Array} images - An array of image paths used for the animation frames.
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
        if (this.isOnGround()) {
        this.speedY = -20;
        }
    }
}
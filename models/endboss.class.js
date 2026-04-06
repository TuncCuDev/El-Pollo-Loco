class Endboss extends MoveableObject {
    height = 350;
    width = 250;
    y = 100;
    hadFirstContact = false;
    hits = 0;
    energy = 100;
    isHurt = false;
    walkInterval;
    moveInterval;
    isJumping = false;   
    jumpSpeed = 20;     
    megaJumpSpeed = 25;
    gravity = 2;        
    groundY = this.y;   
    IMAGES_WALKING = [
        'assets/images/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    deadImages = [
        'assets/images/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/images/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/images/4_enemie_boss_chicken/5_dead/G26.png'
    ];
    
    IMAGES_HuRT = [
        'assets/images/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/images/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/images/4_enemie_boss_chicken/4_hurt/G23.png'
    ]
  
    
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HuRT);
        this.loadImages(this.deadImages);
        this.x = 2500;

        this.maxEnergy = 100;
        this.energy = this.maxEnergy;
        this.isDead = false;
        this.statusBar = new EndbossStatusBar(this)

        this.statusBar = new EndbossStatusBar();
        this.statusBar.setPercentage(this.energy); 

        this.endbossHit = new Audio('assets/sounds/endbossmatch.mp3');
        this.winSound = new Audio('assets/sounds/wingame.mp3');
        this.endbossDie = new Audio('assets/sounds/endbossdie.mp3');
        
        this.animate();
    }


    /**
     * The endboss jump normally or mega, direction determines left or right.
     * @param {boolean} isMega - If true, performs a higher and longer jump.
     * @param {number} direction - Direction of the jump: 1 for right, -1 for left.
     * @param {number} minX - Minimum x-coordinate limit for the jump.
     * @param {number} maxX - Maximum x-coordinate limit for the jump.
     */
    jump(isMega = false, direction = 1, minX = 1750, maxX = 2500) {
        if (this.isJumping || this.isDead) return;

        this.isJumping = true;

        let speedY = this.getJumpSpeed(isMega);
        let speedX = this.getJumpDistance(isMega, direction);

        this.startJumpInterval(speedY, speedX, minX, maxX);
    }

    /**
     * Returns the jump speed based on jump type.
     * @param {boolean} isMega - If true, returns the speed for a mega jump; otherwise returns normal jump speed.
     */
    getJumpSpeed(isMega) {
        return isMega ? this.megaJumpSpeed : this.jumpSpeed;
    }

    /**
     * Returns the horizontal distance for a jump.
     * @param {boolean} isMega - If true, the jump covers a longer distance; otherwise a normal distance.
     * @param {number} direction - Direction of the jump: 1 for right, -1 for left.
     */
    getJumpDistance(isMega, direction) {
        return direction * (isMega ? 15 : 7);
    }

    /**
     * Starts the interval to animate the jump.
     * @param {number} speedY - Initial vertical speed for the jump.
     * @param {number} speedX - Horizontal speed for the jump (direction included).
     * @param {number} minX - Minimum x-coordinate boundary during the jump.
     * @param {number} maxX - Maximum x-coordinate boundary during the jump.
     */
    startJumpInterval(speedY, speedX, minX, maxX) {
        let currentSpeedY = speedY;

        const jumpInterval = setInterval(() => {
            this.updateJumpPosition(currentSpeedY, speedX, minX, maxX);
            currentSpeedY -= this.gravity;

            if (this.y >= this.groundY) {
                this.landOnGround(jumpInterval);
            }
        }, 30);
    }

    /**
     * Updates the position of the character during a jump.
     * @param {number} speedY - Vertical speed for the jump (positive values move up).  
     * @param {number} speedX - Horizontal speed for the jump (direction included).  
     * @param {number} minX - Minimum x-coordinate allowed during the jump.  
     * @param {number} maxX - Maximum x-coordinate allowed during the jump. 
     */
    updateJumpPosition(speedY, speedX, minX, maxX) {
        this.y -= speedY;
        this.x += speedX;

        if (this.x > maxX) this.x = maxX;
        if (this.x < minX) this.x = minX;
    }

    /**
     * Stops the jump and resets the character on the ground.
     * @param {Interval} jumpInterval - The interval controlling the jump animation, which will be cleared when landing.
     */
    landOnGround(jumpInterval) {
        this.y = this.groundY;
        this.isJumping = false;
        clearInterval(jumpInterval);
    }

    /**
     * Hanldes continuous walking animation and patrol movement.
     */
    animate() {
        this.startWalkingAnimation();
        this.startPatrolMovement(1500, 2500);
    }

    /**
     * Walking animation.
     */
    startWalkingAnimation() {
        this.walkInterval = setInterval(() => {
            if (!this.isHurt && !this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
    }

    /**
     * Starts patrol movement for the endboss. 
     * @param {number} minX - Minimum x-coordinate limit for patrol movement.  
     * @param {number} maxX - Maximum x-coordinate limit for patrol movement.     
     */
   startPatrolMovement(minX = 1500, maxX = 2500) {
        let direction = 1;

        this.moveInterval = setInterval(() => {
            
            direction = this.patrolStep(direction, minX, maxX);

            this.tryRandomJump(direction, minX, maxX);
        }, 100);
    }

    /**
     * Updates patrol movement.
     * @param {number} direction - Current horizontal direction: 1 for right, -1 for left.
     * @param {number} minX - Minimum x-coordinate boundary for patrol.  
     * @param {number} maxX - Maximum x-coordinate boundary for patrol.
     */
    patrolStep(direction, minX, maxX) {
        this.updatePosition(direction, minX, maxX);
        return this.updateDirection(this.x, direction, minX, maxX);
    }

    /**
     * Triggers random jumps during patrol. 
     * @param {number} direction - Current horizontal direction: 1 for right, -1 for left.  
     * @param {number} minX - Minimum x-coordinate boundary for jump.  
     * @param {number} maxX - Maximum x-coordinate boundary for jump.
     */
    tryRandomJump(direction, minX, maxX) {
        if (this.isJumping || this.isDead) return;

        const rand = Math.random();

        if (rand < 0.4) {
            this.jump(false, direction, minX, maxX); 
        } else if (rand < 0.4) { 
            this.jump(true, direction, minX, maxX);  
        }
    }

    /**
     * Updates horizontal position of the endboss.
     *  @param {number} direction - Horizontal direction: 1 for right, -1 for left.  
     */
    updatePosition(direction) {
        this.x += direction * this.speed * 30;
    }

    /**
     * Updates the horizontal direction based on boundaries.
     * @param {number} currentX - Current x-coordinate of the endboss.  
     * @param {number} direction - Current horizontal direction: 1 for right, -1 for left.  
     * @param {number} minX - Minimum x-coordinate boundary.  
     * @param {number} maxX - Maximum x-coordinate boundary.  
     */
    updateDirection(currentX, direction, minX, maxX) {
        if (currentX >= maxX) return -1;
        if (currentX <= minX) return 1;
        return direction;
    }

    /**
     * Taking damage, update health bar and play hurt animation, dies if energy 0.
    */
    hitByBottle() {
        if (this.isDead) return;

        this.energy -= 25;
        if (this.energy < 0) this.energy = 0;
        this.statusBar.setPercentage(this.energy);

        if (this.energy > 0) {
            this.playHurtAnimation();
        } else if (!this.isDead) {
            this.die();
        }
    }

    /**
     * Playing hurt animation.
     */
    playHurtAnimation() {
        if (!this.isHurt) {
            this.startHurtAnimation();
        }
    }

    /** 
     * Starting hurt animation every 500ms.
     */
    startHurtAnimation() {
        if (this.hurtInterval) clearInterval(this.hurtInterval); 
        this.isHurt = true;
        let i = 0;

        this.hurtInterval = setInterval(() => {
            if (i < this.IMAGES_HuRT.length) {
                this.showHurtFrame(i);
                i++;
            } else {
                this.finishHurtAnimation(this.hurtInterval);
                this.hurtInterval = null;
            }
        }, 500);
    }

    /**
     * Displays the hurt animation frame for the character.
     * @param {number} index - Index of the hurt image to display from the IMAGES_HuRT array.
     */
    showHurtFrame(index) {
        this.loadImage(this.IMAGES_HuRT[index]);
        if (soundOn && this.world.gameIsRunning) {
            this.playHurtSound();
        }
    }

    /**
     * Plays hurt sound.
     */
    playHurtSound() {
        this.endbossHit.currentTime = 0;
        this.endbossHit.volume = 0.4;
        this.endbossHit.play();
    }

    /**
     * Ends the hurt animation for the character.
     * @param {Interval} interval - The interval controlling the hurt animation, which will be cleared.
     */
    finishHurtAnimation(interval) {
        clearInterval(interval);
        this.isHurt = false;
    }

    /**
     * Plays deat sound and animation, stops walking/patrol intervals.
     */
    die() {
        if (this.isDead) return;
        this.isDead = true;

        this.playDeathSound();
        this.stopIntervals();
        this.playDeathAnimation();
    }

    /**
     * Plays death sound.
     */
    playDeathSound() {
        if (!soundOn) return;
        this.endbossDie.volume = 0.5;
        this.endbossDie.play();
    }

    /**
     * Stops walking and move intervals.
     */
    stopIntervals() {
        clearInterval(this.walkInterval);
        clearInterval(this.moveInterval);
    }

    /**
     * Plays death animation every 300ms.
     */
    playDeathAnimation() {
        let i = 0;
        const deathInterval = setInterval(() => {
            if (i < this.deadImages.length) {
                this.loadImage(this.deadImages[i]);
                i++;
            } else {
                clearInterval(deathInterval);
                this.finishDeath();
            }
        }, 300);
    }

    /**
     * Plays win sound and the win condition.
     */
    finishDeath() {
        if (!this.world) return;

        if (soundOn) {
            this.winSound.currentTime = 0;
            this.winSound.volume = 0.1;
            this.winSound.play();
        }

        this.world.youWin();
    }
}


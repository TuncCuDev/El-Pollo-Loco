class Character extends MoveableObject {
    height = 330;
    width = 130;
    y = 90;
    speed = 10;
    world;
    bottles = 0;
    isSnoring = false;
    IMAGES_WALKING = [
        'assets/images/2_character_pepe/2_walk/W-21.png',
        'assets/images/2_character_pepe/2_walk/W-22.png',
        'assets/images/2_character_pepe/2_walk/W-23.png',
        'assets/images/2_character_pepe/2_walk/W-24.png',
        'assets/images/2_character_pepe/2_walk/W-25.png',
        'assets/images/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'assets/images/2_character_pepe/3_jump/J-31.png',
        'assets/images/2_character_pepe/3_jump/J-32.png',
        'assets/images/2_character_pepe/3_jump/J-33.png',
        'assets/images/2_character_pepe/3_jump/J-34.png',
        'assets/images/2_character_pepe/3_jump/J-35.png',
        'assets/images/2_character_pepe/3_jump/J-36.png',
        'assets/images/2_character_pepe/3_jump/J-37.png',
        'assets/images/2_character_pepe/3_jump/J-38.png',
        'assets/images/2_character_pepe/3_jump/J-39.png',
    ];

    IMAGES_DEAD = [
        'assets/images/2_character_pepe/5_dead/D-51.png',
        'assets/images/2_character_pepe/5_dead/D-52.png',
        'assets/images/2_character_pepe/5_dead/D-53.png',
        'assets/images/2_character_pepe/5_dead/D-54.png',
        'assets/images/2_character_pepe/5_dead/D-55.png',
        'assets/images/2_character_pepe/5_dead/D-56.png',
        'assets/images/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'assets/images/2_character_pepe/4_hurt/H-41.png',
        'assets/images/2_character_pepe/4_hurt/H-42.png',
        'assets/images/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_IDLE = [
        'assets/images/2_character_pepe/1_idle/idle/I-1.png',
        'assets/images/2_character_pepe/1_idle/idle/I-2.png',
        'assets/images/2_character_pepe/1_idle/idle/I-3.png',
        'assets/images/2_character_pepe/1_idle/idle/I-4.png',
        'assets/images/2_character_pepe/1_idle/idle/I-5.png',
        'assets/images/2_character_pepe/1_idle/idle/I-6.png',
        'assets/images/2_character_pepe/1_idle/idle/I-7.png',
        'assets/images/2_character_pepe/1_idle/idle/I-8.png',
        'assets/images/2_character_pepe/1_idle/idle/I-9.png',
        'assets/images/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'assets/images/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-20.png'
    ];
    
    
    constructor() {
        super().loadImage('assets/images/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);

        this.jumpSound = new Audio('assets/sounds/jump.mp3');
        this.snoringSound = new Audio('assets/sounds/snore.mp3');
        this.snoringSound.loop = true;     
        this.snoringSound.volume = 0.3;
        this.isLongIdle = false; 
        this.longIdleTimer = null;

        this.applyGravityJump();
        this.animate();
    }


    /**
     * Updates chaaracter position and characters sprite for smooth animation.
     */
    animate() {
        setInterval(() => this.handleMovement(), 1000 / 60);
        setInterval(() => this.handleAnimations(), 50);
    }

    /**
     * Checks if the world exists and the keyboard is available.
     */
    handleMovement() {
        if (!this.world || !this.world.keyboard) return;

        this.moveCharacter();
        this.updateCamera();
        this.world.checkMusicSwitch();
    }

    /**
     * Checks the player’s state and plays the correct animation.
     */
    handleAnimations() {
        if (this.isDead()) {
            this.playDeadAnimation();
        } else if (this.isHurt()) {
            this.playHurtAnimation();
        } else if (this.isAboveGround()) {
            this.resetLongIdle();
            this.playJumpingAnimation();
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.resetAndWalking();
        } else {
            this.resetAndIdleAnimation();
        }
    }

    /**
     * Reset animations when switching between states to avoid overlapping frames.
     */
    resetAndWalking() {
        this.resetJumpAnimation();
        this.resetLongIdle();
        this.playWalkingAnimation();
    }

    /**
     * Reset animations when switching between states to avoid overlapping frames.
     */
    resetAndIdleAnimation() {
        this.resetJumpAnimation();
        this.playIdleAnimation();
        this.startLongIdleTimer();
    }

    /**
     * Plays dead animation.
     */
    playDeadAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
        if (this.world) this.world.gameOver();
    }

    /**
     * Plays hurt animation.
     */
    playHurtAnimation() {
        this.playAnimation(this.IMAGES_HURT);
    }

    /**
     * Plays jump animation.
     */
    playJumpingAnimation() {
        if (!this.jumpIndex) this.jumpIndex = 0;

        const speed = 0.5; 
        this.jumpIndex += speed; 

        if (this.jumpIndex >= this.IMAGES_JUMPING.length) {
            this.jumpIndex = this.IMAGES_JUMPING.length - 1;
        }

        this.loadImage(this.IMAGES_JUMPING[Math.floor(this.jumpIndex)]);
    }

    /**
     * Reset jump animation.
     */
    resetJumpAnimation() {
        this.jumpIndex = 0;
    }

    /**
     * Plays walking animation.
     */
    playWalkingAnimation() {
        this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * Plays idle animation.
     */
    playIdleAnimation() {
        if (this.isLongIdle) {
            if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.isAboveGround()) {
                this.playAnimation(this.IMAGES_LONG_IDLE, 'longIdleIndex');
                if (soundOn && this.world.gameIsRunning && !this.isSnoring) this.playSnoring();
            } else {
                this.resetLongIdle();
                this.playAnimation(this.IMAGES_IDLE, 'idleIndex');
            }
        } else {
            this.playAnimation(this.IMAGES_IDLE, 'idleIndex');
        }
    }

    /**
     *  Plays snoring sound.
     */
    playSnoring() {
        this.snoringSound.volume = 0.3;
        this.snoringSound.play();
        this.isSnoring = true;
    }

    /**
     * Stops snoring sound.
     */
    stopSnoring() {
        if (this.isSnoring && this.snoringSound) {
            this.snoringSound.pause();
            this.snoringSound.currentTime = 0;
            this.isSnoring = false;
        }
    }

    /**
     * Starts timer for long idle.
     */
    startLongIdleTimer() {
        if (this.longIdleTimer || this.isLongIdle) return;

        this.longIdleTimer = setTimeout(() => {
            if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
                this.isLongIdle = true;  
            }
            this.longIdleTimer = null;
        }, 3000);
    }

    /**
     * Reset long idle.
     */
    resetLongIdle() {
        clearTimeout(this.longIdleTimer);
        this.longIdleTimer = null;
        this.isLongIdle = false;
        this.longIdleIndex = 0; 
        this.isSnoring = false;         
        this.snoringSound.pause();       
        this.snoringSound.currentTime = 0;
    }

    /**
     * Function for right, left movement and jump.
     */
    moveCharacter() {
        this.handleRightMovement();
        this.handleLeftMovement();
        this.handleJump();
    }

    /**
     * Moves right.
     */
    handleRightMovement() {
        const keyboard = this.world.keyboard;

        if (keyboard.RIGHT && this.canMoveRight()) {
            this.moveRight();
            this.faceRight();
        }
    }

    /**
     * Moves left.
     */
    handleLeftMovement() {
        const keyboard = this.world.keyboard;

        if (keyboard.LEFT && this.canMoveLeft()) {
            this.moveLeft();
            this.faceLeft();
        }
    }

    /**
     * Jumping.
     */
    handleJump() {
        const keyboard = this.world.keyboard;

        if (keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
        }
    }

    /**
     * Moves to right.
     */
    canMoveRight() {
        return this.x < this.world.level.level_end_x;
    }

    /**
     * Moves to left.
     */
    canMoveLeft() {
        return this.x > 0;
    }

    /**
     * Turns face to right.
     */
    faceRight() {
        this.otherDirection = false;
    }

    /**
     * Turns face to left.
     */
    faceLeft() {
        this.otherDirection = true;
    }

    /**
     * Moves the camera to follow the player.
     */
    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Plays jump sound.
     */
    jump() {
        this.speedY = 30;
        if (soundOn && this.world.gameIsRunning) {
            this.jumpSound.currentTime = 0;
            this.jumpSound.volume = 0.1;
            this.jumpSound.play();
        }
    }

    /**
     * Creates a ThrowableObject in the correct direction.
     */
    throwBottle() {
        if (this.world.bottleBar.useBottle()) {
            let direction = this.otherDirection ? -1 : 1;
            let startX = this.x + 50 * direction;
            let startY = this.y + 50;
            let bottle = new ThrowableObject(startX, startY);

            bottle.speedX = 5 * direction;  
            bottle.otherDirection = this.otherDirection; 

            this.world.addThrowable(bottle); 
        }
    }

    /**
     *  Checks if the player is jumping on top of an enemy.
     *  @param {Object} enemy - The enemy object to check collision against. 
     */
    isJumpingOn(enemy) {
        let playerBottom = this.y + this.height;
        let playerCenterX = this.x + this.width ;

        let horizontal = playerCenterX > enemy.x + 50 && playerCenterX < enemy.x + enemy.width + 110;
        let vertical = playerBottom >= enemy.y - 15 && playerBottom <= enemy.y + enemy.height - 5;
        let falling = this.speedY < 0;

        return horizontal && vertical && falling
    }
}
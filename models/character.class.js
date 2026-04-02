class Character extends MoveableObject {
    height = 330;
    width = 130;
    y = 100;
    speed = 10;
    world;
    bottles = 0;
    IMAGES_WALKING = [
        '2_character_pepe/2_walk/W-21.png',
        '2_character_pepe/2_walk/W-22.png',
        '2_character_pepe/2_walk/W-23.png',
        '2_character_pepe/2_walk/W-24.png',
        '2_character_pepe/2_walk/W-25.png',
        '2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        '2_character_pepe/3_jump/J-31.png',
        '2_character_pepe/3_jump/J-32.png',
        '2_character_pepe/3_jump/J-33.png',
        '2_character_pepe/3_jump/J-34.png',
        '2_character_pepe/3_jump/J-35.png',
        '2_character_pepe/3_jump/J-36.png',
        '2_character_pepe/3_jump/J-37.png',
        '2_character_pepe/3_jump/J-38.png',
        '2_character_pepe/3_jump/J-39.png',
    ];

    IMAGES_DEAD = [
        '2_character_pepe/5_dead/D-51.png',
        '2_character_pepe/5_dead/D-52.png',
        '2_character_pepe/5_dead/D-53.png',
        '2_character_pepe/5_dead/D-54.png',
        '2_character_pepe/5_dead/D-55.png',
        '2_character_pepe/5_dead/D-56.png',
        '2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        '2_character_pepe/4_hurt/H-41.png',
        '2_character_pepe/4_hurt/H-42.png',
        '2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_IDLE = [
        '2_character_pepe/1_idle/idle/I-1.png',
        '2_character_pepe/1_idle/idle/I-2.png',
        '2_character_pepe/1_idle/idle/I-3.png',
        '2_character_pepe/1_idle/idle/I-4.png',
        '2_character_pepe/1_idle/idle/I-5.png',
        '2_character_pepe/1_idle/idle/I-6.png',
        '2_character_pepe/1_idle/idle/I-7.png',
        '2_character_pepe/1_idle/idle/I-8.png',
        '2_character_pepe/1_idle/idle/I-9.png',
        '2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        '2_character_pepe/1_idle/long_idle/I-11.png',
        '2_character_pepe/1_idle/long_idle/I-12.png',
        '2_character_pepe/1_idle/long_idle/I-13.png',
        '2_character_pepe/1_idle/long_idle/I-14.png',
        '2_character_pepe/1_idle/long_idle/I-15.png',
        '2_character_pepe/1_idle/long_idle/I-16.png',
        '2_character_pepe/1_idle/long_idle/I-17.png',
        '2_character_pepe/1_idle/long_idle/I-18.png',
        '2_character_pepe/1_idle/long_idle/I-19.png',
        '2_character_pepe/1_idle/long_idle/I-20.png'
    ];
    
    constructor() {
        super().loadImage('2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);

        this.jumpSound = new Audio('sounds/jump.mp3');
        this.isLongIdle = false; 
        this.longIdleTimer = null;

        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => this.handleMovement(), 1000 / 60);
        setInterval(() => this.handleAnimations(), 50);
    }

    handleMovement() {
        if (!this.world || !this.world.keyboard) return;

        this.moveCharacter();
        this.updateCamera();
        this.world.checkMusicSwitch();
    }

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

    resetAndWalking() {
        this.resetJumpAnimation();
        this.resetLongIdle();
        this.playWalkingAnimation();
    }

    resetAndIdleAnimation() {
        this.resetJumpAnimation();
        this.playIdleAnimation();
        this.startLongIdleTimer();
    }

    playDeadAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
        if (this.world) this.world.gameOver();
    }

    playHurtAnimation() {
        this.playAnimation(this.IMAGES_HURT);
    }

    playJumpingAnimation() {
        if (!this.jumpIndex) this.jumpIndex = 0;

        if (this.jumpIndex < this.IMAGES_JUMPING.length) {
            this.loadImage(this.IMAGES_JUMPING[this.jumpIndex]);
            this.jumpIndex++;
        } else {
            this.loadImage(this.IMAGES_JUMPING[this.IMAGES_JUMPING.length - 1]);
        }
    }

    resetJumpAnimation() {
        this.jumpIndex = 0;
    }

    playWalkingAnimation() {
        this.playAnimation(this.IMAGES_WALKING);
    }

    playIdleAnimation() {
        if (this.isLongIdle) {
            if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.isAboveGround()) {
                this.playAnimation(this.IMAGES_LONG_IDLE, 'longIdleIndex');
            } else {
                this.resetLongIdle();
                this.playAnimation(this.IMAGES_IDLE, 'idleIndex');
            }
        } else {
            this.playAnimation(this.IMAGES_IDLE, 'idleIndex');
        }
    }

    startLongIdleTimer() {
        if (this.longIdleTimer || this.isLongIdle) return;

        this.longIdleTimer = setTimeout(() => {
            if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
                this.isLongIdle = true;  
            }
            this.longIdleTimer = null;
        }, 3000);
    }

    resetLongIdle() {
        clearTimeout(this.longIdleTimer);
        this.longIdleTimer = null;
        this.isLongIdle = false;
        this.longIdleIndex = 0; 
    }

    moveCharacter() {
        this.handleRightMovement();
        this.handleLeftMovement();
        this.handleJump();
    }

    handleRightMovement() {
        const keyboard = this.world.keyboard;

        if (keyboard.RIGHT && this.canMoveRight()) {
            this.moveRight();
            this.faceRight();
        }
    }

    handleLeftMovement() {
        const keyboard = this.world.keyboard;

        if (keyboard.LEFT && this.canMoveLeft()) {
            this.moveLeft();
            this.faceLeft();
        }
    }

    handleJump() {
        const keyboard = this.world.keyboard;

        if (keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
        }
    }

    canMoveRight() {
        return this.x < this.world.level.level_end_x;
    }

    canMoveLeft() {
        return this.x > 0;
    }

    faceRight() {
        this.otherDirection = false;
    }

    faceLeft() {
        this.otherDirection = true;
    }

    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    jump() {
        this.speedY = 30;
        if (soundOn) {
            this.jumpSound.currentTime = 0;
            this.jumpSound.volume = 0.1;
            this.jumpSound.play();
        }
    }

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

    isJumpingOn(enemy) {
        let playerBottom = this.y + this.height;
        let playerCenterX = this.x + this.width / 2;

        let horizontal = playerCenterX > enemy.x && playerCenterX < enemy.x + enemy.width;
        let vertical = playerBottom >= enemy.y - 25 && playerBottom <= enemy.y + enemy.height + 25 ;
        let falling = this.speedY < 10;

        return horizontal && vertical && falling;
    }
}

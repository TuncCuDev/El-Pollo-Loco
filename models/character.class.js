class Character extends MoveableObject {
    height = 330;
    width = 130;
    y = 110;
    speed = 10;
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
    world;

    constructor() {
        super().loadImage('2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);

        this.jumpSound = new Audio('sounds/jump.mp3');

        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);

                if (this.world) {
                    this.world.gameOver();
                }
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 50);
    }

    jump() {
        this.speedY = 28;
        if (soundOn) {
            this.jumpSound.currentTime = 0;
            this.jumpSound.volume = 0.1;
            this.jumpSound.play();
        }
    }

    throwBottle() {
        if (this.world.bottleBar.useBottle()) {
            let direction = this.otherDirection ? -1 : 1;
            new ThrowableObject(
                this.x + 50 * direction,
                this.y + 50,
            );}
        }

    isJumpingOn(enemy) {
        let horizontal = this.x + this.width > enemy.x && this.x < enemy.x + enemy.width;
        let vertical;
        
        if (enemy.height <= 60) {
            vertical = this.y + this.height >= enemy.y &&
                    this.y + this.height <= enemy.y + enemy.height * 0.7;
        } else {
            vertical = this.y + this.height >= enemy.y &&
                    this.y + this.height <= enemy.y + enemy.height * 0.5;
        }

        return horizontal && vertical;
        }
}
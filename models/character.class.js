class Character extends MovableObject {
    height = 330;
    width = 130;
    y = 18;
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
    world;

    
    constructor(){
        super().loadImage('2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
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

            this.world.camera_x = -this.x +100;
        }, 1000 / 60);


        setInterval(() => {

            if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {

                if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 100 )
    }

    jump() {
        this.speedY = 30;
    }
}
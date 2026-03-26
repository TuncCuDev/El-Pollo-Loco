class Chicken extends MoveableObject {
    y = 355;
    height = 70;
    width = 90;
    IMAGES_WALKING = [
        '3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        '3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        '3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGE_DEAD = '3_enemies_chicken/chicken_normal/2_dead/dead.png';
    isDead = false;

    constructor() {
        super().loadImage('3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 250 + Math.random() * (2000 - 200);
        this.speed = 0.15 + Math.random() * 0.25;

        this.chickenSound = new Audio('sounds/chicken1.mp3');
        this.chickenSound.volume = 0.05;
        this.chickenDie = new Audio('sounds/chickendie.mp3');
        this.chickenDie.volume = 0.1;


        this.animate();
        this.playAudio();
    }
    playAudio() {
        setInterval(() => {
        if (!this.isDead && soundOn) {
            this.chickenSound.currentTime = 0;
            this.chickenSound.play();
            }
        }, 7000);
    }

    animate() {
        setInterval(() => {
            if (!this.isDead) this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (!this.isDead) this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    die() {
        if (this.isDead) return; 
        this.isDead = true;
        this.loadImage(this.IMAGE_DEAD);
        if (soundOn) {
        this.chickenDie.currentTime = 0;
        this.chickenDie.play();
        }
        setTimeout(() => {
            if (this.world) {
                let index = this.world.level.enemies.indexOf(this);
                if (index > -1) this.world.level.enemies.splice(index, 1);
                }
        }, 500);
    }
}

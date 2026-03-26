class SmallChicken extends MoveableObject {
    y = 360; 
    height = 50; 
    width = 60;

    IMAGES_WALKING = [
        '3_enemies_chicken/chicken_small/1_walk/1_w.png',
        '3_enemies_chicken/chicken_small/1_walk/2_w.png',
        '3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGE_DEAD = '3_enemies_chicken/chicken_small/2_dead/dead.png';
    isDead = false;

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]); 
        this.loadImages(this.IMAGES_WALKING);

      
        this.x = 200 + Math.random() * 500;
        this.speed = 0.2 + Math.random() * 0.3; 

        this.animate();
    }

    animate() {

        let walkInterval = setInterval(() => {
            if (!this.isDead) this.moveLeft();
        }, 1000 / 60);

     
        let animInterval = setInterval(() => {
            if (!this.isDead) this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    die() {
        if (this.isDead) return; 
        this.isDead = true;
        this.loadImage(this.IMAGE_DEAD);

        setTimeout(() => {
            if (this.world) {
                let index = this.world.level.enemies.indexOf(this);
                if (index > -1) this.world.level.enemies.splice(index, 1);
            }
        }, 500);
    }
}
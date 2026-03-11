class Chicken extends MovableObject {
    y = 300;
    height = 70;
    width = 90;
    IMAGES_WALKING = [
        '3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        '3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        '3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    constructor() {
        super().loadImage('3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
       
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200 )
    }
}

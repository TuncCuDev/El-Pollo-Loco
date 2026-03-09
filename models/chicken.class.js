class Chicken extends MovableObject {
    y = 300;
    height = 70;
    width = 90;

    constructor() {
        super().loadImage('3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    
        this.x = 200 + Math.random() * 500;
    }
}
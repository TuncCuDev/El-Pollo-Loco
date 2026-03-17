class ThrowableObject extends MoveableObject {


    constructor(x, y) {
        super().loadImage('6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.x = y;
        this.y = x;
        this.height = 60;
        this.width = 50;
        this.trow(100, 150);
    }

    trow() {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25);
    }
}
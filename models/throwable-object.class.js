class ThrowableObject extends MoveableObject {


    constructor(x, y) {
        super().loadImage('6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw();
    }

    throw() {
        this.speedY = 20;
        this.applyGravity();
        setInterval(() => {
            this.x += 15;
        }, 40);
    }
}


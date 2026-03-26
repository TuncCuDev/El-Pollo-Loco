class ThrowableObject extends MoveableObject {

    constructor(x, y) {
        super();
        this.loadImage('6_salsa_bottle/salsa_bottle.png'); // dein Flaschenbild

        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;

        this.speedX = 10;
        this.speedY = 20;

        this.throwSound = new Audio('sounds/bottlesounds.mp3');
        this.throwSound.volume = 0.1;

        this.throw();
    }

    throw() {
        this.applyGravity();

        if (soundOn) {
                this.throwSound.currentTime = 0;
                this.throwSound.play();
        setInterval(() => {
            this.x += this.speedX;
        }, 25);
        
    }
}
}
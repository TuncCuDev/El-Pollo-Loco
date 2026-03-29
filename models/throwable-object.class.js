class ThrowableObject extends MoveableObject {
    IMAGES_SPLASH = [
        '6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        '6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        '6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png'
    ];

    constructor(x, y) {
        super();
        this.loadImage('6_salsa_bottle/salsa_bottle.png'); 
        this.loadImages(this.IMAGES_SPLASH);

        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;
        this.speedX = 10;
        this.speedY = 20;

        this.throwSound = new Audio('sounds/bottlesounds.mp3');
        this.throwSound.volume = 0.1;
        this.splashSound = new Audio('sounds/splash.mp3');
        this.splashSound.volume = 0.1;

        this.throw();
    }

    playSplashAnimation() {
        this.hasSplashed = true;
        this.speed = 0;
        this.speedY = 0;
        let i = 0;
        if (soundOn) {
            this.splashSound.currentTime = 0;
            this.splashSound.play();
        }

        const interval = setInterval(() => {
            if (i < this.IMAGES_SPLASH.length) {
                this.loadImage(this.IMAGES_SPLASH[i]);
                i++;
            } else {
                clearInterval(interval);
                this.markedForDelete = true; 
            }
        }, 20);
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
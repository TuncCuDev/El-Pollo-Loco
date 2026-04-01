class ThrowableObject extends MoveableObject {
    IMAGES_SPLASH = [
        '6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        '6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        '6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png'
    ];

    constructor(x, y, otherDirection = false) {
        super();
        this.loadImage('6_salsa_bottle/salsa_bottle.png'); 
        this.loadImages(this.IMAGES_SPLASH);

        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 100;
     
        this.speedY = 20;
        this.gravity = 0.5;
        this.otherDirection = otherDirection;
        this.flip = this.otherDirection;
        this.speedX = this.otherDirection ? -7 : 7;

        this.throwSound = new Audio('sounds/bottlesounds.mp3');
        this.throwSound.volume = 0.1;
        this.splashSound = new Audio('sounds/splash.mp3');
        this.splashSound.volume = 0.1;

        this.throw();
    }
    

    playSplashAnimation() {
        this.stopMovement();
        this.playSplashSound();
        this.animateSplashImages();
    }

    stopMovement() {
        this.hasSplashed = true;
        this.speed = 0;
        this.speedY = 0;
    }

    playSplashSound() {
        if (!soundOn || !this.splashSound) return;
        this.splashSound.currentTime = 0;
        this.splashSound.play();
    }

    animateSplashImages() {
        let frameIndex = 0;

        const interval = setInterval(() => {
            if (frameIndex < this.IMAGES_SPLASH.length) {
                this.loadSplashFrame(frameIndex);
                frameIndex++;
            } else {
                this.endSplashAnimation(interval);
            }
        }, 50); 
    }

    loadSplashFrame(index) {
        this.loadImage(this.IMAGES_SPLASH[index]);
    }

    endSplashAnimation(interval) {
        clearInterval(interval);
        this.markedForDelete = true;
    }

    throw() {
        this.applyGravity();
        if (soundOn) this.playThrowSound();
        this.startMovement();
    }

    playThrowSound() {
        this.throwSound.currentTime = 0;
        this.throwSound.play();
    }

    startMovement() {
        if (this.movementInterval) clearInterval(this.movementInterval);
        this.movementInterval = setInterval(() => {
            this.x += this.speedX; 
        }, 1000 / 60);
    }

    isColliding(enemy) {
        return this.x + this.width > enemy.x - 20 &&
            this.y + this.height > enemy.y - 20 &&
            this.x < enemy.x + enemy.width + 20 &&
            this.y < enemy.y + enemy.height + 20;
    }
}
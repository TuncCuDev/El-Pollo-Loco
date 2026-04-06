class ThrowableObject extends MoveableObject {
    IMAGES_SPLASH = [
        'assets/images/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/images/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/images/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png'
    ];

    
    constructor(x, y, otherDirection = false) {
        super();
        this.loadImage('assets/images/6_salsa_bottle/salsa_bottle.png'); 
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

        this.throwSound = new Audio('assets/sounds/bottlesounds.mp3');
        this.throwSound.volume = 0.1;
        this.splashSound = new Audio('assets/sounds/splash.mp3');
        this.splashSound.volume = 0.1;

        this.throw();
    }
    

    /**
     * Called when the bottle hits something.
     */
    playSplashAnimation() {
        this.stopMovement();
        this.playSplashSound();
        this.animateSplashImages();
    }


    /**
     * Stops the bottle physically.
     */
    stopMovement() {
        this.hasSplashed = true;
        this.speed = 0;
        this.speedY = 0;
    }

    /**
     * Plays the splash sound of sound is on.
     */
    playSplashSound() {
        if (!soundOn || !this.splashSound) return;
        this.splashSound.currentTime = 0;
        this.splashSound.play();
    }

    /**
     * Loops through all splash images.
     */
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

    /**
     * Loads the splash image for the current frame.
     * @param {number} index - The index of the splash frame to load.
     */
    loadSplashFrame(index) {
        this.loadImage(this.IMAGES_SPLASH[index]);
    }


    /**
     * Stops the splash animation.
     * @param {number} interval - The interval ID returned by `setInterval` for the splash animation.
     */
    endSplashAnimation(interval) {
        clearInterval(interval);
        this.markedForDelete = true;
    }

    /**
     * Called when the bottle is thrown.
    */
    throw() {
        this.applyGravityThrow();
        if (soundOn) this.playThrowSound();
        this.startMovement();
    }

    /**
     * Plays the throw sound.
     */
    playThrowSound() {
        this.throwSound.currentTime = 0;
        this.throwSound.play();
    }

    /**
     * Starts horizontal movement of the bottle.
     */
    startMovement() {
        if (this.movementInterval) clearInterval(this.movementInterval);
        this.movementInterval = setInterval(() => {
            this.x += this.speedX; 
        }, 1000 / 60);
    }

    /**
     * Checks if the bottle collides with an enemy.
     * @param {Object} enemy - The enemy object to check collision with.
     */
    isColliding(enemy) {
        return this.x + this.width > enemy.x &&
            this.y + this.height > enemy.y + 5 &&
            this.x < enemy.x + enemy.width  &&
            this.y < enemy.y + enemy.height + 10;
    }
}
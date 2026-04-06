class Chicken extends MoveableObject {
    y = 360;
    height = 70;
    width = 90;
    isDead = false;
    IMAGES_WALKING = [
        'assets/images/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/images/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/images/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGE_DEAD = 'assets/images/3_enemies_chicken/chicken_normal/2_dead/dead.png';
   
    
    constructor() {
        super().loadImage('assets/images/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 250 + Math.random() * (2000 - 200);
        this.speed = 0.15 + Math.random() * 0.25;

        this.chickenSound = new Audio('assets/sounds/chicken2.mp3');
        this.chickenSound.volume = 0.1;
        this.chickenDie = new Audio('assets/sounds/chickendie.mp3');
        this.chickenDie.volume = 0.1;

        this.animate();
        this.playAudio();
    }


    /**
     * Plays the chicken’s sound every 7 seconds.
     */
    playAudio() {
        this.audioInterval = setInterval(() => {
            if (!this.isDead && soundOn && this.world.gameIsRunning) { 
                this.chickenSound.currentTime = 0;
                this.chickenSound.play();
            }
        }, 7000);
    }

    /**
     * Movement animation.
     */
    animate() {
        setInterval(() => {
            if (!this.isDead) this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (!this.isDead) this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    /**
     * Kills the chicken when called.
     */
    kill() {
        if (this.isDead) return;

        this.markAsDead();
        this.showDeadImage();
        if (soundOn) {
            this.playDeathSound();
        }
        this.removeFromWorldAfterDelay(500);
    }

    /**
     * Marks the chicken as dead.
     */
    markAsDead() {
        this.isDead = true;
    }

    /**
     * Replaces its image with a dead sprite.
     */
    showDeadImage() {
        this.loadImage(this.IMAGE_DEAD);
    }

    /**
     * Plays the chicken’s death sound from the beginning.
     */
    playDeathSound() {
        this.chickenDie.currentTime = 0;
        this.chickenDie.play();
    }

    /**
     *  Removes the enemy from the world after a delay.
     * @param {number} delay - The time in milliseconds to wait before removing the enemy.
     */
    removeFromWorldAfterDelay(delay) {
        setTimeout(() => {
            if (this.world) {
                const index = this.world.level.enemies.indexOf(this);
                if (index > -1) this.world.level.enemies.splice(index, 1);
            }
        }, delay);
    }
}

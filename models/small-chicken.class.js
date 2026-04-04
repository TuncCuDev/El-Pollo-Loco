class SmallChicken extends MoveableObject {
    y = 375; 
    height = 50; 
    width = 60;

    IMAGES_WALKING = [
        'assets/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGE_DEAD = 'assets/3_enemies_chicken/chicken_small/2_dead/dead.png';
    isDead = false;

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]); 
        this.loadImages(this.IMAGES_WALKING);

        this.x = 250 + Math.random() * (2000 - 500);
        this.speed = 0.2 + Math.random() * 0.3; 

        this.chickenDie = new Audio('assets/sounds/chickendie.mp3');
        this.chickenDie.volume = 0.1;

        this.animate();
    }
    

    /**
     * This makes the enemy walk left and animate continuously until killed.
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
     * This creates a smooth death effect.
     */
    kill() {
        if (this.isDead) return;

        this.markAsDead();
        this.playDeathSound();
        this.removeFromWorldAfterDelay(500);
    }

    /**
     * Loads the dead image.
     */
    markAsDead() {
        this.isDead = true;
        this.loadImage(this.IMAGE_DEAD);
    }

    /**
     * Plays the death sound if sound is enabled.
     */
    playDeathSound() {
        if (!soundOn || !this.chickenDie) return;

        this.chickenDie.currentTime = 0;
        this.chickenDie.play();
    }

    /**
     * Removes the enemy from the enemies array so it no longer appears or interacts in the game.
     */
    removeFromWorldAfterDelay(delay) {
        setTimeout(() => {
            if (!this.world) return;

            const index = this.world.level.enemies.indexOf(this);
            if (index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }, delay);
    }
}
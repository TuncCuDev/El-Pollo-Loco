class Endboss extends MoveableObject {
    height = 350;
    width = 250;
    y = 100;
    hadFirstContact = false;
    hits = 0;
    isDead = false;
    energy = 100;
    isHurt = false;
    walkInterval;
    moveInterval;
    IMAGES_WALKING = [
        '4_enemie_boss_chicken/2_alert/G5.png',
        '4_enemie_boss_chicken/2_alert/G6.png',
        '4_enemie_boss_chicken/2_alert/G7.png',
        '4_enemie_boss_chicken/2_alert/G8.png',
        '4_enemie_boss_chicken/2_alert/G9.png',
        '4_enemie_boss_chicken/2_alert/G10.png',
        '4_enemie_boss_chicken/2_alert/G11.png',
        '4_enemie_boss_chicken/2_alert/G12.png'
    ];

    deadImages = [
        '4_enemie_boss_chicken/5_dead/G24.png',
        '4_enemie_boss_chicken/5_dead/G25.png',
        '4_enemie_boss_chicken/5_dead/G26.png'
    ];
    
    IMAGES_HuRT = [
        '4_enemie_boss_chicken/4_hurt/G21.png',
        '4_enemie_boss_chicken/4_hurt/G22.png',
        '4_enemie_boss_chicken/4_hurt/G23.png'
    ]
  

    
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HuRT);
        this.loadImages(this.deadImages);
        this.x = 2500;

        this.statusBar = new EndbossStatusBar();
        this.statusBar.setPercentage(this.energy); 

        this.endbossHit = new Audio('sounds/endbossmatch.mp3');
        this.winSound = new Audio('sounds/wingame.mp3');
        this.endbossDie = new Audio('sounds/endbossdie.mp3');
        
        this.animate();
    }

    animate() {
        this.startWalkingAnimation();
        this.startPatrolMovement(2000, 2500);
    }

    startWalkingAnimation() {
        this.walkInterval = setInterval(() => {
            if (!this.isHurt && !this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    startPatrolMovement(minX, maxX) {
        let direction = 1;

        this.moveInterval = setInterval(() => {
            this.updatePosition(direction, minX, maxX);
            direction = this.updateDirection(this.x, direction, minX, maxX);
        }, 100);
    }

    updatePosition(direction, minX, maxX) {
        this.x += direction * this.speed * 10;
    }


    updateDirection(currentX, direction, minX, maxX) {
        if (currentX >= maxX) return -1;
        if (currentX <= minX) return 1;
        return direction;
    }

    hitByBottle() {
        if (this.isDead) return;

        this.energy -= 25;
        if (this.energy < 0) this.energy = 0;
        this.statusBar.setPercentage(this.energy);

        if (this.energy > 0) {
            this.playHurtAnimation();
        } else if (!this.isDead) {
            this.die();
        }
    }

    playHurtAnimation() {
        if (!this.isHurt) {
            this.startHurtAnimation();
        }
    }

    startHurtAnimation() {
        if (this.hurtInterval) clearInterval(this.hurtInterval); 
        this.isHurt = true;
        let i = 0;

        this.hurtInterval = setInterval(() => {
            if (i < this.IMAGES_HuRT.length) {
                this.showHurtFrame(i);
                i++;
            } else {
                this.finishHurtAnimation(this.hurtInterval);
                this.hurtInterval = null;
            }
        }, 500);
    }

    showHurtFrame(index) {
        this.loadImage(this.IMAGES_HuRT[index]);
        if (soundOn) {
            this.playHurtSound();
        }
    }

    playHurtSound() {
        this.endbossHit.currentTime = 0;
        this.endbossHit.volume = 0.4;
        this.endbossHit.play();
    }

    finishHurtAnimation(interval) {
        clearInterval(interval);
        this.isHurt = false;
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;

        this.playDeathSound();
        this.stopIntervals();
        this.playDeathAnimation();
    }

    playDeathSound() {
        if (!soundOn) return;
        this.endbossDie.volume = 0.5;
        this.endbossDie.play();
    }

    stopIntervals() {
        clearInterval(this.walkInterval);
        clearInterval(this.moveInterval);
    }

    playDeathAnimation() {
        let i = 0;
        const deathInterval = setInterval(() => {
            if (i < this.deadImages.length) {
                this.loadImage(this.deadImages[i]);
                i++;
            } else {
                clearInterval(deathInterval);
                this.finishDeath();
            }
        }, 300);
    }

    finishDeath() {
        if (!this.world) return;

        if (soundOn) {
            this.winSound.currentTime = 0;
            this.winSound.volume = 0.1;
            this.winSound.play();
        }

        this.world.youWin();
    }
}


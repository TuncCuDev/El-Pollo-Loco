class Endboss extends MoveableObject {
    height = 350;
    width = 250;
    y = 100;
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
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];
    hadFirstContact = false;
    hits = 0;
    isDead = false;
    energy = 100;
    

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2500;

        this.statusBar = new EndbossStatusBar();
        this.statusBar.setPercentage(this.energy); 

        this.winSound = new Audio('sounds/wingame.mp3');
        this.animate();
    }

    animate() {
        let i = 0;
        setInterval(() => {
                this.playAnimation(this.IMAGES_WALKING);
            }, 200)

        let direction = 1; 
        let minX = 2000; 
        let maxX = 2500; 

        setInterval(() => {
            this.x += direction * this.speed * 10; 
            if (this.x >= maxX) direction = -1; 
            if (this.x <= minX) direction = 1;  
        }, 2); 
    }
        


    hitByBottle() {
        if (this.isDead) return;

        this.energy -= 25;
        if (this.energy < 0) this.energy = 0;
        this.statusBar.setPercentage(this.energy);

        if (this.energy === 0 && !this.isDead) {
            this.die();
        }
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;
        
        let i = 0;
        const deathInterval = setInterval(() => {
            if (i < this.deadImages.length) {
                this.loadImage(this.deadImages[i]);
                i++;
            } else {
                clearInterval(deathInterval);
                if (this.world) {
                    if (soundOn) {
                        this.winSound.currentTime = 0;
                        this.winSound.volume = 0.1;
                        this.winSound.play();
                    }
                    this.world.youWin();
                }
            }
        }, 300);
    }
}


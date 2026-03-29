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

          this.id = Math.random().toString(36).substr(2, 5); // kurze zufällige ID
    console.log('Endboss created with ID:', this.id);

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
        }


 hitByBottle() {
    if (this.isDead) return;

    console.log(`hitByBottle called on ID ${this.id} BEFORE:`, this.energy);
    this.energy -= 25;
    if (this.energy < 0) this.energy = 0;
    this.statusBar.setPercentage(this.energy);
    console.log(`hitByBottle called on ID ${this.id} AFTER:`, this.energy);

    if (this.energy === 0 && !this.isDead) {
        console.log(`Energy is 0, calling die() now for ID ${this.id}`);
        this.die();
    }
}

die() {
    if (this.isDead) return;
    this.isDead = true;

    console.log(`die() called on ID ${this.id} Energy:`, this.energy);
    
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


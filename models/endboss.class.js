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
    hadFirstContact = false;
    hits = 0;
    isDead = false;
    deadImages = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];


    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2500;
        this.animate();
    }

    animate() {
        let i = 0;
        setInterval(() => {
            if (i < 10) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(); // hinzufpgen der animation
            }

            i++;

            if(world.character.x > 2800 && !hadFirstContact) {
                i = 0;
                hadFirstContact = true;
            }
        }, 150 )
    }

    hitByBottle() {
        if (this.isDead) return; 
        this.hits++;

        if (this.hits >= 4) {
            this.die();
        }
    }


    die() {
        this.isDead = true;
        let i = 0;

        const deathInterval = setInterval(() => {
            if (i < this.deadImages.length) {
                this.loadImage(this.deadImages[i]);
                i++;
            if (this.world) {
                this.world.gameOver(true); // Screen Win
            }
        }
    }, 300); 
}
}
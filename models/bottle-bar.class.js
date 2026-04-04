class BottleBar extends DrawableObject {
    bottles = 0;
    IMAGES_BOTTLE = [
        'assets/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'assets/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'assets/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'assets/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'assets/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'assets/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES_BOTTLE);
        this.img = this.imageCache[this.IMAGES_BOTTLE[0]];

        this.x = 30;
        this.y = 100;
        this.width = 200;
        this.height = 60;
    }
    
    /**
     * Updates count of bottles.
     */
    setBottles(amount) {
        this.bottles = amount;
        this.img = this.imageCache[this.resolveImageIndex()];
    }

    /**
     * Converts the number of bottles into an index for your bottle bar images.
     */
    resolveImageIndex() {
        if (this.bottles >= 12) {
            return this.IMAGES_BOTTLE[5];
        } else if (this.bottles >= 10) {
            return this.IMAGES_BOTTLE[4];
        } else if (this.bottles >= 8) {
            return this.IMAGES_BOTTLE[3];
        } else if (this.bottles >= 6) {
            return this.IMAGES_BOTTLE[2];
        } else if (this.bottles >= 3) {
            return this.IMAGES_BOTTLE[1];
        } else {
            return this.IMAGES_BOTTLE[0];
        }
    }

    draw(ctx) {
        if (this.img) ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}
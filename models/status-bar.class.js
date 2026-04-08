class StatusBar extends DrawableObject {
    percentage = 100;
    IMAGES = [
        'assets/images/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'assets/images/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png', 
        'assets/images/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'assets/images/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'assets/images/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'assets/images/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png' 
    ];


    constructor() {
        super();this.loadImage('assets/images/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png');
        this.loadImages(this.IMAGES);

        this.x = 5;
        this.y = 0;
        this.width = 200;
        this.height = 40;

        this.setPercentage(100);
    }

    
    /**
     * Updates the percentage value and sets the corresponding image from the image cache.
     * @param {number} percentage - The new percentage value to display (0–100).
     */
    setPercentage(percentage) {
        this.percentage = percentage; 
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines which image to show based on the percentage.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 75) {
            return 4;
        } else if (this.percentage > 50) {
            return 3;
        } else if (this.percentage > 25) {
            return 2;
        } else if (this.percentage > 3) {
            return 1;
        } else {
            return 0;
        }
    };
}
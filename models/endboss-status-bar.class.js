class EndbossStatusBar extends DrawableObject {
    IMAGES = [
        'assets/images/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'assets/images/7_statusbars/2_statusbar_endboss/orange/orange20.png', 
        'assets/images/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'assets/images/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'assets/images/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'assets/images/7_statusbars/2_statusbar_endboss/orange/orange100.png' 
    ];
    percentage = 100; 


    constructor() {
        super();this.loadImage('assets/images/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png');
        this.loadImages(this.IMAGES);

        this.x = 510;
        this.y = 0;
        this.width = 200;
        this.height = 40;

        this.setPercentage(100);
    }
    

    /**
     * Updates the visual representation of the health/energy bar.
     * @param {number} percentage - The current percentage (e.g., health or energy) to display on the bar.
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
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    };
}
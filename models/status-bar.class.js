class StatusBar extends DrawableObject {
    percentage = 100;
    IMAGES = [
        'assets/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'assets/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png', 
        'assets/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'assets/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'assets/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'assets/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png' 
    ];

    constructor() {
        super();this.loadImage('assets/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png');
        this.loadImages(this.IMAGES);

        this.x = 30;
        this.y = 0;
        this.width = 200;
        this.height = 60;

        this.setPercentage(100);
    }

    /**
     * Loads that images from imageCache and sets it as this.img, updates the bar visually.
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
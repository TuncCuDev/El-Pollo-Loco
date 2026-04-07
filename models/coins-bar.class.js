class CoinsBar extends DrawableObject {
    IMAGES_COINS = [
        'assets/images/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'assets/images/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'assets/images/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'assets/images/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'assets/images/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'assets/images/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];
    coins = 0; 

    
    constructor() {
        super().loadImages(this.IMAGES_COINS); 
        this.img = this.imageCache[this.IMAGES_COINS[0]]; 
        
        this.x = 5;
        this.y = 30;
        this.width = 200;
        this.height = 40;
    }


    /**
     * Updates the character’s coin count and refreshes the coin display.
     * @param {number} coins - The new total number of coins collected.
     */
    setCoins(coins) {
        this.coins = coins;
        this.updateImage();
    }

    /**
     * Converts the number of coins into an index for your coin bar images.
     */
    updateImage() {
        let index = Math.floor(this.coins / 2);
        if (index > 5) index = 5;
        if (index < 0) index = 0;

        this.img = this.imageCache[this.IMAGES_COINS[index]]; 
    }
}
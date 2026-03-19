class CoinsBar extends DrawableObject {
    IMAGES_COINS = [
        '7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        '7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        '7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        '7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        '7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        '7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    coins = 0; 

    constructor() {
        super().loadImages(this.IMAGES_COINS); // <- ALLE Bilder laden!
        this.img = this.imageCache[this.IMAGES_COINS[0]]; // Anfangsbild
        
        this.x = 30;
        this.y = 50;
        this.width = 200;
        this.height = 60;
    }

    setCoins(coins) {
        this.coins = coins;
        this.updateImage();
    }

    updateImage() {
        let index = Math.floor(this.coins / 2);
        if (index > 5) index = 5;
        if (index < 0) index = 0;

        this.img = this.imageCache[this.IMAGES_COINS[index]]; // <- Jetzt existiert das Bild
    }
}
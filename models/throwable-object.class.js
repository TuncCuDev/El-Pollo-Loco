class ThrowableObject extends MoveableObject {
     IMAGES_BOTTLE = [
        '7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        '7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        '7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        '7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        '7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        '7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];
    bottles = 0;

    constructor() {
        super();
        this.loadImages(this.IMAGES_BOTTLE);
        this.img = this.imageCache[this.IMAGES_BOTTLE[0]];

        this.x = 30;
        this.y = 100;
        this.height = 60;
        this.width = 50;
    }

    setBottles(bottles) {
        this.bottles = bottles;
        console.log('BottleBar: neue Anzahl =', this.bottles);
        this.img = this.imageCache[this.resolveImageIndex()]; // Bild setzen
    }

    useBottle() {
        if (this.bottles > 0) {
            this.bottles--;
            console.log('BottleBar: Flasche geworfen, verbleibend =', this.bottles);
            this.img = this.imageCache[this.resolveImageIndex()]; // Bild aktualisieren
            return true; // Werfen erlaubt
        } else {
            console.log('Keine Flaschen zum Werfen!');
            return false; // Werfen nicht erlaubt
        }
    }

    resolveImageIndex() {
        if (this.bottles >= 10) return this.IMAGES_BOTTLE[5];
        if (this.bottles >= 8) return this.IMAGES_BOTTLE[4];
        if (this.bottles >= 6) return this.IMAGES_BOTTLE[3];
        if (this.bottles >= 4) return this.IMAGES_BOTTLE[2];
        if (this.bottles >= 2) return this.IMAGES_BOTTLE[1];
        return this.IMAGES_BOTTLE[0];
    }

    draw(ctx) {
        if (this.img) ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


}


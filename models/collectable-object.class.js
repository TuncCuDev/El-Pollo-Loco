class CollectableObject extends DrawableObject {
   
    constructor(x, y, imagePath) {
        super().loadImage(imagePath);

        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 100;
    }
}

 
class CollectableObject extends DrawableObject {
    constructor(x, y, imagePath) {
        super();
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.imagePath = imagePath; // unbedingt merken!
        this.loadImage(imagePath);
    }
}
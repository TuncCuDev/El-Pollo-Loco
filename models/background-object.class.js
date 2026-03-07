class Background extends MovableObject {
    width = 720;
    height = 400;

    constructor(imagePath, x) {
    super();
    this.loadImage(imagePath, x)

    this.x = x;
    this.y = 420 - this.height;
    }
}
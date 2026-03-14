class Background extends MoveableObject {
    width = 720;
    height = 480;

    constructor(imagePath, x) {
    super();
    this.loadImage(imagePath, x)

    this.x = x;
    this.y = 420 - this.height;
    }
}
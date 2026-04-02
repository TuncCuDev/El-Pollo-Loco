class DrawableObject {
    x = 120;
    y = 280;
    height = 100;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;


    /**
     * Creates a new image object.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the current image.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) { }
    

    /**
     * Loads multiple images at once.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        })
    }
}
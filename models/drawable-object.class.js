class DrawableObject {
    x = 120;
    y = 280;
    height = 100;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;


    /**
     * Loads an image and sets it as the current image.
     * @param {string} path - The path to the image file to load.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the current image.
     *  @param {CanvasRenderingContext2D} ctx - The canvas rendering context used to draw the image.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame() { }
    

    /**
     * Loads multiple images and stores them in the image cache.
     * @param {Array<string>} arr - An array of image paths to load.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        })
    }
}
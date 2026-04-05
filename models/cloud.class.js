class Cloud extends MoveableObject {
    y = 20;
    width = 500;
    height = 250; 


    constructor() {
        super().loadImage('assets/images/5_background/layers/4_clouds/1.png');
       
        this.x = 500 + Math.random() * (2000 - 500);
        this.animate();
    }
    

    /**
     * Movement loop for game.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}
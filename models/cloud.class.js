class Cloud extends MoveableObject {
    y = 20;
    width = 500;
    height = 250; 


    constructor() {
        super().loadImage('5_background/layers/4_clouds/1.png');
       
    
        this.x = 500 + Math.random() * (2000 - 500);
        this.animate();
    }

     animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
       
    }
}
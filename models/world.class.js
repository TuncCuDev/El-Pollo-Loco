class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    coinsBar = new CoinsBar();
    bottleBar = new BottleBar();
    throwableObject = [new ThrowableObject()]; 
    gameIsRunning = true;
    takeSound = new Audio('sounds/takecoin.mp3');

    
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.setWorld();

        this.draw();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.collectables = this.level.collectableObject;
    }
 
    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObject();
        }, 200);
    }

    checkThrowObject() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObject.push(bottle);
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            };
        },)

    for (let i = this.collectables.length - 1; i >= 0; i--) {
    let item = this.collectables[i];
    
    if (item && item.img && this.character.isCollidingCollectable(item)) { 
        if (item.imagePath.includes('coin')) {
            this.coinsBar.setCoins(this.coinsBar.coins + 1);
            this.takeSound.volume = 0.1;
            this.takeSound.play();
        } else if (item.imagePath.includes('bottle')) {
            this.bottleBar.setBottles(this.bottleBar.bottles + 1);
        } this.collectables.splice(i, 1);
            this.takeSound.volume = 0.1;
            this.takeSound.play();
        }
        }
    }

    gameOver() {
        if (!this.gameIsRunning) return;
        this.gameIsRunning = false;

        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;

        if (this.character && this.character.jumpSound) {
            this.character.jumpSound.pause();
            this.character.jumpSound.currentTime = 0;
        }

        document.getElementById('gameOverOverlay').style.display = 'block';
        document.getElementById('restartButton').style.display = 'inline-block';
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.Backgrounds);

        this.ctx.translate(-this.camera_x, 0);
        // --------Space for fixed objects
        this.addToMap(this.statusBar);
        this.addToMap(this.coinsBar);
        this.addToMap(this.bottleBar);
        this.ctx.translate(this.camera_x, 0); //Forwards
        
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObject);
        this.addObjectsToMap(this.collectables);

        this.ctx.translate(-this.camera_x, 0);

        if (!this.gameIsRunning) return;
        // Draw everytime
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach (o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
     
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        
        if (mo.otherDirection) {
            this.flipImageBack(mo)
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
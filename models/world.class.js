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
    endbossBar = new EndbossStatusBar();
    throwableObject = [new ThrowableObject()]; 
    endBoss = endBoss;
    gameIsRunning = true;
    hasWon = false; 
    lastThrowTime = 0; 
    throwCooldown = 1500;
    

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        
        this.backgroundMusic = new Audio('sounds/gamemusic.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.1;
        this.backgroundMusic.play();

        this.setWorld();
        this.draw();
        this.run();
    }

    setWorld() {
    this.character.world = this;
    this.collectables = this.level.collectableObject;

    this.level.enemies.forEach(enemy => {
        enemy.world = this;
        });
    }
     
    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObject();
        }, 200);
    }

    checkThrowObject() {
        const now = Date.now(); 

        if (this.keyboard.D 
            && this.character.bottles > 0 
            && (now - this.lastThrowTime >= this.throwCooldown)) {
            
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObject.push(bottle);
            this.character.bottles--;
            this.bottleBar.setBottles(this.character.bottles);
            this.lastThrowTime = now; 
        }
        for (let i = 0; i < this.throwableObject.length; i++) {
                let bottle = this.throwableObject[i];
                if (bottle.markedForDelete) {
                    this.throwableObject.splice(i, 1);
                    i--;
                    continue;
                }
                if (bottle.hasSplashed) continue;
                this.checkEndbossHit(bottle); 
                this.checkEnemiesHit(bottle); 
        }
    }


    checkEndbossHit(bottle) {
        if (!this.endBoss || this.endBoss.isDead) return;

        if (bottle.isColliding(this.endBoss)) {
            if (bottle.hasSplashed) return;
            bottle.hasSplashed = true;

            bottle.playSplashAnimation();

            if (!this.endBoss.isDead) {
                this.endBoss.hitByBottle();
            }
        }
    }

    checkEnemiesHit(bottle) {
        this.level.enemies.forEach(enemy => {
            if (enemy === this.endBoss) return;

            if (!enemy.isDead && bottle.isColliding(enemy)) {
                console.log("HIT DETECTED!"); 

                bottle.playSplashAnimation();

                if (typeof enemy.kill === 'function') {
                    enemy.kill();
                } else if (typeof enemy.die === 'function') {
                    enemy.die();
                }
            }
        });
    }

    checkCollisions() {
        this.level.enemies.forEach(enemy => {
        const jumpingOn = this.character.isJumpingOn(enemy);

        if (jumpingOn) {
            enemy.die();               
            this.character.speedY = 25; 
        } else if (this.character.isColliding(enemy) && !jumpingOn) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        }
        });

        for (let i = this.collectables.length - 1; i >= 0; i--) {
            let item = this.collectables[i];
            if (item && item.img && this.character.isCollidingCollectable(item)) { 
                if (item.imagePath.includes('coin')) {
                    this.coinsBar.setCoins(this.coinsBar.coins + 1);
                } else if (item.imagePath.includes('bottle')) {
                if (this.character.bottles < 15) {
                    this.character.bottles++;
                    this.bottleBar.setBottles(this.character.bottles);
                }   
                }
            this.collectables.splice(i, 1);
            }
        }
    }

    youWin() {
    console.log('youWin() called! Energy:', this.endBoss ? this.endBoss.energy : 'no boss', new Error().stack);
        if (!this.gameIsRunning) return;
        this.gameIsRunning = false;

        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
        document.getElementById('youWinOverlay').style.display = 'block';
        document.getElementById('restartButton').style.display = 'inline-block';

        this.level.enemies.forEach(chicken => {
        if (chicken.audioInterval) {
            clearInterval(chicken.audioInterval);
        }
        chicken.chickenSound.pause();
        chicken.chickenSound.currentTime = 0;

        chicken.chickenDie.pause();
        chicken.chickenDie.currentTime = 0;
        });
        this.throwableObject.forEach(bottle => {
            bottle.throwSound.pause();
            bottle.throwSound.currentTime = 0;

            bottle.hitSound.pause();
            bottle.hitSound.currentTime = 0;
        });
    }

    gameOver() {
        if (!this.gameIsRunning) return;
        this.gameIsRunning = false;

        const gameOverSound = new Audio('sounds/gameover.mp3');
        gameOverSound.play();

        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }

        document.getElementById('gameOverOverlay').style.display = 'block';
        document.getElementById('restartButton').style.display = 'inline-block';

        this.level.enemies.forEach(chicken => {
        if (chicken.audioInterval) {
            clearInterval(chicken.audioInterval);
        }

        chicken.chickenSound.pause();
        chicken.chickenSound.currentTime = 0;

        chicken.chickenDie.pause();
        chicken.chickenDie.currentTime = 0;
        });

        this.throwableObject.forEach(bottle => {
            bottle.throwSound.pause();
            bottle.throwSound.currentTime = 0;

            bottle.hitSound.pause();
            bottle.hitSound.currentTime = 0;
        });
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
        if (this.endBoss) {
            this.addToMap(this.endBoss.statusBar);
        }
        
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
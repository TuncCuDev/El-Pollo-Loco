class World {
    character = new Character();
    statusBar = new StatusBar();
    coinsBar = new CoinsBar();
    bottleBar = new BottleBar();
    endbossBar = new EndbossStatusBar();
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    endBoss = endBoss;
    gameIsRunning = true;
    hasWon = false; 
    lastThrowTime = 0; 
    throwCooldown = 1500;
    bossMusicStarted = false;
    bossMusic;
    throwableObject = [new ThrowableObject()]; 
    
    

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = initLevel1();
      
        this.backgroundMusic = new Audio('sounds/gamemusic.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.1;
        this.backgroundMusic.play();

        this.takeCoin = new Audio('sounds/takecoin.mp3');
        this.takeCoin.volume = 0.1;
        
        this.takeBottle = new Audio ('sounds/bottlesound.mp3');
        this.takeBottle.volume = 0.1;

        this.setWorld();
        this.draw();
        this.run();
    }


    setWorld() {
        this.setCharacterWorld();
        this.setCollectable();
        this.setEnemisWorld();
    }

    setCharacterWorld() {
        this.character.world = this;
    }

    setCollectable() {
        this.collectables = this.level.collectableObject;
    }

    setEnemisWorld() {
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

    checkMusicSwitch() {
        if (this.character.x < 1900 || this.musicTriggerReached) return;
        this.musicTriggerReached = true;

        this.stopBackgroundMusic();
        this.playBossMusic();
    }

    stopBackgroundMusic() {
        if (!this.backgroundMusic) return;

        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }

    playBossMusic() {
        if (!soundOn) return;

        this.bossMusic = new Audio('sounds/matchsound.mp3');
        this.bossMusic.loop = true;
        this.bossMusic.volume = 0.8;
        this.bossMusic.play();
    }


    checkThrowObject() {
        this.throwBottle();
        this.updateThrowableObjects();
    }

    throwBottle() {
        const now = Date.now(); 

        if (this.keyboard.D && this.character.bottles > 0 && (now - this.lastThrowTime >= this.throwCooldown)) {
            this.character.resetLongIdle();
            let bottle = new ThrowableObject(this.character.x + (this.character.otherDirection ? -40 : 40), this.character.y + 100, this.character.otherDirection );
            this.throwableObject.push(bottle);
            this.character.bottles--;
            this.bottleBar.setBottles(this.character.bottles);
            this.lastThrowTime = now; 
        }
    }

    updateThrowableObjects() {
        for (let i = 0; i < this.throwableObject.length; i++) {
            let bottle = this.throwableObject[i];
            if (bottle.markedForDelete) {
                this.throwableObject.splice(i, 1);
                i--;
                continue;
            }
            if (bottle.hasSplashed) continue;

            this.checkHits(bottle);
        }
    }

    checkHits(bottle) {
        this.checkEndbossHit(bottle); 
        this.checkEnemiesHit(bottle); 
    }

    checkEndbossHit(bottle) {
        if (!this.canHitEndboss(bottle)) return;

        this.hitEndboss(bottle);
    }

    canHitEndboss(bottle) {
        return this.endBoss && !this.endBoss.isDead && !bottle.hasSplashed && bottle.isColliding(this.endBoss);
    }

    hitEndboss(bottle) {
        bottle.hasSplashed = true;
        bottle.playSplashAnimation();
        this.endBoss.hitByBottle();
    }

    checkEnemiesHit(bottle) {
        this.level.enemies.forEach(enemy => this.checkEnemyHit(enemy, bottle));
    }

    checkEnemyHit(enemy, bottle) {
        if (enemy === this.endBoss || enemy.isDead || !bottle.isColliding(enemy)) return;

        this.hitEnemy(enemy, bottle);
    }

    hitEnemy(enemy, bottle) {
        bottle.playSplashAnimation();

        if (typeof enemy.kill === 'function') enemy.kill();
        else if (typeof enemy.die === 'function') enemy.die();
    }

    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkCollectableCollisions();
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => this.handleEnemyCollision(enemy));
    }

    handleEnemyCollision(enemy) {
        if (this.character.isJumpingOn(enemy)) {
            enemy.kill();
            this.character.speedY = 25; 
        } else if (this.character.isColliding(enemy)) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        }
    }

    checkCollectableCollisions() {
        for (let i = this.collectables.length - 1; i >= 0; i--) {
            const item = this.collectables[i];
            if (!item || !item.img) continue;

            if (this.character.isCollidingCollectable(item)) {
                this.handleCollectable(item);
                this.collectables.splice(i, 1);
            }
        }
    }

    handleCollectable(item) {
        if (item.imagePath.includes('coin')) {
            this.collectCoin();
        } else if (item.imagePath.includes('bottle')) {
            this.collectBottle();
        }
    }

    collectCoin() {
        this.coinsBar.setCoins(this.coinsBar.coins + 1);

        if (soundOn && this.takeCoin) {
            this.takeCoin.currentTime = 0;
            this.takeCoin.play();
        }
    }

    collectBottle() {
        if (this.character.bottles >= 15) return; 

        this.character.bottles++;
        this.bottleBar.setBottles(this.character.bottles);

        if (soundOn && this.takeBottle) {
            this.takeBottle.currentTime = 0;
            this.takeBottle.play();
        }
    }

    youWin() {
        if (!this.gameIsRunning) return;
        this.gameIsRunning = false;

        this.stopAllMusic();
        this.stopEnemySounds();
        this.stopThrowableSounds();
        this.showWinOverlay();
    }

    stopAllMusic() {
        [this.backgroundMusic, this.bossMusic].forEach(music => {
            if (!music) return;
            music.pause();
            music.currentTime = 0;
        });
    }

    stopEnemySounds() {
        this.level.enemies.forEach(enemy => {
            if (enemy.audioInterval) clearInterval(enemy.audioInterval);

            ['chickenSound', 'chickenDie'].forEach(soundKey => {
                if (!enemy[soundKey]) return;
                enemy[soundKey].pause();
                enemy[soundKey].currentTime = 0;
            });
        });
    }

    stopThrowableSounds() {
        this.throwableObject.forEach(bottle => {
            ['throwSound', 'hitSound'].forEach(soundKey => {
                if (!bottle[soundKey]) return;
                bottle[soundKey].pause();
                bottle[soundKey].currentTime = 0;
            });
        });
    }

    showWinOverlay() {
        document.getElementById('youWinOverlay').style.display = 'block';
        document.getElementById('restartButton').style.display = 'inline-block';
    }

    gameOver() {
        if (!this.gameIsRunning) return;
        this.gameIsRunning = false;

        if (this.soundOn) this.playGameOverSound(); 
        this.stopAllMusic();
        this.stopEnemySounds();
        this.stopEndbossSounds();
        this.stopThrowableSounds();
        this.showGameOverOverlay();
    }

    playGameOverSound() {
        const gameOverSound = new Audio('sounds/gameover.mp3');
        gameOverSound.play();
    }

    stopEndbossSounds() {
        if (!this.level.endboss) return;
        const endboss = this.level.endboss;

        if (endboss.audioInterval) {
            clearInterval(endboss.audioInterval);
            endboss.audioInterval = null;
        }
        
        ['endbossHit', 'crySound', 'endbossDie', 'honkSound'].forEach(soundKey => {
            if (!endboss[soundKey]) return;
            endboss[soundKey].pause();
            endboss[soundKey].currentTime = 0;
        });
    }

    stopEndbossSounds() {
        if (!this.level.endboss) return;

        const endboss = this.level.endboss;

        ['endbossHit', 'crySound', 'endbossDie'].forEach(soundKey => {
            if (!endboss[soundKey]) return;
            endboss[soundKey].pause();
            endboss[soundKey].currentTime = 0;
        });

        if (endboss.audioInterval) clearInterval(endboss.audioInterval);
    }

    stopThrowableSounds() {
        this.throwableObject.forEach(bottle => {
            ['throwSound', 'hitSound'].forEach(soundKey => {
                if (!bottle[soundKey]) return;
                bottle[soundKey].pause();
                bottle[soundKey].currentTime = 0;
            });
        });
    }

    showGameOverOverlay() {
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
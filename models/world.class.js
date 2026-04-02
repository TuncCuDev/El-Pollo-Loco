class World {
    character = new Character();
    statusBar = new StatusBar();
    coinsBar = new CoinsBar();
    bottleBar = new BottleBar();
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    endBoss;
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
        this.endBoss = this.level.enemies.find (e => e instanceof Endboss);
        this.endbossBar = new EndbossStatusBar(this.endBoss);
      
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

    /**
     * Initializing world for game. Main components of the world.
     */
    setWorld() {
        this.setCharacterWorld();
        this.setCollectable();
        this.setEnemisWorld();
    }

    /**
     * Giving character reference to world.
     */

    setCharacterWorld() {
        this.character.world = this;
    }

    /**
     *Giving reference to collectables item.
     */
    setCollectable() {
        this.collectables = this.level.collectableObject;
    }

    /**
     * Giving reference to enemy objects.
     */
    setEnemisWorld() {
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

    /**
     * Checks if the character has collided with enemies or collectables and bottles.
     */
    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObject();
        }, 200);
    }

    /**
     * Checks if the character reached point 1900 = x to switch music.
     */
    checkMusicSwitch() {
        if (this.character.x < 1900 || this.musicTriggerReached) return;
        this.musicTriggerReached = true;
        this.stopBackgroundMusic();
        this.playBossMusic();
    }

    /**
     * Checks if background music exist to stop.
     */
    stopBackgroundMusic() {
        if (!this.backgroundMusic) return;
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }

    /**
     * Checks if sound is enabled.
     */
    playBossMusic() {
        if (!soundOn) return;
        this.bossMusic = new Audio('sounds/matchsound.mp3');
        this.bossMusic.loop = true;
        this.bossMusic.volume = 0.8;
        this.bossMusic.play();
    }

    /**
     * Checks if the character is trying to throw a bottle.
     */
    checkThrowObject() {
        this.throwBottle();
        this.updateThrowableObjects();
    }

    /**
     * Function for throwing one bottle with minimum delay.
     */
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

    /**
     * Function removes used bottles, check collisions.
     */
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

    /**
     * Check if thrown bottle hit anything.
     */
    checkHits(bottle) {
        this.checkEndbossHit(bottle); 
        this.checkEnemiesHit(bottle); 
    }

    /**
     * Checks if the bottle can hit the boss.
     */
    checkEndbossHit(bottle) {
        if (!this.canHitEndboss(bottle)) return;
        this.hitEndboss(bottle);
    }

    /**
     * Function for conditions are met.
     */
    canHitEndboss(bottle) {
        return this.endBoss && !this.endBoss.isDead && !bottle.hasSplashed && bottle.isColliding(this.endBoss);
    }

    /**
     * Marks the bottle as used, play the splash animation, tells the boss it got hit.
     */
    hitEndboss(bottle) {
        bottle.hasSplashed = true;
        bottle.playSplashAnimation();
        this.endBoss.hitByBottle();
    }

    /**
     * Loop through all enemies in the level.
     */
    checkEnemiesHit(bottle) {
        this.level.enemies.forEach(enemy => this.checkEnemyHit(enemy, bottle));
    }

    /**
     * Checks hits.
     */
    checkEnemyHit(enemy, bottle) {
        if (enemy === this.endBoss || enemy.isDead || !bottle.isColliding(enemy)) return;
        this.hitEnemy(enemy, bottle);
    }

    /**
     * Plays bottle splash animation and eliminate the enemy.
     */
    hitEnemy(enemy, bottle) {
        bottle.playSplashAnimation();
        if (typeof enemy.kill === 'function') enemy.kill();
        else if (typeof enemy.die === 'function') enemy.die();
    }

    /**
     * Checks enemy and collectable collisions.
     */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkCollectableCollisions();
    }
    /**
     * Loops through all enemis for collisions.
     */
    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => this.handleEnemyCollision(enemy));
    }

    /**
     * Safety check, seperates logic by enemy type.
     */
    handleEnemyCollision(enemy) {
        if (!enemy) return;
        if (enemy instanceof Endboss) {
            this.handleEndbossCollision(enemy);
        } else {
            this.handleNormalEnemyCollision(enemy);
        }
    }

    /**
     * Checks if the character touches the endboss.
     */
    handleEndbossCollision(endboss) {
        if (this.character.isColliding(endboss)) {
            this.character.hit();
            this.endbossBar.setPercentage(endboss.energy);
        }
    }

    /**
     *Function for character jumps on enemy or touching from side.
     */
    handleNormalEnemyCollision(enemy) {
        if (typeof enemy.kill !== 'function') return;
        if (this.character.isJumpingOn(enemy)) {
            this.killEnemy(enemy);
            this.character.speedY = 25; 
        } else if (this.character.isColliding(enemy)) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        }
    }

    /**
     * Function for enemy kill method.
     */
    killEnemy(enemy) {
        enemy.kill();
    }

    /**
     * Loop for collectables backwards.
     */
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

    /**
     * Function for collectables item,collct bottle or coin.
     */
    handleCollectable(item) {
        if (item.imagePath.includes('coin')) {
            this.collectCoin();
        } else if (item.imagePath.includes('bottle')) {
            this.collectBottle();
        }
    }

    /**
     * Coin counting and playing sound.
     */
    collectCoin() {
        this.coinsBar.setCoins(this.coinsBar.coins + 1);
        if (soundOn && this.takeCoin) {
            this.takeCoin.currentTime = 0;
            this.takeCoin.play();
        }
    }

    /**
     * Bottle cointing and playing sound.
     */
    collectBottle() {
        if (this.character.bottles >= 15) return; 
        this.character.bottles++;
        this.bottleBar.setBottles(this.character.bottles);
        if (soundOn && this.takeBottle) {
            this.takeBottle.currentTime = 0;
            this.takeBottle.play();
        }
    }

    /** 
     * Calls endGame() with status "win".
     */
    youWin() {
        this.endGame('win');
    }

    /**
     * For ending the game, and stopped all sounds.
     */
    endGame(status) {
        if (!this.gameIsRunning) return;

        this.gameIsRunning = false;

        this.stopAllMusic();
        this.stopEnemySounds();
        this.stopEndbossSounds();
        this.stopThrowableSounds();

        this.winOrGameOver(status);
    }

    /**
     * Decides what happens when the game ends based on status.
     */
    winOrGameOver(status) {
        if (status === 'gameOver') {
            if (this.soundOn) this.playGameOverSound();
            this.showGameOverOverlay();
        } else if (status === 'win') {
            this.showWinOverlay();
        }
    }

    /**
     * Stops background and match sounds.
     */
    stopAllMusic() {
        [this.backgroundMusic, this.bossMusic].forEach(music => {
            if (!music) return;
            music.pause();
            music.currentTime = 0;
        });
    }

    /**
     * Stopa individual sounds for each enemy.
     */
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


    /**
     * Stops all sounds of throwable objects.
     */
    stopThrowableSounds() {
        this.throwableObject.forEach(bottle => {
            ['throwSound', 'hitSound'].forEach(soundKey => {
                if (!bottle[soundKey]) return;
                bottle[soundKey].pause();
                bottle[soundKey].currentTime = 0;
            });
        });
    }

    /**
     * Shows the win screen.
     */
    showWinOverlay() {
        document.getElementById('youWinOverlay').style.display = 'block';
        document.getElementById('restartButton').style.display = 'inline-block';
    }

    /**
     * Function for losing the game.
     */
    gameOver() {
        this.endGame('gameOver');
    }

    /**
     * Creates game over sound.
     */
    playGameOverSound() {
        const gameOverSound = new Audio('sounds/gameover.mp3');
        gameOverSound.play();
    }

    /**
     * Stops all sounds for endboss.
     */
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

    /**
     * Shows the game over scree.
     */
    showGameOverOverlay() {
        document.getElementById('gameOverOverlay').style.display = 'block';
        document.getElementById('restartButton').style.display = 'inline-block';
    }

    /**
     * Draw UI, game objects, resetting camera etc.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.Backgrounds);

        this.ctx.translate(-this.camera_x, 0);
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

    /**
     * Loops through an array of objects.
     */
    addObjectsToMap(objects) {
        objects.forEach (o => {
            this.addToMap(o);
        });
    }

    /**
     * Draws movable objetc.
     */
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

    /**
     * Flips the canvas horizontally.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores orginal canvas state, reverts object position.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
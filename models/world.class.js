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
        
        this.initAudio();

        this.setWorld();
        this.draw();
        this.run();
    }


    /**
     * Initializes all game audio.
     */
    initAudio() {
        this.backgroundMusic = new Audio('assets/sounds/gamemusic.mp3');
        this.gameOverSound = new Audio('assets/sounds/gameover.mp3');
        this.takeCoin = new Audio('assets/sounds/takecoin.mp3');
        this.takeBottle = new Audio('assets/sounds/bottlesound.mp3');
        this.bossMusic = new Audio('assets/sounds/matchsound.mp3');

        if (soundOn) this.playBackgroundMusic();
        this.gameOverSound.volume = 0.5;
        this.takeCoin.volume = 0.1;
        this.takeBottle.volume = 0.1;
        this.bossMusic.volume = 0.5;
    }

    /**
     * Plays the background music in a loop.
     */
    playBackgroundMusic() {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.1;
        this.backgroundMusic.play();
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
        if (!soundOn || !this.gameIsRunning) return; 
        this.bossMusic.currentTime = 0;
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
     * Checks if the thrown bottle hits any target.
     * @param {Object} bottle - The bottle object to check for collisions.
     */
    checkHits(bottle) {
        this.checkEndbossHit(bottle); 
        this.checkEnemiesHit(bottle); 
    }

    /**
     * Checks if the bottle can hit the endboss and triggers the hit logic if possible.
     * @param {Object} bottle - The bottle object to check for collision with the endboss.
     */
    checkEndbossHit(bottle) {
        if (!this.canHitEndboss(bottle)) return;
        this.hitEndboss(bottle);
    }

    /**
     * Checks whether the bottle can hit the endboss.
     * @param {Object} bottle - The bottle object to check for collision with the endboss.
     */
    canHitEndboss(bottle) {
        return this.endBoss && !this.endBoss.isDead && !bottle.hasSplashed && bottle.isColliding(this.endBoss);
    }

    /**
     * Marks the bottle as used, plays the splash animation,
     * @param {Object} bottle - The bottle object that hits the endboss.
     */
    hitEndboss(bottle) {
        bottle.hasSplashed = true;
        bottle.playSplashAnimation();
        this.endBoss.hitByBottle();
    }

    /**
     * Loops through all enemies in the current level and checks if they are hit by the bottle.
     * @param {Object} bottle - The bottle object that may collide with enemies.
     */
    checkEnemiesHit(bottle) {
        this.level.enemies.forEach(enemy => this.checkEnemyHit(enemy, bottle));
    }

    /**
     * Checks if a bottle hits an enemy and triggers the hit logic if applicable.
     * @param {Object} enemy - The enemy object to check for a hit.
     * @param {Object} bottle - The bottle object that may collide with the enemy.
     */
    checkEnemyHit(enemy, bottle) {
        if (enemy === this.endBoss || enemy.isDead || !bottle.isColliding(enemy)) return;
        this.hitEnemy(enemy, bottle);
    }

    /**
     * Plays the bottle splash animation and eliminates the enemy if possible.
     * @param {Object} enemy - The enemy object to be affected.
     * @param {Object} bottle - The bottle object that hits the enemy.
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
     * Handles collisions with any enemy, separating logic based on enemy type.
     * @param {Object} enemy - The enemy object to check collision with.
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
     * Handles collisions between the character and the endboss.
     * @param {Object} endboss - The endboss object to check collision with.
     */
    handleEndbossCollision(endboss) {
        if (this.character.isColliding(endboss)) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
            this.endbossBar.setPercentage(endboss.energy);
        }
    }

    /**
     * Handles collisions between the character and a normal enemy.
     * @param {Object} enemy - The enemy object to check collision with.
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
     * Calls the kill method on the given enemy object.
     * @param {Object} enemy - The enemy object to be killed.
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
     * Ends the game and stops all sounds.
     * @param {string} status - The game status, either 'win' or 'gameOver'.
     */
    endGame(status) {
        if (!this.gameIsRunning) return;
        this.gameIsRunning = false;

        if (status === 'gameOver' && this.soundOn) {
        this.playGameOverSound();
        }
        this.stopAllMusic();
        this.stopEnemySounds();
        this.stopEndbossSounds();
        this.stopThrowableSounds();
        this.winOrGameOver(status);
    }

    /**
    * Plays sounds or shows overlays depending on whether the player has won or lost.
    * @param {string} status - The game status, either 'win' or 'gameOver'.
     */
    winOrGameOver(status) {
        if (status === 'gameOver') {
            this.playGameOverSound();
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
            ['throwSound', 'hitSound', 'crySound'].forEach(soundKey => {
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
        if (!soundOn) return;
        this.gameOverSound.currentTime = 0;
        this.gameOverSound.play();
    }

    /**
     * Stops all sounds for endboss.
     */
    stopEndbossSounds() {
        if (!this.level.endboss) return;
        const endboss = this.level.endboss;
        ['endbossHit', 'endbossDie'].forEach(soundKey => {
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
     * Loops through an array of movable objects and draws each one on the canvas.
     * @param {Object} objects - An array of movable objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach (o => {
            this.addToMap(o);
        });
    }

    /**
     * Draws a movable object on the canvas.
     * If the object is facing the opposite direction, flips it horizontally before drawing,
     * and then restores the canvas state afterwards.
     * @param {Object} mo - The movable object to draw.
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
     * Flips the canvas horizontally and adjusts the object's position accordingly.
     * @param {Object} mo - The movable object to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the original canvas state and reverts the object's position.
     * @param {Object} mo - The movable object whose position should be reverted.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
/**
 * Initializes all game audio.
 */
World.prototype.initAudio = function () {
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

    this.backgroundMusic.muted = !soundOn;
    this.bossMusic.muted = !soundOn;
};

/**
 * Plays the background music in a loop.
 */
World.prototype.playBackgroundMusic = function () {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.1;
    this.backgroundMusic.play();
};

/**
 * Initializing world for game. Main components of the world.
 */
World.prototype.setWorld = function () {
    this.setCharacterWorld();
    this.setCollectable();
    this.setEnemisWorld();
};

/**
 * Giving character reference to world.
 */
World.prototype.setCharacterWorld = function () {
    this.character.world = this;
};

/**
 *Giving reference to collectables item.
 */
World.prototype.setCollectable = function () {
    this.collectables = this.level.collectableObject;
};

/**
 * Giving reference to enemy objects.
 */
World.prototype.setEnemisWorld = function () {
    this.level.enemies.forEach(enemy => {
        enemy.world = this;
    });
};

/**
 * Checks if the character reached point 1900 = x to switch music.
 */
World.prototype.checkMusicSwitch = function () {
    if (this.character.x < 1900 || this.musicTriggerReached) return;

    this.musicTriggerReached = true;
        this.stopBackgroundMusic();
        this.playBossMusic();
};

/**
 * Checks if background music exist to stop.
 */
World.prototype.stopBackgroundMusic = function () {
    if (!this.backgroundMusic) return;

    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;

    if (this.bossMusic && !this.bossMusic.paused) {
        this.bossMusic.pause();
        this.bossMusic.currentTime = 0;
    }

    currentMusic = null;
};

/**
 * Checks if sound is enabled.
 */
World.prototype.playBossMusic = function () {
    if (!soundOn || !this.gameIsRunning || !this.bossMusic) return;

    this.bossMusic.currentTime = 0;
    this.bossMusic.play();
};

/**
 * Plays sounds or shows overlays depending on whether the player has won or lost.
 * @param {string} status - The game status, either 'win' or 'gameOver'.
 */
World.prototype.winOrGameOver = function (status) {
    if (status === 'gameOver') {
        this.playGameOverSound();
        this.showGameOverOverlay();
    } else if (status === 'win') {
        this.showWinOverlay();
    }
};

/**
 * Stops background and match sounds.
 */
World.prototype.stopAllMusic = function () {
    [this.backgroundMusic, this.bossMusic].forEach(music => {
        if (!music) return;
        music.pause();
        music.currentTime = 0;
    });
};

/**
 * Stops individual sounds for each enemy.
 */
World.prototype.stopEnemySounds = function () {
    this.level.enemies.forEach(enemy => {
        if (enemy.audioInterval) clearInterval(enemy.audioInterval);

        ['chickenSound', 'chickenDie'].forEach(soundKey => {
            if (!enemy[soundKey]) return;
            enemy[soundKey].pause();
            enemy[soundKey].currentTime = 0;
        });
    });
};

/**
 * Stops all sounds of throwable objects.
 */
World.prototype.stopThrowableSounds = function () {
    this.throwableObject.forEach(bottle => {
        ['throwSound', 'hitSound', 'crySound'].forEach(soundKey => {
            if (!bottle[soundKey]) return;
            bottle[soundKey].pause();
            bottle[soundKey].currentTime = 0;
        });
    });
};

/**
 * Ends the game and stops all sounds.
 * @param {string} status - The game status, either 'win' or 'gameOver'.
 */
World.prototype.endGame = function (status) {
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
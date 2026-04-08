/**
 * Initializes all game audio.
 */
World.prototype.initAudio = function () {
    this.backgroundMusic = new Audio('assets/sounds/gamemusic.mp3');
    this.gameOverSound = new Audio('assets/sounds/gameover.mp3');
    this.takeCoin = new Audio('assets/sounds/takecoin.mp3');
    this.takeBottle = new Audio('assets/sounds/bottlesound.mp3');
    this.bossMusic = new Audio('assets/sounds/matchsound.mp3');

    this.gameOverSound.volume = 0.5;
    this.takeCoin.volume = 0.1;
    this.takeBottle.volume = 0.1;

    if (soundOn) this.playBackgroundMusic();
};

/**
 * Plays the background music in a loop.
 */
World.prototype.playBackgroundMusic = function () {
    if (!soundOn || !this.backgroundMusic) return;

    if (this.backgroundMusic.paused) {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.1;
        this.backgroundMusic.play();
    }
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
    if (!soundOn) return; 
    if (this.character.x < 1900 || this.musicTriggerReached) return;

    this.musicTriggerReached = true;
    this.stopBackgroundMusic();
    this.playBossMusic();
};

/**
 * Checks if background music exist to stop.
 */
World.prototype.stopBackgroundMusic = function () {
    if (!soundOn || !this.bossMusic) return;

    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;

    if (this.bossMusic && !this.bossMusic.paused) {
        this.bossMusic.pause();
        this.bossMusic.currentTime = 0;
    }
};

/**
 * Checks if sound is enabled.
 */
World.prototype.playBossMusic = function () {
    if (!soundOn || !this.bossMusic) return;

    if (this.bossMusic.paused) {
        this.bossMusic.loop = true;
        this.bossMusic.volume = 0.5;
        this.bossMusic.play();
    }
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
 * Shows the game over scree.
 */
World.prototype.showGameOverOverlay = function () {
    document.getElementById('gameOverOverlay').style.display = 'block';
    document.getElementById('restartButton').style.display = 'inline-block';
    document.getElementById('mobileControls').classList.remove('show');
}


/** 
 * Calls endGame() with status "win".
 */
World.prototype.youWin = function () {
    this.endGame('win');
}

/**
 * Shows the win screen.
 */
World.prototype.showWinOverlay = function () {
    document.getElementById('youWinOverlay').style.display = 'block';
    document.getElementById('restartButton').style.display = 'inline-block';
    document.getElementById('mobileControls').classList.remove('show');
}

/**
 * Function for losing the game.
 */
World.prototype.gameOver = function () {
    this.endGame('gameOver');
}

/**
 * Creates game over sound.
 */
World.prototype.playGameOverSound = function () {
    if (!soundOn) return;
    this.gameOverSound.currentTime = 0;
    this.gameOverSound.play();
}

/**
 * Stops all sounds for endboss.
 */
World.prototype.stopEndbossSounds = function () {
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
     if (this.character) {
        this.character.stopSnoring();
    }
}
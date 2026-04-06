let ctx;
let world;
let background;
let keyboard = new Keyboard();
let startImage = new Image();
let soundOn = true;


/**
 * Creates the drawing content on canvas.
 */
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    startImage.src = 'assets/images/9_intro_outro_screens/start/startscreen_1.png';
    startImage.onload = () => drawStartScreen();

    let preloadSound = new Audio('assets/sounds/gamemusic.mp3');
    preloadSound.load();

    updateSoundFromLocalStorage()
}

/**
 * Updates Local Storage for sounds.
 */
function updateSoundFromLocalStorage() {
    const storedSound = localStorage.getItem('soundOn');
    if (storedSound !== null) {
        soundOn = storedSound === 'true';
    }

    updateSoundIcon();
    updateWorldSounds();
}

/**
 * Creates the main menu screen.
 */
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);

    const playButton = document.getElementById('playButton');
    playButton.style.display = 'block';
}


/**
 * Function for starting the game, switching from menu to gameplay.
 */
function startGame() {
    document.getElementById('playButton').style.display = 'none';
    document.getElementById('overlayImpressum').style.display = 'none';

    world = new World(canvas, keyboard);

    setupMobileControls(true);
}

/**
 * Function for game reset.
 */
function restartGame() {
    document.getElementById('gameOverOverlay').style.display = 'none';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    world = new World(canvas, keyboard);

    world.camera_x = 0;

    setupMobileControls(true);
}

/**
 * Shows mobile controls in landsacoe mode.
 * @param {*} show 
 */
function setupMobileControls(show) {
    const controls = document.getElementById('mobileControls');

    if (show && isMobileLandscape()) {
        controls.style.display = 'flex';
    } else {
        controls.style.display = 'none';
    }
}

/**
 * Checks if the screen width is 800px or less.
 */
function isMobileLandscape() {
    return window.innerWidth <= 800 && window.innerWidth > window.innerHeight;
}

/**
 * Shows mobile control buttons.
 * @param {boolean} show - If true, displays the mobile controls; if false, hides them.
 */
function setupMobileControls(show) {
    const controls = document.getElementById('mobileControls');
    controls.style.display = show ? 'block' : 'none';
}

/**
 * If not fullscreen, enters fullscreen. If already fullscreen, exits.
 */
function toggleFullscreen() {
    const container = document.getElementById('fullscreen');

    if (!document.fullscreenElement) {
        enterFullscreen(container);
    } else {
        exitFullscreen();
    }
}

/**
 * Makes the specified element enter fullscreen mode.
 * @param {HTMLElement} element - The HTML element to display in fullscreen mode.
 */
function enterFullscreen(element) {
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {   
        element.msRequestFullscreen();
    }
}

/**
 * Exits fullscreen mode.
 */
function exitFullscreen() { 
    if(document.exitFullscreen) {
        document.exitFullscreen();
    } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/**
 * Shows help or info screen.
 */
function gameInformation() {
    document.getElementById('infoOverlay').classList.remove('hidden');
}

/**
 * Hides the info screen.
 */
function closeInfo() {
    document.getElementById('infoOverlay').classList.add('hidden');
}

/**
 * Switches sound on and off, updates icon, world sounds, and snoring.
 */
function toggleSound() {
    soundOn = !soundOn;

    localStorage.setItem('soundOn', soundOn ? 'true' : 'false');

    updateSoundIcon();
    updateWorldSounds();
    updateSnoringSound();
}

/**
 * Switches the current images for sound on and off.
 */
function updateSoundIcon() {
    const icon = document.getElementById("soundIcon");
    if (!icon) return;

    icon.src = soundOn 
        ? "./assets/images/img/laut.png" 
        : "./assets/images/img/laut.stumm.png";
}

/**
 * Applies the sound setting to all active sounds.
 */
function updateWorldSounds() {
    if (!world) return;

    // Hintergrundmusik
    setAudioState(world.backgroundMusic, soundOn);
    setAudioState(world.bossMusic, soundOn);

    // Gegner-Sounds
    world.level.enemies.forEach(chicken => {
        setAudioState(chicken.chickenSound, soundOn);
        setAudioState(chicken.chickenDie, soundOn);
    });
}

function setAudioState(audio, enable) {
    if (!audio) return;

    if (enable) {
        if (audio.paused) audio.play();
    } else {
        audio.pause();
        audio.currentTime = 0; // Optional: zurück auf Anfang
    }
}

/**
 * Applies the sound for snoring.
 */
function updateSnoringSound() {
    if (!soundOn && world.character) {
        const character = world.character;

        if (character.isSnoring && character.snoringSound) {
            character.snoringSound.pause();
            character.snoringSound.currentTime = 0;
            character.isSnoring = false;
        }
    }
}

/**
 * Mutes or unmutes a single audio object.
 * @param {HTMLAudioElement} audio - The audio object to mute or unmute.
 */
function toggleAudio(audio) {
    if (!audio) return;
    audio.muted = !soundOn;
}

/**
 * Takes back to the main menu.
 */
function goToMenu() {
    stopWorld(world);                
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    document.getElementById('gameOverOverlay').style.display = 'none';
    document.getElementById('youWinOverlay').style.display = 'none';

    setupMobileControls(false);          

    world = null;
    init();                      
}

/**
 * Stops the game loop and all enemies in the world.
 * @param {Object} world - The game world object containing enemies and the game state.
 */
function stopWorld(world) {
    if (!world) return;

    stopEnemies(world.enemies);
    world.gameIsRunning = false;
}

/**
 *  Stops all enemies by calling their stopAll method if available.
 * @param {Array<Object>} enemies - An array of enemy objects to stop.
 */
function stopEnemies(enemies) {
    if (!enemies) return;

    enemies.forEach(enemy => {
        if (typeof enemy.stopAll === 'function') {
            enemy.stopAll();
        }
    });
}

/**
 * The Impressum appears on screen.
 */
function openImpressum() {
    document.getElementById('impressumOverlay').style.display = 'flex';
    document.body.classList.add('impressum-open');
}

/**
 * Targets the Impressum appears.
 */
function closeImpressum() {
    document.getElementById('impressumOverlay').style.display = 'none';
    document.body.classList.remove('impressum-open'); 
}

/**
 * Respond to real keyboard input.
 */
window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if (e.keyCode == 38) {
        keyboard.UP = true;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if (e.keyCode == 68) {
        keyboard.D = true;
    }
})

/**
 * Actions for stop when keys are released.
 */
window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if (e.keyCode == 38) {
        keyboard.UP = false;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if (e.keyCode == 68) {
        keyboard.D = false;
    }
})

/**
 * Gets references on screen buttons.
 */
function setupMobileControls() {
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnJump = document.getElementById('btnJump');
    const btnThrow = document.getElementById('btnThrow');

    btnLeft.ontouchstart = btnLeft.onmousedown = () => { keyboard.LEFT = true };
    btnLeft.ontouchend = btnLeft.onmouseup = btnLeft.onmouseleave = () => { keyboard.LEFT = false };

    btnRight.ontouchstart = btnRight.onmousedown = () => { keyboard.RIGHT = true };
    btnRight.ontouchend = btnRight.onmouseup = btnRight.onmouseleave = () => { keyboard.RIGHT = false };

    btnJump.ontouchstart = btnJump.onmousedown = () => { keyboard.SPACE = true };
    btnJump.ontouchend = btnJump.onmouseup = btnJump.onmouseleave = () => { keyboard.SPACE = false };

    btnThrow.ontouchstart = btnThrow.onmousedown = () => { keyboard.D = true };
    btnThrow.ontouchend = btnThrow.onmouseup = btnThrow.onmouseleave = () => { keyboard.D = false };
}
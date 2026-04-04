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

    startImage.src = 'assets/9_intro_outro_screens/start/startscreen_1.png';
    startImage.onload = () => drawStartScreen();
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
 * Shows mobile buttons.
 */
function setupMobileControls(show) {
    const controls = document.getElementById('mobileControls');
    controls.style.display = show ? 'block' : 'none';
}

/**
 * Passes to fullscreen function.
 */
function fullscreen() {
    let canvas = document.getElementById('canvas');
    enterFullscreen(canvas);
}

/**
 * Makes the game go fullscreen.
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
 * Switches sound on and off, update icon and game sounds.
 */
function toggleSound() {
    soundOn = !soundOn;
    updateSoundIcon();
    updateWorldSounds();
}

/**
 * Switches the current images for sound on and off.
 */
function updateSoundIcon() {
    const icon = document.getElementById("soundIcon");
    const filename = icon.src.split('/').pop();

    icon.src = (filename === "laut.png") 
        ? "./assets/img/laut.stumm.png" 
        : "./assets/img/laut.png";
}

/**
 * Applies the sound setting to all active sounds.
 */
function updateWorldSounds() {
    if (!world) return;

    toggleAudio(world.backgroundMusic);
    toggleAudio(world.bossMusic);

    world.level.enemies.forEach(chicken => {
        toggleAudio(chicken.chickenSound);
        toggleAudio(chicken.chickenDie);
    });
}

/**
 * Mutes or unmutes a single audio object.
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
 * Stops the game loop and enemies.
 */
function stopWorld(world) {
    if (!world) return;

    stopEnemies(world.enemies);
    world.gameIsRunning = false;
}

/**
 * Loop through all enemies and calls stopAll() if available.
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
}

/**
 * Targets the Impressum appears.
 */
function closeImpressum() {
    document.getElementById('impressumOverlay').style.display = 'none';
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
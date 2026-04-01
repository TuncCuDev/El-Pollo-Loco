let ctx;
let world;
let background;
let keyboard = new Keyboard();
let startImage = new Image();
let soundOn = true;


function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    startImage.src = '9_intro_outro_screens/start/startscreen_1.png';
    startImage.onload = () => drawStartScreen();
}

function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);

    const playButton = document.getElementById('playButton');
    playButton.style.display = 'block';
}

function startGame() {
    document.getElementById('playButton').style.display = 'none';
    document.getElementById('overlayImpressum').style.display = 'none';

    world = new World(canvas, keyboard);

    setupMobileControls();
}

function restartGame() {
    document.getElementById('gameOverOverlay').style.display = 'none';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    world = new World(canvas, keyboard);

    world.camera_x = 0;
}


function fullscreen() {
    let canvas = document.getElementById('canvas');
    enterFullscreen(canvas);
}

function enterFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {   
    element.msRequestFullscreen();
  }
}

function exitFullscreen() { console.log('exit');
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function gameInformation() {
    document.getElementById('infoOverlay').classList.remove('hidden');
}

function closeInfo() {
    document.getElementById('infoOverlay').classList.add('hidden');
}

function toggleSound() {
    soundOn = !soundOn;
    updateSoundIcon();
    updateWorldSounds();
}

function updateSoundIcon() {
    const icon = document.getElementById("soundIcon");
    const filename = icon.src.split('/').pop();

    icon.src = (filename === "laut.png") 
        ? "./img/laut.stumm.png" 
        : "./img/laut.png";
}

function updateWorldSounds() {
    if (!world) return;

    toggleAudio(world.backgroundMusic);
    toggleAudio(world.bossMusic);

    world.level.enemies.forEach(chicken => {
        toggleAudio(chicken.chickenSound);
        toggleAudio(chicken.chickenDie);
    });
}

function toggleAudio(audio) {
    if (!audio) return;
    audio.muted = !soundOn;
}

function goToMenu() {
    document.getElementById('gameOverOverlay').style.display = 'none';

    if (world) {
        world.gameIsRunning = false;
    }

    init();
}

function openImpressum() {
    document.getElementById('impressumOverlay').style.display = 'flex';
}

function closeImpressum() {
    document.getElementById('impressumOverlay').style.display = 'none';
}

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
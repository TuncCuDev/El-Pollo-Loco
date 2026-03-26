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
    world = new World(canvas, keyboard);
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
    var icon = document.getElementById("soundIcon");
    soundOn = !soundOn;

    var filename = icon.src.split('/').pop();

    if (filename === "laut.png") {
        icon.src = "./img/laut.stumm.png";
    } else {
        icon.src = "./img/laut.png";
    }

    if (world) {
        world.backgroundMusic.muted = !soundOn;

        world.level.enemies.forEach(chicken => {
            chicken.chickenSound.muted = !soundOn;
            chicken.chickenDie.muted = !soundOn;
        });
    }
}

function goToMenu() {
    document.getElementById('gameOverOverlay').style.display = 'none';

    if (world) {
        world.gameIsRunning = false;
    }

    window.location.href = "index.html"; 
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

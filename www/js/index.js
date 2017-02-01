"use strict";

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const scale = canvas.width/12;
const scaleh = canvas.height/20;

context.scale(scale,scaleh);

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

function collide(arena, player) {
  //const [m, o] = [player.matrix, player.pos];
  const m = player.matrix;
  const o = player.pos;
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if(m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0,0, canvas.width, canvas.height);
  drawMatrix(arena, {x: 0, y: 0});
  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value) {
        context.fillStyle = 'red';
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

const player = {
  pos: { x:5, y:5},
  matrix: matrix
};

function playerDrop() {
  player.pos.y++;
  if(collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    player.pos.y = 0;
  }
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if(collide(arena, player)) {
    player.pos.x -= dir;
  }
}

let dropCounter = 0;
let dropInterval = 500;
let lastTime = 0;

function update(time) {
  time =  time || 0;
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if(dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}

const arena = createMatrix(12, 20);

var hammertime = new Hammer(canvas, { recognizers: [
		// RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
		[Hammer.Tap],
		[Hammer.Swipe,{ direction: Hammer.DIRECTION_ALL }],
	]
});

//Gestos
hammertime.on('swipeleft', function(ev) {
  // player.pos.x--;
  playerMove(-1);
});
//
hammertime.on('swiperight', function(ev) {
  // player.pos.x++;
  playerMove(1);
});

hammertime.on('swipedown', function(ev) {
  playerDrop();
});

hammertime.on('tap', function(ev) {
	console.log('tap');
});



var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');
        //
        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('esto ya llegó: ' + id);
        update();
    }
};

app.initialize();

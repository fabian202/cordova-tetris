"use strict";

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

context.scale(20,20);

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

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

const player = {
  pos: { x:5, y:5},
  matrix: matrix
};

function playerDrop() {
  player.pos.y++;
  dropCounter = 0;
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
console.log(arena);
console.table(arena);

var hammertime = new Hammer(canvas, { recognizers: [
		// RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
		[Hammer.Tap],
		[Hammer.Swipe,{ direction: Hammer.DIRECTION_ALL }],
	]
});

//Gestos
hammertime.on('swipeleft', function(ev) {
	console.log('swip left');
  player.pos.x--;
});
//
hammertime.on('swiperight', function(ev) {
	console.log('swip right');
  player.pos.x++;
});

hammertime.on('swipedown', function(ev) {
	console.log('swip down');
  player.pos.y++;
  dropCounter = 0;
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

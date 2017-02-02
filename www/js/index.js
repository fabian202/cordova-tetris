"use strict";

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const scale = canvas.width/12;
const scaleh = canvas.height/20;

context.scale(scale,scaleh);

//const matrix = [];

function arenaSweep() {
  outer: for (var y = arena.length - 1; y > 0; --y) {
    for (var x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }

    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;
  }
}

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

//const pieces = 'ILJOTSZ';
const colors = [
  null,
  '#AA00FF',
  '#FFFF00',
  '#FFA500',
  '#0000FF',
  '#00FFFF',
  '#00FF00',
  '#FF0000'
];

function createPiece(type) {
  if(type === 'T') {
    return [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];
  } else if (type === 'O') {
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type === 'L') {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type === 'J') {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (type === 'I') {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type === 'S') {
    return [
      [0, 0, 0],
      [0, 6, 6],
      [6, 6, 0],
    ];
  } else if (type === 'Z') {
    return [
      [0, 0, 0],
      [7, 7, 0],
      [0, 7, 7],
    ];
  }
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
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);

        context.fillStyle = 'rgba(225,225,225,0.2)';
        context.fillRect(x + offset.x, y + offset.y, 0.9, 0.9);
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
  pos: { x:5, y:0},
  matrix: getPiece()
};

function playerDrop() {
  player.pos.y++;
  if(collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    player.pos.y = 0;
    player.pos.x = 5;
    playerReset();
    arenaSweep();
  }
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if(collide(arena, player)) {
    player.pos.x -= dir;
  }
}

function getPiece() {
  const pieces = 'ILJOTSZ';
  const piece = pieces[pieces.length * Math.random() | 0];
  return createPiece(piece);
}

function playerReset() {
  player.matrix = getPiece();
  if(collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    //alert('perdiste');
  }
}

function playerRotate(dir) {
  let offset = 1;
  let pos = player.pos.x;
  rotate(player.matrix, 1);

  if(collide(arena, player)) {
    rotate(player.matrix, -dir);
  }
  // while (collide(arena, player)) {
  //   player.pos.x += offset;
  //   offset = -(offset + (offset > 0 ? 1 : -1));
  //   if(offset > player.matrix[0].length) {
  //     rotate(player.matrix, -dir);
  //     player.pos.x = pos;
  //     return;
  //   }
  // }
}

function rotate(matrix, dir) {

  for (var y = 0; y < matrix.length; y++) {
    for (var x = 0; x < y; x++) {
      [
        matrix[x][y],
        matrix[y][x]
      ] = [
        matrix[y][x],
        matrix[x][y]
      ];
    }
  }

  if(dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }


}

let dropCounter = 0;
let dropInterval = 200;
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
  playerRotate(1);
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

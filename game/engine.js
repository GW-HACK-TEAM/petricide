Meteor._debug = (function (super_meteor_debug) {
  return function (error, info) {
    if (!(info && _.has(info, 'msg')))
      super_meteor_debug(error, info);
  };
})(Meteor._debug);

viewPort = new ViewPort();

nodes = [];

var gridWidth = 100;
var gridHeight = 100;
var size = 1;
var cellLifecycle = 50;

/*
var canvas = new Canvas(gridWidth, gridHeight);
var ctx = canvas.getContext("2d");

// Disable antialiasing
ctx.antialias = 'none';
canvas.width = gridWidth;
canvas.height = gridHeight;
*/

var i;
var j;
var rand1;
var rand2;


var playerColor = '#fa504d';

function increaseBrightness(hex, percent){
  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, '');

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if(hex.length == 3){
    hex = hex.replace(/(.)/g, '$1$1');
  }

  var r = parseInt(hex.substr(0, 2), 16);
  var g = parseInt(hex.substr(2, 2), 16);
  var b = parseInt(hex.substr(4, 2), 16);

  return '#' +
     ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
     ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
     ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}

var colors = [
  '#49daf4',
  '#a864a8',
  '#f7941d',
  '#00a99d',
  '#fa504d'
];

GameColorRanges = {};

// Precalculate colors to indicate cell health.
colors.forEach(function(color) {
  GameColorRanges[color] = [];
  for(var i = 100; i >= 0; i--) {
    GameColorRanges[color].push(increaseBrightness(color, i));
  }
});

for (i = 0; i < gridWidth / size; i++) {
  nodes.push([]);
  for (j = 0; j < gridHeight / size; j++) {
    nodes[i].push(new GameCell(i, j, size, cellLifecycle, nodes));
  }
}


var cycle = (function cycleClosure() {
  var _updated;
  var _total;
  var _cb;
  var _i;
  var _j;

  function _cycleUpdateCallback(renderArray) {
    _updated++;
    if ( Meteor.isClient ) {
      viewPort.fill.apply(viewPort, renderArray);
    }
    if ( _updated === _total ) {
      if ( _cb ) {
        _cb();
      }
    }
  }

  function _cycle(cb) {
    if ( cb ) {
      _cb = cb;
    } else {
      _cb = false;
    }
    _updated = 0;
    _total = (gridWidth / size) * (gridHeight / size);

    if ( Meteor.isClient ) {
      viewPort.fill('white', 0, 0, gridWidth, gridHeight);
    }
    for (_i = 0; _i < 100; _i++) {
      for (_j = 0; _j < 100; _j++) {
        nodes[_i][_j].update(_cycleUpdateCallback);
      }
    }
  }

  return _cycle;
}());

// Activate starting points.

nodes[44][74].activate('#49daf4');
nodes[44][76].activate('#49daf4');
nodes[45][75].activate('#49daf4');
nodes[46][74].activate('#49daf4');
nodes[46][76].activate('#49daf4');

nodes[34][44].activate('#a864a8');
nodes[34][46].activate('#a864a8');
nodes[35][45].activate('#a864a8');
nodes[36][44].activate('#a864a8');
nodes[36][46].activate('#a864a8');

nodes[19][19].activate('#f7941d');
nodes[19][21].activate('#f7941d');
nodes[20][20].activate('#f7941d');
nodes[21][19].activate('#f7941d');
nodes[21][21].activate('#f7941d');

nodes[17][39].activate('#00a99d');
nodes[17][41].activate('#00a99d');
nodes[18][40].activate('#00a99d');
nodes[19][39].activate('#00a99d');
nodes[19][41].activate('#00a99d');

nodes[79][59].activate('#fa504d');
nodes[79][61].activate('#fa504d');
nodes[80][60].activate('#fa504d');
nodes[81][59].activate('#fa504d');
nodes[81][61].activate('#fa504d');

var getWorld = function(cb) {
  var i = 0;
  var j = 0;
  var colors = [];
  function loop() {
    colors.push({
      color: nodes[i][j].color,
      active: nodes[i][j].active,
      health: nodes[i][j].health,
      age: nodes[i][j].age
    });
    j++;
    if ( j === nodes[i].length ) {
      i++;
      j = 0;
    }
    if ( i === nodes.length ) {
      cb(colors);
    } else {
      loop();
    }
  }

  loop();
};

// Set timeout to make sure all our game structures are set up before launching
var cycleCount = 0;
Meteor.setTimeout( function gameEngineInit() {
  Meteor.setInterval(function() {
    cycle(function() {
      cycleCount++;
      if ( Meteor.isServer && cycleCount > 30 ) {
        cycleCount = 0;
        getWorld(function(colors) {
          Meteor.call('updateWorld', colors);
        });
      }
    });
  }, 1000/30);
}, 1000);

Streamy.on('playerAction', function(payload) {
  nodes[payload.clicks[0]][payload.clicks[1]].clickEffect(payload.user.color, function() {});
});


/*
Meteor.setInterval(function aiCycle() {
  var color = colors[Math.floor(Math.random() * colors.length)];
  rand1 = Math.floor(Math.random() * gridWidth / size);
  rand2 = Math.floor(Math.random() * gridHeight / size);
  nodes[rand1][rand2].clickEffect(color);
}, 50);
*/

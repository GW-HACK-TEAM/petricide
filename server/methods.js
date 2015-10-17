Meteor.methods({

  addEvent:function(payload){
    if(payload){
      nodes[payload.clicks[0]][payload.clicks[1]].clickEffect(payload.user.color, function() {
        Meteor.call('addSnapshot', snappleShot());
      });
    } else {
      console.error('no data');
    }
  },
  newUser: function(){
    var slots = PlayerSlots.find({}).fetch();
    if(slots.length > 0){
      var select = _.first(slots);
      var response = {
        id: Random.id(),
        color: select.color,
        validPlayer: true
      };
      PlayerSlots.remove({_id:select._id});
      return response;
    } else {
      return false;
    }
  },
  readyCheck:function(){
    var slots = PlayerSlots.find({}).fetch();
    console.log(slots);
    if(slots.length < 4){
      return true;
    } else {
      return false;
    }
  },
  reset:function(){
    console.log('resetting');
    GameData.remove({});
    PlayerSlots.remove({});

    var colors = [
      '#49daf4',
      '#a864a8',
      '#f7941d',
      '#00a99d',
      '#fa504d'
    ];
    var i = 0;
    _.each(colors, function (elem) {
      PlayerSlots.insert({
        id: i++,
        color: elem
      });
    });
  },
  addSnapshot: function(snap) {
    check(snap, String);

    SnapShots.remove({});
    SnapShots.insert({
      shot: snap ,
      stamp: Date.now()
    });
  }
});

var Canvas = Meteor.npmRequire('canvas');

nodes = [];

var gridWidth = 100;
var gridHeight = 100;
var size = 1;
var cellLifecycle = 50;

var canvas = new Canvas(gridWidth, gridHeight);
var ctx = canvas.getContext("2d");

// Disable antialiasing
ctx.antialias = 'none';


var i;
var j;
var rand1;
var rand2;

canvas.width = gridWidth;
canvas.height = gridHeight;

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
    nodes[i].push(new GameCell(i, j, ctx, size, cellLifecycle, nodes));
  }
}

function cycle(cb) {
  var updated = 0;
  var total = (gridWidth / size) * (gridHeight / size);
  var updateCallback = function() {
    updated++;
    if ( updated === total ) {
      cb();
    }
  };
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (i = 0; i < nodes.length; i++) {
    for (j = 0; j < nodes[i].length; j++) {
      nodes[i][j].update(updateCallback);
    }
  }
}

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

var snappleShot = function(cb) {
  return canvas.toDataURL();
};

// Set timeout to make sure all our game structures are set up before launching
Meteor.setTimeout( function gameEngineInit() {
  Meteor.setInterval(function() {
    cycle(function() {
      Meteor.call('addSnapshot', snappleShot());
    });
  }, 1000/15);
}, 1000);


Meteor.setInterval(function aiCycle() {
  var color = colors[Math.floor(Math.random() * colors.length)];
  rand1 = Math.floor(Math.random() * gridWidth / size);
  rand2 = Math.floor(Math.random() * gridHeight / size);
  nodes[rand1][rand2].clickEffect(color);
}, 50);

var restartFrequency = 1000 * 60 * 5;
setTimeout(function(){
  process.exit();
}, restartFrequency);

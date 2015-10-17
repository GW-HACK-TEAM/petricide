Meteor.methods({

  addEvent:function(payload){
    if(payload){
      nodes[payload.clicks[0]][payload.clicks[1]].clickEffect(payload.user.color);
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

var nodes = [];

var gridWidth = 100;
var gridHeight = 100;
var size = 1;
var cellLifecycle = 120;

var canvas = new Canvas(gridWidth, gridHeight);
var ctx = canvas.getContext("2d");


var i;
var j;

canvas.width = gridWidth;
canvas.height = gridHeight;

var playerColor = '#fa504d';




for (i = 0; i < gridWidth / size; i++) {
  nodes.push([]);
  for (j = 0; j < gridHeight / size; j++) {
    nodes[i].push(new GameCell(i, j, ctx, size, cellLifecycle, nodes));
  }
}

function cycle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (i = 0; i < nodes.length; i++) {
    for (j = 0; j < nodes[i].length; j++) {
      nodes[i][j].update();
    }
  }
}

var mousex;
var mousey;

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

function getPosition(event) {
  var x = event.x;
  var y = event.y;

  var windowWidth = $(window).width();
  var heightWidth = $(window).height();

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  // Find out the scaled X and Y coordinates
  var scaledX = x * (gridWidth / $('#canvas').width());
  var scaledY = y * (gridHeight / $('#canvas').height());

  var contextX = Math.floor(scaledX / size);
  var contextY = Math.floor(scaledY / size);

  nodes[contextX][contextY].clickEffect(playerColor);
}

var colors = [
  '#49daf4',
  '#a864a8',
  '#f7941d',
  '#00a99d',
  '#fa504d'
];

// Activate starting points.

nodes[44][24].activate('#49daf4');
nodes[44][26].activate('#49daf4');
nodes[45][25].activate('#49daf4');
nodes[46][24].activate('#49daf4');
nodes[46][26].activate('#49daf4');

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

nodes[39][39].activate('#fa504d');
nodes[39][41].activate('#fa504d');
nodes[40][40].activate('#fa504d');
nodes[41][39].activate('#fa504d');
nodes[41][41].activate('#fa504d');

var snappleShot = function() {
  return canvas.toDataURL();
};
var snapShot = function canvasToImage(backgroundColor) {
  //cache height and width
  var w = canvas.width;
  var h = canvas.height;
  var compositeOperation;

  var data;

  if(backgroundColor) {
    //get the current ImageData for the canvas.
    data = ctx.getImageData(0, 0, w, h);

    //store the current globalCompositeOperation
    compositeOperation = ctx.globalCompositeOperation;

    //set to draw behind current content
    ctx.globalCompositeOperation = "destination-over";

    //set background color
    ctx.fillStyle = backgroundColor;

    //draw background / rect on entire canvas
    ctx.fillRect(0,0,w,h);
  }

  //get the image data from the canvas
  var imageData = canvas.toDataURL();

  if(backgroundColor) {
    //clear the canvas
    ctx.clearRect (0,0,w,h);

    //restore it with original / cached ImageData
    ctx.putImageData(data, 0,0);

    //reset the globalCompositeOperation to what it was
    ctx.globalCompositeOperation = compositeOperation;
  }

  //return the Base64 encoded data url string
  return imageData;
};

Meteor.setInterval(function() {
  cycle();
 // console.log(snapShot());
  Meteor.call('addSnapshot', snapShot('white'));
}, 1000/30);

var restartFrequency = 1000 * 60 * 5;
setTimeout(function(){
  process.exit();
}, restartFrequency);

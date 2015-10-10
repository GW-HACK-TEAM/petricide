Meteor.methods({

  addEvent:function(payload){
    console.log(payload);
    if(payload){
      GameData.insert({user:payload.user,clicks:payload.clicks});
    } else {
      console.error('no data');
    }
  },
  newUser: function(){
    var slots = PlayerSlots.find({}).fetch();
    console.log(slots);
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
      //Router.go('nope');
    }
  }
});

var Canvas = Meteor.npmRequire('canvas');

var nodes = [];

var gridWidth = 1000;
var gridHeight = 1000;
var size = 10;
var cellLifecycle = 120;

var canvas = new Canvas(1000, 1000);
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

var rand1;
var rand2;
var colors = [
  '#49daf4',
  '#a864a8',
  '#f7941d',
  '#00a99d',
  '#fa504d'
];

//setInterval(function aiCycle() {
//  var color = colors[Math.round(Math.random() * colors.length - 1)]
//  if (running) {
//    rand1 = Math.round(Math.random() * gridWidth / size);
//    rand2 = Math.round(Math.random() * gridHeight / size);
//    nodes[rand1][rand2].clickEffect(color);
//  }
//}, 50);


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

var snapShot = function() {
  return canvas.toDataURL();
};

setInterval(function() {
  cycle();
 // console.log(snapShot());
}, 1000);

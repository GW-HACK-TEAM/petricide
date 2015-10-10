Template.app.helpers({
});

Template.app.events({
});

Template.app.onRendered(function(){
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var nodes = [];

var gridWidth = 1000;
var gridHeight = 1000;
var size = 10;

var i;
var j;

var running = true;


canvas.width = gridWidth;
canvas.height = gridHeight;

var playerColor = 'red';

function mode(array) {
  if(array.length === 0)
    return null;
  var modeMap = {};
  var maxEl = array[0], maxCount = 1;
  for(var i = 0; i < array.length; i++)
  {
    var el = array[i];
    if(modeMap[el] === null)
      modeMap[el] = 1;
    else
      modeMap[el]++;
    if(modeMap[el] > maxCount)
      {
        maxEl = el;
        maxCount = modeMap[el];
      }
  }
  return maxEl;
}


function createNode(i, j) {
  var node = {};
  var activeNeighBours = [];
  var rand;
  var activeColor;
  node.lon = i;
  node.lat = j;
  node.health = 0;
  node.color = 'black';
  node.active = false;
  node.opacity = 1;
  node.age = 0;
  node.draw = function(color) {
    ctx.globalAlpha = node.opacity;
    ctx.fillStyle = color;
    ctx.fillRect(node.lon*size, node.lat*size, size, size);
  };
  node.activate = function(color) {
    node.color = color;
    node.active = true;
    node.changeHealth(15);
    node.draw(color);
  };
  node.changeHealth = function(val) {
    node.health = node.health + val;
    if ( node.health > 100 ) {
      node.health = 100;
    }
    if ( node.health < 0 ) {
      node.health = 0;
    }

    node.opacity = node.health/100;
    node.draw(node.color);

    if ( node.health === 0 ) {
      node.kill();
    }
  };
  node.kill = function(explode) {
    node.age = 0;
    node.active = false;
    node.inactiveCount = 5;
    if ( explode ) {
      node.neighbours().forEach(function(item) {
        if ( item.active && item.color !== node.color ) {
          item.changeHealth(-50);
        }
      });
    }
  };
  node.inactiveCount = 0;
  node.update = function() {
    if ( node.active ) {
      node.age++;

      if ( node.age < 500 ) {
        node.changeHealth(1.5);
      } else if ( node.age > 600 ) {
        node.changeHealth(-0.2);
      }
    }

    if ( node.inactiveCount > 0 ) {
      node.inactiveCount--;
      return;
    }
    activeNeighBours = _.filter(node.neighbours(), function(item) {
      return item.active && item.health >= 75;
    });

    if ( !node.active && activeNeighBours.length === 0 ) {
      return;
    }



    if ( !node.active && activeNeighBours.length >= 3 ) {
      activeColor = mode(_(activeNeighBours).pluck('color'));
      node.activate(activeColor);
    }
  };
  node.cachedNeighbours = [];
  node.neighbours = function() {
    if ( node.cachedNeighbours.length ) {
      return node.cachedNeighbours;
    }
    var arr = [];
    if ( nodes[i - 1] ) {
      if ( nodes[i - 1][j - 1] ) {
        arr.push(nodes[i - 1][j - 1]);
      }
      if ( nodes[i - 1][j] ) {
        arr.push(nodes[i - 1][j]);
      }
      if ( nodes[i - 1][j + 1] ) {
        arr.push(nodes[i - 1][j + 1]);
      }
    }
    if ( nodes[i][j - 1] ) {
      arr.push(nodes[i][j - 1]);
    }
    if ( nodes[i][j + 1] ) {
      arr.push(nodes[i][j + 1]);
    }
    if ( nodes[i + 1] ) {
      if ( nodes[i + 1][j - 1] ) {
        arr.push(nodes[i + 1][j - 1]);
      }
      if ( nodes[i + 1][j] ) {
        arr.push(nodes[i + 1][j]);
      }
      if ( nodes[i + 1][j + 1] ) {
        arr.push(nodes[i + 1][j + 1]);
      }
    }

    return arr;
  };

  node.clickEffect = function(myColor) {
    var  val = 60;
    if ( node.active && node.color !== myColor ) {
      node.changeHealth(0 - val);
    } else if ( !node.active ) {
      node.activate(myColor);
      node.playerActivated = true;

    }
    node.neighbours().forEach(function(item) {
      if ( item.active && item.color !== myColor ) {
        item.changeHealth(0 - val);
      }
    });
  };

  /*
  node.click(function() {
    node.clickEffect(playerColor);
  });
  */

  return node;
}


for(i = 0; i < gridWidth/size; i++) {
  nodes.push([]);
  for(j = 0; j < gridHeight/size; j++) {
    nodes[i].push(createNode(i, j));
  }
}

nodes[24][24].activate('blue');
nodes[24][26].activate('blue');
nodes[25][25].activate('blue');
nodes[26][24].activate('blue');
nodes[26][26].activate('blue');

nodes[34][44].activate('red');
nodes[34][46].activate('red');
nodes[35][45].activate('red');
nodes[36][44].activate('red');
nodes[36][46].activate('red');

nodes[19][19].activate('green');
nodes[19][21].activate('green');
nodes[20][20].activate('green');
nodes[21][19].activate('green');
nodes[21][21].activate('green');


function cycle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(i = 0; i < nodes.length; i++) {
    for(j = 0; j < nodes[i].length; j++) {
      nodes[i][j].update();
    }
  }
}

var mousex;
var mousey;

canvas.addEventListener('mousedown', getPosition, false);
canvas.addEventListener('mousemove', setMouse, false);

document.addEventListener('keydown', function(e) {
  if ( e.keyCode === 32 ) {
    getPosition({
      x: mousex,
      y: mousey
    });
  }
}, false);

function setMouse(e) {
  mousex = e.pageX;
  mousey = e.pageY;
}

function getPosition(event) {
  var x = event.x;
  var y = event.y;

  var canvas = document.getElementById("canvas");

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  var contextX = Math.floor(x/size);
  var contextY = Math.floor(y/size);

  nodes[contextX][contextY].clickEffect(playerColor);
}


setInterval(function() {
  if ( running ) {
    cycle();
  }
}, 1000/60);
});

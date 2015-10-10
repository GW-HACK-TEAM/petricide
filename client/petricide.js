var payload = [];
var payloadDep = new Tracker.Dependency;

var getPayload = function () {
  payloadDep.depend();
  return payload;
};
var addToPayload = function (arr) {
  payload.push(arr);
  payloadDep.changed();
};

var user = false;
var userDep = new Tracker.Dependency;

var getUser = function () {
  userDep.depend();
  return user;
};
var setUser = function (dets) {
  user = dets;
  userDep.changed();
};

Template.app.helpers({
  getGameData: function () {
    return _.first(ReactiveMethod.call('testMethod', getPayload()));
  },
  user: function () {
    var response;
    if (!getUser()) {
      response = ReactiveMethod.call('newUser');
      if (response && response.validPlayer) {
        setUser(response);
      }
    } else {
      return getUser();
    }
  },
  getUserDets:function(){
    return getUser();
  }
});

Template.app.events({
  'click #canvas': function (e) {

    var click = [33, 44];
    addToPayload(click);
    console.log(getPayload());
  }
});
Template.app.onRendered(function () {

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  var nodes = [];

  var gridWidth = 1000;
  var gridHeight = 1000;
  var size = 10;

  var cellLifecycle = 100;

  var i;
  var j;

  window.running = true;

  canvas.width = gridWidth;
  canvas.height = gridHeight;

  var playerColor = 'red';

  function mode(array) {
    if(array.length === 0)
      return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for (var i = 0; i < array.length; i++) {
      var el = array[i];
      if (modeMap[el] === null)
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
    var counts;
    node.lon = i;
    node.lat = j;
    node.health = 0;
    node.color = 'white';
    node.active = false;
    node.opacity = 1;
    node.age = 0;
    node.draw = function(color) {
      ctx.globalAlpha = node.opacity;
      ctx.fillStyle = color;
      ctx.fillRect(node.lon * size, node.lat * size, size, size);
    };
    node.activate = function (color) {
      node.color = color;
      node.active = true;
      node.changeHealth(15);
      node.draw(color);
    };
    node.changeHealth = function (val) {
      node.health = node.health + val;
      if (node.health > 100) {
        node.health = 100;
      }
      if (node.health < 0) {
        node.health = 0;
      }

      node.opacity = node.health / 100;
      node.draw(node.color);

      if (node.health === 0) {
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

        if ( node.age < cellLifecycle * 0.6 ) {
          node.changeHealth(1);
        } else if ( node.health > 20 ) {
          node.changeHealth(-1.4);
        }
        if ( node.age > cellLifecycle ) {
          node.age = 0;
        }
      }
      node.draw(node.color);

      if ( node.inactiveCount > 0 ) {
        node.inactiveCount--;
        return;
      }
      activeNeighBours = _.filter(node.neighbours(), function(item) {
        return item.active && item.health >= 25;
      });

      if (!node.active && activeNeighBours.length === 0) {
        return;
      }

      if ( !node.active && activeNeighBours.length >= 3 ) {
        counts = _.countBy(activeNeighBours, function(item) {
          return item.color;
        });
        if ( _(counts).values().sort().pop() >= 3 ) {
          activeColor = mode(_(activeNeighBours).pluck('color'));
          node.activate(activeColor);
        }
      }
      if ( node.active && activeNeighBours.length >= 7 ) {
        var count = 0;
        activeNeighBours.forEach(function(cell) {
          if ( cell.color !== node.color ) {
            count++;
          }
        });
        if ( count >= 7 ) {
          node.kill();
        }
      }
    };

    node.cachedNeighbours = [];
    node.neighbours = function () {
      if (node.cachedNeighbours.length) {
        return node.cachedNeighbours;
      }
      var arr = [];
      if (nodes[i - 1]) {
        if (nodes[i - 1][j - 1]) {
          arr.push(nodes[i - 1][j - 1]);
        }
        if (nodes[i - 1][j]) {
          arr.push(nodes[i - 1][j]);
        }
        if (nodes[i - 1][j + 1]) {
          arr.push(nodes[i - 1][j + 1]);
        }
      }
      if (nodes[i][j - 1]) {
        arr.push(nodes[i][j - 1]);
      }
      if (nodes[i][j + 1]) {
        arr.push(nodes[i][j + 1]);
      }
      if (nodes[i + 1]) {
        if (nodes[i + 1][j - 1]) {
          arr.push(nodes[i + 1][j - 1]);
        }
        if (nodes[i + 1][j]) {
          arr.push(nodes[i + 1][j]);
        }
        if (nodes[i + 1][j + 1]) {
          arr.push(nodes[i + 1][j + 1]);
        }
      }

      return arr;
    };

    node.clickEffect = function(myColor) {
      var  val = 60;
      if ( node.active && node.color !== myColor ) {
        val = 0 - val;
        node.changeHealth(val);
      } else if ( !node.active ) {
        node.activate(myColor);
        node.playerActivated = true;
      } else if (node.active && node.color === myColor) {
        node.changeHealth(60);
        node.age = 0;
        node.neighbours().forEach(function(item) {
          if ( item.active && item.color === myColor ) {
            item.changeHealth(val * 0.6);
            item.age = 0;
          }
        });
      }
      node.neighbours().forEach(function(item) {
        if ( item.active && item.color !== myColor ) {
          item.changeHealth(val);
        }
      });
    };

    return node;
  }


  for (i = 0; i < gridWidth / size; i++) {
    nodes.push([]);
    for (j = 0; j < gridHeight / size; j++) {
      nodes[i].push(createNode(i, j));
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

  canvas.addEventListener('click', getPosition, false);
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

    var windowWidth = $(window).width();
    var heightWidth = $(window).height();

    // Find out the scaled X and Y coordinates
    var scaledX = x * (gridWidth / windowWidth);
    var scaledY = y * (gridHeight / heightWidth);

    var contextX = Math.floor(scaledX / size);
    var contextY = Math.floor(scaledY / size);

    nodes[contextX][contextY].clickEffect(playerColor);
  }

  var rand1;
  var rand2;
  setInterval(function aiCycle() {
    if (running) {
      rand1 = Math.round(Math.random() * gridWidth / size);
      rand2 = Math.round(Math.random() * gridHeight / size);
      nodes[rand1][rand2].clickEffect('blue');

      rand1 = Math.round(Math.random() * gridWidth / size);
      rand2 = Math.round(Math.random() * gridHeight / size);
      nodes[rand1][rand2].clickEffect('green');
    }
  }, 1000);

  setInterval(function() {
    if ( window.running ) {
      cycle();
    }
  }, 1000/60);

  // Activate starting points.

  nodes[44][24].activate('blue');
  nodes[44][26].activate('blue');
  nodes[45][25].activate('blue');
  nodes[46][24].activate('blue');
  nodes[46][26].activate('blue');

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
});



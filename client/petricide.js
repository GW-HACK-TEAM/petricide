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

  nodes = [];

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
    var canvas = document.getElementById("canvas");

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

  /*
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
  */

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



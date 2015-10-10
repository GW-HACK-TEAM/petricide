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

  // Scale the canvas to make it fit inside the browser
  scaleCanvas($(window).width(), $(window).height());


  $(window).resize(function() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();

    // Scale the canvas to make it fit inside the browser
    scaleCanvas(windowWidth, windowHeight);
  });


  /**
   * Scale the canvas to make it fit inside the browser
   *
   * @param {number} windowWidth
   * @param {number} windowHeight
   */
  function scaleCanvas(windowWidth, windowHeight) {

    // Logic determined by the biggest width or height
    if (windowWidth > windowHeight) {
      $('#canvas').width(windowHeight);
      $('#canvas').height(windowHeight);
    } else {
      $('#canvas').width(windowWidth);
      $('#canvas').height(windowWidth);
    }
  }

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  nodes = [];

  var gridWidth = 1000;
  var gridHeight = 1000;
  var size = 10;

  var cellLifecycle = 120;

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
  var colors = ['green', 'red', 'blue', 'purple', 'pink', 'orange'];
  setInterval(function aiCycle() {
    var color = colors[Math.round(Math.random() * colors.length - 1)]
    if (running) {
      rand1 = Math.round(Math.random() * gridWidth / size);
      rand2 = Math.round(Math.random() * gridHeight / size);
      nodes[rand1][rand2].clickEffect(color);
    }
  }, 50);

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

  nodes[17][39].activate('purple');
  nodes[17][41].activate('purple');
  nodes[18][40].activate('purple');
  nodes[19][39].activate('purple');
  nodes[19][41].activate('purple');

  nodes[39][39].activate('pink');
  nodes[39][41].activate('pink');
  nodes[40][40].activate('pink');
  nodes[41][39].activate('pink');
  nodes[41][41].activate('pink');

  nodes[39][0].activate('orange');
  nodes[39][2].activate('orange');
  nodes[40][2].activate('orange');
  nodes[41][0].activate('orange');
  nodes[41][1].activate('orange');
});



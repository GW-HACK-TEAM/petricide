var user = false;
var userDep = new Tracker.Dependency;
nodes = [];

var getUser = function () {
  userDep.depend();
  return user;
};
var setUser = function (dets) {
  user = dets;
  userDep.changed();
  return true;
};


var gridWidth = 1000;
var gridHeight = 1000;
var size = 10;

var cellLifecycle = 120;

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

/**
 * Helpers
 */
Template.app.helpers({
  getUserDets:function(){
    return getUser();
  },
  reRender:function() {
    var updates = GameData.find({userid: {$ne: getUser().id}}).fetch();
    if (updates.length > 0) {
      _.each(updates, function (elem) {
        nodes[elem.clicks[0]][elem.clicks[1]].clickEffect(elem.user.color);
      });
    }
  }
});

Template.body.helpers({
  user: function () {
    var response;
    if (!getUser()) {
      response = ReactiveMethod.call('newUser');
      console.log('twat');
      if (response && response.validPlayer) {
        return setUser(response);
      } else {
        return false;
      }
    } else {
      return getUser();
    }
  },
  allready:function(){
    return true;
    var check = ReactiveMethod.call('readyCheck');
    if(check){
      return true;
    }
  }
});

/**
 * Events
 */
Template.app.events({
  'click #canvas': function (e) {
    var canvas = document.getElementById("canvas");
    var x = e.originalEvent.x - canvas.offsetLeft;
    var y = e.originalEvent.y - canvas.offsetTop;

    // Find out the scaled X and Y coordinates
    var scaledX = x * (gridWidth / $('#canvas').width());
    var scaledY = y * (gridHeight / $('#canvas').height());

    var contextX = Math.floor(scaledX / size);
    var contextY = Math.floor(scaledY / size);

    var click = [contextX, contextY];
    var event = {clicks: click, user:getUser(), timestamp:Date.now()};
    Meteor.call('addEvent', event);
  },
  'click #reset':function(){
    Meteor.call('reset');
  }
});


/**
 * On render
 */
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
    var size = 0;
    var headerHeight = $('.header').outerHeight();

    // Logic determined by the biggest width or height
    if (windowWidth >= windowHeight - headerHeight) {
      size = windowHeight - headerHeight;
    } else {
      size = windowWidth;
    }

    // Update the canvas size
    $('#canvas').width(size);
    $('#canvas').height(size);

    // Update the confines wrappers width
    $('.confines-wrapper').width(size);
  }

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");


  var i;
  var j;

  window.running = true;

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

  setInterval(function() {
    if ( window.running ) {
      cycle();
    }
  }, 1000/60);

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

});



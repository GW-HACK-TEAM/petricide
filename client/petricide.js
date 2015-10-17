var gridWidth = 100;
var gridHeight = 100;
var size = 1;

nodes = [];


/**
 * Helpers
 */
Template.canvas.helpers({
  getUserDets:function(){
    return Session.get('user');
  }
});

Template.app.helpers({
  user: function () {
    var response;
    if (!Session.get('user')) {
      response = ReactiveMethod.call('newUser');
      if (response && response.validPlayer) {
        return Session.set('user', response);
      }
    } else {
      return Session.get('user');
    }
  },
  allready:function(){
    var check = PlayerSlots.find({}).fetch();
    if(check.length < 4){
      return true;
    } else {
      return false;
    }
  }
});

/**
 * Events
 */
Template.canvas.events({
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
    var event = {clicks: click, user:Session.get('user'), timestamp:Date.now()};
    Meteor.call('addEvent', event);
  },
  'click #reset':function(){
    Meteor.call('reset');
  }
});


/**
 * On render
 */
Template.canvas.onRendered(function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var imageObj = new Image();
  var lastServerUpdate = 0;
  var lastUserInputFromServer = 0;
  window.ctx = ctx;
  viewPort.setCanvas(canvas);
  viewPort.setCtx(ctx);

  $(window).resize();

  this.autorun(function() {
    var updates = GameData.find({}, {sort: {stamp: 1}}, {limit: 10}).fetch();
    if (updates.length > 0) {
      console.log(updates);
      _.each(updates, function (elem) {
        if ( elem.stamp > lastUserInputFromServer ) {
          nodes[elem.clicks[0]][elem.clicks[1]].clickEffect(elem.user.color);
          lastUserInputFromServer = elem.stamp;
        }
      });
    }


  });

  var worlds = WorldData.find({}, {sort: {stamp: -1}}, {limit: 10}).fetch();
  var data = _.first(worlds);

  var i = 0;
  var j = 0;

  if ( data && data.world && data.stamp > lastServerUpdate ) {
    console.log('loading world data');
    data.world.forEach(function(node) {
      nodes[i][j].color = node.color;
      nodes[i][j].active = node.active;
      nodes[i][j].health = node.health;
      nodes[i][j].age = node.age;
      j++;
      if ( j === 100 ) {
        i++;
        j = 0;
      }
    });
  }

  window.running = true;

  canvas.width = gridWidth;
  canvas.height = gridHeight;

  document.addEventListener('keydown', function(e) {
    if ( e.keyCode === 32 ) {
    }
  });

});


/**
 * On render
 */
Template.header.onRendered(function () {

  // Scale the canvas to make it fit inside the browser
  scaleCanvas($(window).width(), $(window).height());


  $(window).resize(function() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();

    // Scale the canvas to make it fit inside the browser
    scaleCanvas(windowWidth, windowHeight);
  });

  $(window).resize();


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
    $('.confines-wrapper').outerWidth(size);
  }
});

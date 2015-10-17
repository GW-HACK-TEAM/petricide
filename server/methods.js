Meteor.methods({

  addEvent:function(payload){
    if(payload){
      payload.stamp = Date.now();
      Streamy.broadcast('playerAction', payload);
      nodes[payload.clicks[0]][payload.clicks[1]].clickEffect(payload.user.color, function() {});
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
  updateWorld: function(world) {
    check(world, Array);

    WorldData.remove({});
    WorldData.insert({
      world: world,
      stamp: Date.now()
    });
  }
});

var restartFrequency = 1000 * 60 * 5;
setTimeout(function(){
  process.exit();
}, restartFrequency);
